"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  ReactNode,
  MouseEvent,
} from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";
import { RELIGION_THEMES } from "../../constants/Religions";
import type { ReligionKey } from "../../types/Religion";
import { useAuth } from "../../context/AuthContext";
import {
  getMyDocument,
  createDocument,
  updateDocument,
  fileToBase64,
} from "../../services/document.service";

type FormState = Record<string, any>;
type DocumentData = Record<string, any>;
type ImageField = string;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

const RELIGIONS = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
  "Other",
];

const MARITAL_STATUS = ["Single", "Divorced", "Widowed"];

const EMPTY_FORM: FormState = {
  mobileNumber: "",
  emailId: "",
  selectedState: "",
  dateOfMarriage: "",
  venueOfMarriage: "",

  groomMobile: "",
  groomEmail: "",
  groomOtherInfoOccupation: "",
  groomOtherInfoReligion: "",
  groomOtherInfoMaritalStatus: "",
  groomOtherInfoResidingSinceYear: "",

  brideOtherInfoOccupation: "",
  brideOtherInfoReligion: "",
  brideOtherInfoMaritalStatus: "",
  brideOtherInfoResidingSinceYear: "",

  groomIdProofType: "AADHAR",
  groomAadharFront: "",
  groomAadharBack: "",
  groomVoterIdFront: "",
  groomVoterIdBack: "",

  groomBirthProofType: "PASSPORT",
  groomPassportFront: "",
  groomPassportBack: "",
  groomBirthCertificateImage: "",

  brideAadharFront: "",
  brideAadharBack: "",
  brideOtherProofImage: "",
  brideOtherProofName: "",
  brideBirthProofImage: "",
  brideBirthProofName: "",

  marriageProofPhoto: "",
  marriageProofCoupleImage: "",
  marriageProofInvitation: "",

  religiousCertificateType: "NONE",
  religiousCertificateImage: "",
  religiousCertificateName: "",
  religiousAuthorityName: "",
  religiousCertificateDate: "",
  religiousCertificateNumber: "",

  additionalDocumentWitness1Name: "",
  additionalDocumentWitness2Name: "",
  witness1PhoneNumber: "",
  witness2PhoneNumber: "",
  witness1AadharFront: "",
  witness1AadharBack: "",
  witness1PanCardPhoto: "",
  witness2AadharFront: "",
  witness2AadharBack: "",
  witness2PanCardPhoto: "",

  signatureImageGroom: "",
  signatureImageBride: "",
  signatureImageWitness1: "",
  signatureImageWitness2: "",
};

const toDateInput = (value: unknown): string => {
  if (!value) return "";

  const d = new Date(value as string | number | Date);

  return Number.isNaN(d.getTime())
    ? ""
    : d.toISOString().split("T")[0];
};

const documentToForm = (doc: DocumentData): FormState => {
  const next: FormState = { ...EMPTY_FORM };

  Object.keys(doc || {}).forEach((key) => {
    if (doc[key] !== undefined && doc[key] !== null) {
      next[key] =
        key === "dateOfMarriage" ||
        key === "religiousCertificateDate"
          ? toDateInput(doc[key])
          : doc[key];
    }
  });

  if (!next.groomIdProofType) {
    next.groomIdProofType = "AADHAR";
  }

  if (!next.groomBirthProofType) {
    next.groomBirthProofType = "PASSPORT";
  }

  if (!next.religiousCertificateType) {
    next.religiousCertificateType = "NONE";
  }

  return next;
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 9,
  border: "1.5px solid #e0f2f1",
  fontSize: "0.88rem",
  color: "#0f4c4c",
  background: "#fafffe",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

function Label({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#0f4c4c",
        marginBottom: 5,
      }}
      onClick={(e) => {
        // Prevent an enclosing clickable element from handling
        // label clicks as navigation.
        e.stopPropagation();
      }}
    >
      {children}{" "}
      {required && <span style={{ color: "#0d9488" }}>*</span>}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        padding: "1.5rem 0",
        borderBottom: "1px solid #e0f2f1",
      }}
    >
      <h3
        style={{
          color: "#0f4c4c",
          fontSize: "1.05rem",
          marginBottom: "1rem",
          fontFamily: "Georgia, serif",
        }}
      >
        {title}
      </h3>

      {children}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "1rem",
      }}
    >
      {children}
    </div>
  );
}

