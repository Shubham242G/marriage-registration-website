// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  isLoading: true,
  refreshToken: async () => false,
});

export const useAuth = () => useContext(AuthContext);

// Session Configuration
const SESSION_CONFIG = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  ACTIVITY_CHECK_INTERVAL: 30 * 1000, // 30 seconds
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenExpiryRef = useRef<number | null>(null);
  const refreshInProgressRef = useRef<boolean>(false);

  // Clear auth storage
  const clearAuthStorage = () => {
    localStorage.removeItem("rmm_token");
    localStorage.removeItem("rmm_user");
    localStorage.removeItem("rmm_token_expiry");
    localStorage.removeItem("rmm_last_activity");
  };

  // Perform logout
  const performLogout = () => {
    setUser(null);
    setToken(null);
    tokenExpiryRef.current = null;
    lastActivityRef.current = Date.now();
    refreshInProgressRef.current = false;
    
    clearAuthStorage();
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (activityCheckIntervalRef.current) {
      clearInterval(activityCheckIntervalRef.current);
      activityCheckIntervalRef.current = null;
    }
  };

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("rmm_token");
      const savedUser = localStorage.getItem("rmm_user");
      const savedTokenExpiry = localStorage.getItem("rmm_token_expiry");
      const savedLastActivity = localStorage.getItem("rmm_last_activity");

      if (savedToken && savedUser && savedTokenExpiry) {
        const expiryTime = parseInt(savedTokenExpiry, 10);
        const currentTime = Date.now();

        if (currentTime < expiryTime) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          tokenExpiryRef.current = expiryTime;
          
          const lastActivity = savedLastActivity ? parseInt(savedLastActivity, 10) : currentTime;
          lastActivityRef.current = lastActivity;
          
          if (currentTime - lastActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
            performLogout();
          }
        } else {
          clearAuthStorage();
        }
      }
    } catch (error) {
      console.error("Auth rehydration error:", error);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup activity tracking and session management
  useEffect(() => {
    if (!user || !token) return;

    const handleActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      localStorage.setItem("rmm_last_activity", now.toString());
      resetInactivityTimer();
    };

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      
      inactivityTimerRef.current = setTimeout(() => {
        performLogout();
        router.push("/login?session=expired");
      }, SESSION_CONFIG.INACTIVITY_TIMEOUT);
    };

    const checkAndRefreshToken = async () => {
      if (!tokenExpiryRef.current) return;
      
      const now = Date.now();
      const timeUntilExpiry = tokenExpiryRef.current - now;
      
      if (timeUntilExpiry <= 0) {
        performLogout();
        router.push("/login?session=expired");
        return;
      }
      
      if (timeUntilExpiry <= SESSION_CONFIG.REFRESH_THRESHOLD && !refreshInProgressRef.current) {
        await refreshToken();
      }
    };

    const startActivityCheck = () => {
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      
      activityCheckIntervalRef.current = setInterval(() => {
        const now = Date.now();
        
        if (now - lastActivityRef.current > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
          performLogout();
          router.push("/login?session=expired");
          return;
        }
        
        checkAndRefreshToken();
      }, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();
    startActivityCheck();

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [user, token]);

  const login = (userData: AuthUser, tokenData: string) => {
    const now = Date.now();
    const expiryTime = now + SESSION_CONFIG.TOKEN_EXPIRY;
    
    setUser(userData);
    setToken(tokenData);
    tokenExpiryRef.current = expiryTime;
    lastActivityRef.current = now;
    refreshInProgressRef.current = false;
    
    localStorage.setItem("rmm_token", tokenData);
    localStorage.setItem("rmm_user", JSON.stringify(userData));
    localStorage.setItem("rmm_token_expiry", expiryTime.toString());
    localStorage.setItem("rmm_last_activity", now.toString());
  };

  const refreshToken = async (): Promise<boolean> => {
    if (refreshInProgressRef.current) return false;
    
    try {
      refreshInProgressRef.current = true;
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const currentToken = localStorage.getItem("rmm_token");
      
      if (!currentToken) return false;
      
      const storedUser = localStorage.getItem("rmm_user");
      if (!storedUser) return false;
      
      const userObj = JSON.parse(storedUser);
      
      const response = await fetch(`${BASE_URL}/users/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: userObj.email,
          token: currentToken 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const now = Date.now();
          const expiryTime = now + SESSION_CONFIG.TOKEN_EXPIRY;
          
          setToken(data.token);
          tokenExpiryRef.current = expiryTime;
          localStorage.setItem("rmm_token", data.token);
          localStorage.setItem("rmm_token_expiry", expiryTime.toString());
          
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("rmm_user", JSON.stringify(data.user));
          }
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    } finally {
      refreshInProgressRef.current = false;
    }
  };

  const logout = () => {
    performLogout();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoggedIn: !!user && !!token,
      isLoading,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}