function FileInput({
  field,
  label,
  required = false,
  value,
  existing,
  onUpload,
}: {
  field: ImageField;
  label: string;
  required?: boolean;
  value: string;
  existing?: unknown;
  onUpload: (field: ImageField, file: File) => Promise<void>;
}) {
  const uploaded =
    typeof value === "string" && value.startsWith("data:");

  const hasExisting = Boolean(existing && !uploaded);

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();

    const file = e.target.files?.[0];

    // Allows the same file to be selected again.
    e.target.value = "";

    if (!file) return;

    await onUpload(field, file);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Label required={required}>{label}</Label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 82,
          padding: 12,
          borderRadius: 9,
          border: "1.5px dashed #99f6e4",
          background: "#f0fdfa",
          cursor: "pointer",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          style={{ display: "none" }}
        />

        {uploaded ? (
          value.startsWith("data:image/") ? (
            <img
              src={value}
              alt={label}
              style={{
                maxHeight: 65,
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: 4,
              }}
            />
          ) : (
            <span
              style={{
                color: "#0d9488",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              ✓ File selected — click to replace
            </span>
          )
        ) : hasExisting ? (
          <span
            style={{
              color: "#0d9488",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            ✓ Uploaded — click to replace
          </span>
        ) : (
          <span
            style={{
              color: "#6b9e9e",
              fontSize: "0.78rem",
            }}
          >
            📎 Click to upload
          </span>
        )}
      </label>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();

  const religion =
    typeof params?.religion === "string"
      ? params.religion
      : "";

  const theme = RELIGION_THEMES[religion as ReligionKey];

  const {
    token,
    isLoggedIn,
    logout,
  } = useAuth();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const loadedTokenRef = useRef<string | null>(null);
  const redirectingRef = useRef(false);
  const [authChecked, setAuthChecked] = useState(false);

  /*
   * AUTH CHECK - Check if user is logged in
   */
  useEffect(() => {
    // Prevent multiple redirects
    if (redirectingRef.current) return;

    // Only check auth after component mounts and localStorage is read
    const checkAuth = () => {
      const savedToken = localStorage.getItem("rmm_token");
      const savedUser = localStorage.getItem("rmm_user");
      
      console.log("🔐 Auth Check:", { 
        isLoggedIn, 
        token: token ? "present" : "null",
        savedToken: savedToken ? "present" : "null",
        savedUser: savedUser ? "present" : "null"
      });

      // If not logged in via context but has localStorage, try to restore
      if (!isLoggedIn && !token && savedToken && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // We can't call login here without exposing it, so we'll just trust localStorage
          console.log("✅ Found saved auth data");
        } catch (error) {
          console.error("❌ Invalid saved auth data");
        }
      }

      // If not logged in, redirect to login
      if (!isLoggedIn && !token) {
        console.log("❌ Not logged in, redirecting to login");
        redirectingRef.current = true;
        router.replace(`/${religion}/login`);
        return;
      }

      // Auth is valid
      setAuthChecked(true);
    };

    // Small delay to ensure localStorage is read
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isLoggedIn, token, religion, router]);

  /*
   * LOAD DOCUMENT - Only when authenticated
   */
  useEffect(() => {
    // Don't load if not authenticated or auth hasn't been checked yet
    if (!authChecked || !isLoggedIn || !token) return;

    // Prevent duplicate loads with same token
    if (loadedTokenRef.current === token) {
      return;
    }

    loadedTokenRef.current = token;

    const load = async () => {
      setLoading(true);
      try {
        console.log("📄 Loading document with token:", token);
        const result = await getMyDocument(token);
        console.log("📄 Document loaded:", result);

        if (result) {
          setDocument(result);
          setForm(documentToForm(result));
        }
      } catch (error: any) {
        console.error("❌ Error loading document:", error);
        // If unauthorized, redirect to login
        if (error?.response?.status === 401) {
          logout();
          router.replace(`/${religion}/login`);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, isLoggedIn, authChecked, religion, router, logout]);

  useEffect(() => {
  const groomReligion = String(form.groomOtherInfoReligion || "").trim();
  
  if (groomReligion === "Sikh") {
    setForm(prev => ({
      ...prev,
      religiousCertificateType: "SIKH"
    }));
  } else if (groomReligion === "Muslim") {
    setForm(prev => ({
      ...prev,
      religiousCertificateType: "MUSLIM"
    }));
  } else if (groomReligion === "Christian") {
    setForm(prev => ({
      ...prev,
      religiousCertificateType: "CHRISTIAN"
    }));
  } else if (groomReligion === "Hindu" || groomReligion === "Buddhist" || groomReligion === "Jain" || groomReligion === "Other") {
    setForm(prev => ({
      ...prev,
      religiousCertificateType: "NONE"
    }));
  }
}, [form.groomOtherInfoReligion]);

  /*
   * CHANGE FORM FIELD
   *
   * stopPropagation prevents any parent clickable
   * component from receiving the click/change event.
   */
  const setField = useCallback(
    (field: string) =>
      (
        e: ChangeEvent<
          HTMLInputElement | HTMLSelectElement
        >
      ) => {
        e.stopPropagation();

        const value = e.target.value;

        setForm((prev: FormState) => ({
          ...prev,
          [field]: value,
        }));
      },
    []
  );

  /*
   * UPLOAD
   */
  const handleUpload = useCallback(
    async (field: ImageField, file: File) => {
      try {
        const base64 = await fileToBase64(file);

        setForm((prev: FormState) => ({
          ...prev,
          [field]: base64,
        }));

        setErrorMsg("");
      } catch {
        setErrorMsg(
          `Could not read ${field}. Please select another image or PDF.`
        );
      }
    },
    []
  );

  /*
   * SUBMIT
   */
  const submit = async () => {
  if (!token) {
    setErrorMsg("Your session has expired. Please log in again.");
    return;
  }

  setErrorMsg("");
  setSuccessMsg("");

  console.log("🚀 Submitting form with data:", {
    groomReligion: form.groomOtherInfoReligion,
    religiousCertificateType: form.religiousCertificateType,
    religiousCertificateImage: form.religiousCertificateImage ? "Present" : "Missing",
    mobileNumber: form.mobileNumber,
    selectedState: form.selectedState,
    dateOfMarriage: form.dateOfMarriage,
    venueOfMarriage: form.venueOfMarriage,
  });

  // Basic validation
  if (
    !form.mobileNumber ||
    !form.selectedState ||
    !form.dateOfMarriage ||
    !form.venueOfMarriage
  ) {
    setErrorMsg(
      "Please fill Mobile Number, State, Marriage Date and Venue."
    );
    return;
  }

  /*
   * GROOM ID
   */
  if (
    form.groomIdProofType === "AADHAR" &&
    (!form.groomAadharFront || !form.groomAadharBack)
  ) {
    setErrorMsg(
      "Please upload Groom Aadhar Front and Back."
    );
    return;
  }

  if (
    form.groomIdProofType === "VOTER_ID" &&
    (!form.groomVoterIdFront || !form.groomVoterIdBack)
  ) {
    setErrorMsg(
      "Please upload Groom Voter ID Front and Back."
    );
    return;
  }

  /*
   * GROOM BIRTH PROOF
   */
  if (
    form.groomBirthProofType === "PASSPORT" &&
    (!form.groomPassportFront || !form.groomPassportBack)
  ) {
    setErrorMsg(
      "Please upload Groom Passport Front and Back."
    );
    return;
  }

  if (
    form.groomBirthProofType === "BIRTH_CERTIFICATE" &&
    !form.groomBirthCertificateImage
  ) {
    setErrorMsg(
      "Please upload Groom 10th Birth Certificate."
    );
    return;
  }

  /*
   * MARRIAGE PROOF
   */
  if (
    !form.marriageProofPhoto ||
    !form.marriageProofCoupleImage ||
    !form.marriageProofInvitation
  ) {
    setErrorMsg(
      "Please upload both marriage photos and the invitation card."
    );
    return;
  }

  /*
   * WITNESSES
   */
  if (
    !form.witness1AadharFront ||
    !form.witness1AadharBack ||
    !form.witness1PanCardPhoto ||
    !form.witness2AadharFront ||
    !form.witness2AadharBack ||
    !form.witness2PanCardPhoto
  ) {
    setErrorMsg(
      "Please upload Aadhar Front/Back and PAN for both witnesses."
    );
    return;
  }

  /*
   * SPOUSE SIGNATURES
   */
  if (
    !form.signatureImageGroom ||
    !form.signatureImageBride
  ) {
    setErrorMsg(
      "Please upload signatures of both spouses."
    );
    return;
  }

  /*
   * RELIGIOUS CERTIFICATE - IMPROVED VALIDATION
   */
  const groomReligion = String(form.groomOtherInfoReligion || "").trim();
  console.log("🔍 Groom Religion:", groomReligion);
  console.log("🔍 Religious Certificate Type:", form.religiousCertificateType);
  console.log("🔍 Religious Certificate Image:", form.religiousCertificateImage ? "Present" : "Missing");

  // Check if religious certificate is required
  const requiresReligiousCertificate = ["Sikh", "Muslim", "Christian"].includes(groomReligion);
  
  if (requiresReligiousCertificate) {
    // Map religion to expected certificate type (case-insensitive)
    const expectedTypeMap: Record<string, string> = {
      "Sikh": "SIKH",
      "Muslim": "MUSLIM", 
      "Christian": "CHRISTIAN"
    };
    
    const expectedType = expectedTypeMap[groomReligion];
    const currentType = String(form.religiousCertificateType || "").toUpperCase();
    
    console.log(`📋 Expected: ${expectedType}, Current: ${currentType}`);
    
    // Check if certificate type matches (case-insensitive)
    if (currentType !== expectedType) {
      setErrorMsg(
        `Please select "${groomReligion}" as the Religious Certificate Type. Current: ${form.religiousCertificateType || "None selected"}`
      );
      return;
    }
    
    // Check if certificate image is uploaded
    if (!form.religiousCertificateImage) {
      setErrorMsg(
        `Please upload the ${groomReligion} religious marriage certificate image.`
      );
      return;
    }
    
    // Check if the image is actually a data URL
    if (typeof form.religiousCertificateImage === 'string' && !form.religiousCertificateImage.startsWith('data:')) {
      setErrorMsg(
        `The ${groomReligion} religious marriage certificate image appears to be invalid. Please upload it again.`
      );
      return;
    }
  }

  setSubmitting(true);

  try {
    /*
     * Do not send MongoDB metadata back as form fields.
     */
    const payload = { ...form };

    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.isDocumentVerified;
    delete payload.remark;
    delete payload.isDeleted;

    console.log("📤 Final payload:", payload);

    if (document?._id) {
      await updateDocument(
        document._id,
        payload as any,
        token
      );

      setSuccessMsg(
        "Details updated successfully!"
      );
    } else {
      await createDocument(
        payload as any,
        token
      );

      setSuccessMsg(
        "Registration submitted successfully!"
      );
    }

    /*
     * Refresh only after successful submission.
     */
    const refreshed = await getMyDocument(token);
    const refreshedDoc = refreshed as DocumentData | null;

    setDocument(refreshedDoc || null);

    if (refreshedDoc) {
      setForm(documentToForm(refreshedDoc));
    }

    setIsEditing(false);
  } catch (err: any) {
    console.error("❌ Submission error:", err);
    setErrorMsg(
      err?.message ||
      "Something went wrong. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};

   // Show loading while checking auth
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#0f4c4c",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (!theme || !isLoggedIn) {
    return null;
  }

  // Show loading while loading document
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#0f4c4c",
        }}
      >
        Loading...
      </div>
    );
  }

  /*
   * IMPORTANT:
   *
   * This prevents accidental submit/navigation if
   * this component happens to be rendered inside a
   * parent <form>.
   */
  const handleFormSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!theme || !isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "#0f4c4c",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fffd",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 1050,
          margin: "0 auto",
          padding: "2rem 1rem 4rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              color: theme.accentTeal,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Marriage Registration
          </div>

          <h1
            style={{
              color: "#0f4c4c",
              fontFamily: "Georgia, serif",
              fontSize: "2rem",
              margin: "0.4rem 0",
            }}
          >
            Document Submission
          </h1>

          <p
            style={{
              color: "#6b9e9e",
              fontSize: "0.85rem",
            }}
          >
            Submit the documents required for your
            marriage registration.
          </p>
        </div>

        {document && !isEditing ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              border: "1px solid #e0f2f1",
            }}
          >
            <h2
              style={{
                color: "#0f4c4c",
                fontFamily: "Georgia, serif",
              }}
            >
              Your Registration
            </h2>

            <p
              style={{
                color: document.isDocumentVerified
                  ? "#16a34a"
                  : document.remark
                    ? "#dc2626"
                    : "#6b9e9e",
                fontWeight: 700,
                margin: "0.5rem 0 1.5rem",
              }}
            >
              {document.isDocumentVerified
                ? "✓ Verified"
                : document.remark
                  ? "Action Required"
                  : "Under Review"}
            </p>

            {document.remark && (
              <p
                style={{
                  padding: "1rem",
                  background: "#fff7ed",
                  borderRadius: 8,
                  color: "#9a3412",
                }}
              >
                {document.remark}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setErrorMsg("");
                  setSuccessMsg("");
                  setIsEditing(true);
                }}
                style={{
                  padding: "12px 22px",
                  border: 0,
                  borderRadius: 9,
                  background: "#0f4c4c",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit Details
              </motion.button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  logout();
                }}
                style={{
                  padding: "12px 22px",
                  border:
                    "1px solid #e0f2f1",
                  borderRadius: 9,
                  background: "white",
                  color: "#0f4c4c",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          /*
           * Explicit form boundary.
           *
           * This is important because if a parent layout
           * contains a <form>, we don't want inputs on this
           * page to accidentally submit it.
           */
          <form
            onSubmit={handleFormSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              border: "1px solid #e0f2f1",
            }}
          >
            {errorMsg && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 8,
                  background: "#fef2f2",
                  color: "#b91c1c",
                }}
              >
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 8,
                  background: "#ecfdf5",
                  color: "#047857",
                }}
              >
                {successMsg}
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. BASIC MARRIAGE DETAILS */}
            {/* ========================================================= */}

            <Section title="1. Basic Marriage Details">
              <Grid>
                <div>
                  <Label required>
                    Mobile Number
                  </Label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    style={inputStyle}
                    value={form.mobileNumber}
                    onChange={setField(
                      "mobileNumber"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label>Email ID</Label>

                  <input
                    type="email"
                    style={inputStyle}
                    value={form.emailId}
                    onChange={setField("emailId")}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div>
                  <Label required>
                    State of Marriage
                  </Label>

                  <select
                    style={selectStyle}
                    value={form.selectedState}
                    onChange={setField(
                      "selectedState"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <option value="">
                      Select state
                    </option>

                    {INDIAN_STATES.map(
                      (state) => (
                        <option
                          key={state}
                          value={state}
                        >
                          {state}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label required>
                    Date of Marriage
                  </Label>

                  <input
                    type="date"
                    style={inputStyle}
                    value={
                      form.dateOfMarriage
                    }
                    onChange={setField(
                      "dateOfMarriage"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <Label required>
                    Venue of Marriage
                  </Label>

                  <input
                    style={inputStyle}
                    value={
                      form.venueOfMarriage
                    }
                    onChange={setField(
                      "venueOfMarriage"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 2. GROOM DETAILS */}
            {/* ========================================================= */}

            <Section title="2. Groom Details">
              <Grid>
                <div>
                  <Label>Mobile</Label>

                  <input
                    type="tel"
                    style={inputStyle}
                    value={form.groomMobile}
                    onChange={setField(
                      "groomMobile"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>

                  <input
                    type="email"
                    style={inputStyle}
                    value={form.groomEmail}
                    onChange={setField(
                      "groomEmail"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div>
                  <Label>Occupation</Label>

                  <input
                    style={inputStyle}
                    value={
                      form.groomOtherInfoOccupation
                    }
                    onChange={setField(
                      "groomOtherInfoOccupation"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div>
                  <Label>Religion</Label>

                  <select
                    style={selectStyle}
                    value={
                      form.groomOtherInfoReligion
                    }
                    onChange={setField(
                      "groomOtherInfoReligion"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <option value="">
                      Select religion
                    </option>

                    {RELIGIONS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label>
                    Marital Status
                  </Label>

                  <select
                    style={selectStyle}
                    value={
                      form.groomOtherInfoMaritalStatus
                    }
                    onChange={setField(
                      "groomOtherInfoMaritalStatus"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    {MARITAL_STATUS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label>
                    Residing Since Year
                  </Label>

                  <input
                    inputMode="numeric"
                    style={inputStyle}
                    value={
                      form.groomOtherInfoResidingSinceYear
                    }
                    onChange={setField(
                      "groomOtherInfoResidingSinceYear"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 3. GROOM IDENTITY */}
            {/* ========================================================= */}

            <Section title="3. Groom Identity Proof — Aadhar OR Voter ID">
              <div
                style={{
                  maxWidth: 350,
                  marginBottom: 16,
                }}
              >
                <Label required>
                  Identity Proof Type
                </Label>

                <select
                  style={selectStyle}
                  value={
                    form.groomIdProofType
                  }
                  onChange={setField(
                    "groomIdProofType"
                  )}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <option value="AADHAR">
                    Aadhar Card
                  </option>

                  <option value="VOTER_ID">
                    Voter ID
                  </option>
                </select>
              </div>

              <Grid>
                {form.groomIdProofType ===
                "AADHAR" ? (
                  <>
                    <FileInput
                      field="groomAadharFront"
                      label="Groom Aadhar — Front"
                      required
                      value={
                        form.groomAadharFront
                      }
                      existing={
                        document?.groomAadharFront
                      }
                      onUpload={handleUpload}
                    />

                    <FileInput
                      field="groomAadharBack"
                      label="Groom Aadhar — Back"
                      required
                      value={
                        form.groomAadharBack
                      }
                      existing={
                        document?.groomAadharBack
                      }
                      onUpload={handleUpload}
                    />
                  </>
                ) : (
                  <>
                    <FileInput
                      field="groomVoterIdFront"
                      label="Groom Voter ID — Front"
                      required
                      value={
                        form.groomVoterIdFront
                      }
                      existing={
                        document?.groomVoterIdFront
                      }
                      onUpload={handleUpload}
                    />

                    <FileInput
                      field="groomVoterIdBack"
                      label="Groom Voter ID — Back"
                      required
                      value={
                        form.groomVoterIdBack
                      }
                      existing={
                        document?.groomVoterIdBack
                      }
                      onUpload={handleUpload}
                    />
                  </>
                )}
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 4. GROOM BIRTH PROOF */}
            {/* ========================================================= */}

            <Section title="4. Groom Birth Proof — Passport OR 10th Birth Certificate">
              <div
                style={{
                  maxWidth: 350,
                  marginBottom: 16,
                }}
              >
                <Label required>
                  Birth Proof Type
                </Label>

                <select
                  style={selectStyle}
                  value={
                    form.groomBirthProofType
                  }
                  onChange={setField(
                    "groomBirthProofType"
                  )}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <option value="PASSPORT">
                    Passport
                  </option>

                  <option value="BIRTH_CERTIFICATE">
                    10th Birth Certificate
                  </option>
                </select>
              </div>

              <Grid>
                {form.groomBirthProofType ===
                "PASSPORT" ? (
                  <>
                    <FileInput
                      field="groomPassportFront"
                      label="Groom Passport — Front"
                      required
                      value={
                        form.groomPassportFront
                      }
                      existing={
                        document?.groomPassportFront
                      }
                      onUpload={handleUpload}
                    />

                    <FileInput
                      field="groomPassportBack"
                      label="Groom Passport — Back"
                      required
                      value={
                        form.groomPassportBack
                      }
                      existing={
                        document?.groomPassportBack
                      }
                      onUpload={handleUpload}
                    />
                  </>
                ) : (
                  <FileInput
                    field="groomBirthCertificateImage"
                    label="Groom 10th Birth Certificate"
                    required
                    value={
                      form.groomBirthCertificateImage
                    }
                    existing={
                      document?.groomBirthCertificateImage
                    }
                    onUpload={handleUpload}
                  />
                )}
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 5. BRIDE DETAILS */}
            {/* ========================================================= */}

            <Section title="5. Bride Details & Identity Documents">
              <Grid>
                <div>
                  <Label>Occupation</Label>

                  <input
                    style={inputStyle}
                    value={
                      form.brideOtherInfoOccupation
                    }
                    onChange={setField(
                      "brideOtherInfoOccupation"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <div>
                  <Label>Religion</Label>

                  <select
                    style={selectStyle}
                    value={
                      form.brideOtherInfoReligion
                    }
                    onChange={setField(
                      "brideOtherInfoReligion"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <option value="">
                      Select religion
                    </option>

                    {RELIGIONS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label>
                    Marital Status
                  </Label>

                  <select
                    style={selectStyle}
                    value={
                      form.brideOtherInfoMaritalStatus
                    }
                    onChange={setField(
                      "brideOtherInfoMaritalStatus"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    {MARITAL_STATUS.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label>
                    Residing Since Year
                  </Label>

                  <input
                    style={inputStyle}
                    value={
                      form.brideOtherInfoResidingSinceYear
                    }
                    onChange={setField(
                      "brideOtherInfoResidingSinceYear"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <FileInput
                  field="brideAadharFront"
                  label="Bride Aadhar — Front"
                  value={
                    form.brideAadharFront
                  }
                  existing={
                    document?.brideAadharFront
                  }
                  onUpload={handleUpload}
                />

                <FileInput
                  field="brideAadharBack"
                  label="Bride Aadhar — Back"
                  value={
                    form.brideAadharBack
                  }
                  existing={
                    document?.brideAadharBack
                  }
                  onUpload={handleUpload}
                />

                <div>
                  <Label>
                    Other Proof Name
                  </Label>

                  <input
                    style={inputStyle}
                    value={
                      form.brideOtherProofName
                    }
                    onChange={setField(
                      "brideOtherProofName"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <FileInput
                  field="brideOtherProofImage"
                  label="Bride Other Proof"
                  value={
                    form.brideOtherProofImage
                  }
                  existing={
                    document?.brideOtherProofImage
                  }
                  onUpload={handleUpload}
                />

                <div>
                  <Label>
                    Birth Proof Name
                  </Label>

                  <input
                    style={inputStyle}
                    value={
                      form.brideBirthProofName
                    }
                    onChange={setField(
                      "brideBirthProofName"
                    )}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  />
                </div>

                <FileInput
                  field="brideBirthProofImage"
                  label="Bride Birth Proof"
                  value={
                    form.brideBirthProofImage
                  }
                  existing={
                    document?.brideBirthProofImage
                  }
                  onUpload={handleUpload}
                />
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 6. MARRIAGE PHOTOS */}
            {/* ========================================================= */}

            <Section title="6. Marriage Photos & Invitation Card">
              <Grid>
                <FileInput
                  field="marriageProofPhoto"
                  label="Marriage Photo 1"
                  required
                  value={
                    form.marriageProofPhoto
                  }
                  existing={
                    document?.marriageProofPhoto
                  }
                  onUpload={handleUpload}
                />

                <FileInput
                  field="marriageProofCoupleImage"
                  label="Marriage Photo 2"
                  required
                  value={
                    form.marriageProofCoupleImage
                  }
                  existing={
                    document?.marriageProofCoupleImage
                  }
                  onUpload={handleUpload}
                />

                <FileInput
                  field="marriageProofInvitation"
                  label="Invitation Card"
                  required
                  value={
                    form.marriageProofInvitation
                  }
                  existing={
                    document?.marriageProofInvitation
                  }
                  onUpload={handleUpload}
                />
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* 7. RELIGIOUS CERTIFICATE */}
            {/* ========================================================= */}

            <Section title="7. Religious Marriage Certificate">
  <p
    style={{
      fontSize: "0.8rem",
      color: "#6b9e9e",
      marginBottom: 14,
    }}
  >
    Required for Sikh, Muslim or Christian applicants.
  </p>

  <Grid>
    <div>
      <Label required={["Sikh", "Muslim", "Christian"].includes(form.groomOtherInfoReligion)}>
        Certificate Type
      </Label>

      <select
        style={selectStyle}
        value={form.religiousCertificateType}
        onChange={setField("religiousCertificateType")}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="NONE">Not Applicable</option>
        <option value="SIKH">Sikh — Guru Certificate</option>
        <option value="MUSLIM">Muslim — Quazi Certificate</option>
        <option value="CHRISTIAN">Christian — Church/Father Certificate</option>
      </select>
      
      {/* Show warning if religion requires certificate but type doesn't match */}
      {["Sikh", "Muslim", "Christian"].includes(form.groomOtherInfoReligion) && 
       form.religiousCertificateType !== form.groomOtherInfoReligion.toUpperCase() && (
        <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>
          ⚠️ Please select "{form.groomOtherInfoReligion}" as the certificate type
        </p>
      )}
    </div>

    <div>
      <Label>
        Certificate Name
      </Label>

      <input
        style={inputStyle}
        value={form.religiousCertificateName}
        onChange={setField("religiousCertificateName")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    <div>
      <Label>
        Authority Name
      </Label>

      <input
        style={inputStyle}
        value={form.religiousAuthorityName}
        onChange={setField("religiousAuthorityName")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    <div>
      <Label>
        Certificate Number
      </Label>

      <input
        style={inputStyle}
        value={form.religiousCertificateNumber}
        onChange={setField("religiousCertificateNumber")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    <div>
      <Label>
        Certificate Date
      </Label>

      <input
        type="date"
        style={inputStyle}
        value={form.religiousCertificateDate}
        onChange={setField("religiousCertificateDate")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    {form.religiousCertificateType !== "NONE" && (
      <div style={{ gridColumn: "1 / -1" }}>
        <FileInput
          field="religiousCertificateImage"
          label="Religious Marriage Certificate"
          required
          value={form.religiousCertificateImage}
          existing={document?.religiousCertificateImage}
          onUpload={handleUpload}
        />
      </div>
    )}
  </Grid>
</Section>

            {/* ========================================================= */}
            {/* 8. WITNESSES */}
            {/* ========================================================= */}

            <Section title="8. Two Witnesses — Aadhar + PAN">
              {[1, 2].map((number) => {
                const nameField =
                  `additionalDocumentWitness${number}Name`;

                const phoneField =
                  `witness${number}PhoneNumber`;

                const aadharFrontField =
                  `witness${number}AadharFront`;

                const aadharBackField =
                  `witness${number}AadharBack`;

                const panField =
                  `witness${number}PanCardPhoto`;

                const signatureField =
                  `signatureImageWitness${number}`;

                return (
                  <div
                    key={number}
                    style={{
                      padding: "1rem",
                      background: "#f0fdfa",
                      borderRadius: 10,
                      marginBottom: 12,
                    }}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <h4
                      style={{
                        margin: "0 0 12px",
                        color: "#0f4c4c",
                      }}
                    >
                      Witness {number}
                    </h4>

                    <Grid>
                      <div>
                        <Label required>
                          Full Name
                        </Label>

                        <input
                          style={inputStyle}
                          value={
                            form[nameField] || ""
                          }
                          onChange={setField(
                            nameField
                          )}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        />
                      </div>

                      <div>
                        <Label>
                          Phone Number
                        </Label>

                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          style={inputStyle}
                          value={
                            form[phoneField] || ""
                          }
                          onChange={setField(
                            phoneField
                          )}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        />
                      </div>

                      <FileInput
                        field={aadharFrontField}
                        label="Aadhar — Front"
                        required
                        value={
                          form[
                            aadharFrontField
                          ] || ""
                        }
                        existing={
                          document?.[
                            aadharFrontField
                          ]
                        }
                        onUpload={handleUpload}
                      />

                      <FileInput
                        field={aadharBackField}
                        label="Aadhar — Back"
                        required
                        value={
                          form[
                            aadharBackField
                          ] || ""
                        }
                        existing={
                          document?.[
                            aadharBackField
                          ]
                        }
                        onUpload={handleUpload}
                      />

                      <FileInput
                        field={panField}
                        label="PAN Card"
                        required
                        value={
                          form[panField] || ""
                        }
                        existing={
                          document?.[panField]
                        }
                        onUpload={handleUpload}
                      />

                      <FileInput
                        field={signatureField}
                        label="Witness Signature"
                        value={
                          form[
                            signatureField
                          ] || ""
                        }
                        existing={
                          document?.[
                            signatureField
                          ]
                        }
                        onUpload={handleUpload}
                      />
                    </Grid>
                  </div>
                );
              })}
            </Section>

            {/* ========================================================= */}
            {/* 9. SIGNATURES */}
            {/* ========================================================= */}

            <Section title="9. Signatures">
              <Grid>
                <FileInput
                  field="signatureImageGroom"
                  label="Groom Signature"
                  required
                  value={
                    form.signatureImageGroom
                  }
                  existing={
                    document?.signatureImageGroom
                  }
                  onUpload={handleUpload}
                />

                <FileInput
                  field="signatureImageBride"
                  label="Bride Signature"
                  required
                  value={
                    form.signatureImageBride
                  }
                  existing={
                    document?.signatureImageBride
                  }
                  onUpload={handleUpload}
                />
              </Grid>
            </Section>

            {/* ========================================================= */}
            {/* ACTIONS */}
            {/* ========================================================= */}

            <div
              style={{
                display: "flex",
                gap: 12,
                paddingTop: "1.5rem",
              }}
            >
              {document && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setForm(
                      documentToForm(document)
                    );

                    setIsEditing(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  style={{
                    padding: "13px 22px",
                    borderRadius: 9,
                    border:
                      "1px solid #e0f2f1",
                    background: "white",
                    color: "#0f4c4c",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  submit();
                }}
                disabled={submitting}
                style={{
                  padding: "13px 28px",
                  border: 0,
                  borderRadius: 9,
                  background: submitting
                    ? "#94a3a3"
                    : "#0f4c4c",
                  color: "white",
                  cursor: submitting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: 700,
                }}
              >
                {submitting
                  ? "Submitting..."
                  : document
                    ? "Update Details"
                    : "Submit Registration"}
              </motion.button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}