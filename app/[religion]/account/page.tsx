"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { RELIGION_THEMES } from "../../constants/Religions";
import { ReligionKey } from "../../types/Religion";
import { useAuth } from "../../context/AuthContext";
import {
  IDocument,
  getMyDocument,
  createDocument,
  updateDocument,
  fileToBase64,
} from "../../services/document.service";

interface PageProps {
  params: Promise<{ religion: string }>;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const MARITAL_STATUS = ["Single", "Divorced", "Widowed"];
const RELIGIONS_LIST = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];

type FormState = Partial<IDocument>;

const EMPTY_FORM: FormState = {
  mobileNumber: "",
  emailId: "",
  selectedState: "",
  dateOfMarriage: "",
  venueOfMarriage: "",
  groomEmail: "",
  groomMobile: "",
  groomOtherInfoOccupation: "",
  groomOtherInfoReligion: "",
  groomOtherInfoMaritalStatus: "",
  brideOtherInfoOccupation: "",
  brideOtherInfoReligion: "",
  brideOtherInfoMaritalStatus: "",
  witness1PhoneNumber: "",
  witness2PhoneNumber: "",
  witness3PhoneNumber: "",
  additionalDocumentWitness1Name: "",
  additionalDocumentWitness2Name: "",
  additionalDocumentWitness3Name: "",
  groomAadharFront: "",
  groomAadharBack: "",
  brideAadharFront: "",
  brideAadharBack: "",
  marriageProofPhoto: "",
  marriageProofCoupleImage: "",
};

export default function AccountPage({ params }: PageProps) {
  const { religion } = use(params);
  const theme = RELIGION_THEMES[religion as ReligionKey];
  const { user, token, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const [document, setDocument] = useState<IDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${religion}/login`);
    }
  }, [isLoggedIn, religion, router]);

  // Fetch document on mount
  useEffect(() => {
    if (!token) return;
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const doc = await getMyDocument(token);
        setDocument(doc);
        if (doc) {
          setForm({
            mobileNumber: doc.mobileNumber || "",
            emailId: doc.emailId || "",
            selectedState: doc.selectedState || "",
            dateOfMarriage: doc.dateOfMarriage ? doc.dateOfMarriage.split("T")[0] : "",
            venueOfMarriage: doc.venueOfMarriage || "",
            groomEmail: doc.groomEmail || "",
            groomMobile: doc.groomMobile || "",
            groomOtherInfoOccupation: doc.groomOtherInfoOccupation || "",
            groomOtherInfoReligion: doc.groomOtherInfoReligion || "",
            groomOtherInfoMaritalStatus: doc.groomOtherInfoMaritalStatus || "",
            brideOtherInfoOccupation: doc.brideOtherInfoOccupation || "",
            brideOtherInfoReligion: doc.brideOtherInfoReligion || "",
            brideOtherInfoMaritalStatus: doc.brideOtherInfoMaritalStatus || "",
            witness1PhoneNumber: doc.witness1PhoneNumber || "",
            witness2PhoneNumber: doc.witness2PhoneNumber || "",
            witness3PhoneNumber: doc.witness3PhoneNumber || "",
            additionalDocumentWitness1Name: doc.additionalDocumentWitness1Name || "",
            additionalDocumentWitness2Name: doc.additionalDocumentWitness2Name || "",
            additionalDocumentWitness3Name: doc.additionalDocumentWitness3Name || "",
          });
        }
      } catch {
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [token]);

  if (!theme || !isLoggedIn) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const setField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p:any) => ({ ...p, [field]: e.target.value }));

  const handleImageUpload = (field: keyof FormState) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setForm((p:any) => ({ ...p, [field]: base64 }));
  };

  const handleSubmit = async () => {
    if (!form.mobileNumber || !form.selectedState || !form.dateOfMarriage || !form.venueOfMarriage) {
      setErrorMsg("Please fill in all required fields: Mobile, State, Marriage Date, and Venue.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (document?._id) {
        await updateDocument(document._id, form, token!);
        setSuccessMsg("Details updated successfully!");
        const updated = await getMyDocument(token!);
        setDocument(updated);
      } else {
        await createDocument(form, token!);
        setSuccessMsg("Registration details submitted successfully!");
        const created = await getMyDocument(token!);
        setDocument(created);
      }
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 9, border: "1.5px solid #e0f2f1",
    fontSize: "0.88rem", fontFamily: "'Lato', sans-serif", color: "#0f4c4c",
    background: "#fafffe", outline: "none", boxSizing: "border-box",
  };
  const selectBase: React.CSSProperties = { ...inputBase };

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5, letterSpacing: "0.02em" }}>
      {text} {required && <span style={{ color: "#0d9488" }}>*</span>}
    </label>
  );

  const SectionHeading = ({ title, sub }: { title: string; sub?: string }) => (
    <div style={{ marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e0f2f1" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h3>
      {sub && <p style={{ fontSize: "0.78rem", color: "#6b9e9e", marginTop: 3 }}>{sub}</p>}
    </div>
  );

  const FileInput = ({ field, label }: { field: keyof FormState; label: string }) => {
    const val = form[field] as string;
    const hasExistingFile = document?.[field as keyof IDocument] && !(document[field as keyof IDocument] as string)?.startsWith("data:");
    return (
      <div>
        <Label text={label} />
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", borderRadius: 9, border: "1.5px dashed #99f6e4", background: "#f0fdfa", cursor: "pointer", gap: "0.4rem" }}>
          <input type="file" accept="image/*" onChange={handleImageUpload(field)} style={{ display: "none" }} />
          {val && val.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={val} alt={label} style={{ height: 60, objectFit: "contain", borderRadius: 4 }} />
          ) : hasExistingFile ? (
            <div style={{ fontSize: "0.78rem", color: "#0d9488", fontWeight: 600 }}>✓ Uploaded — click to replace</div>
          ) : (
            <>
              <span style={{ fontSize: "1.4rem" }}>📎</span>
              <span style={{ fontSize: "0.75rem", color: "#6b9e9e" }}>Click to upload {label}</span>
            </>
          )}
        </label>
      </div>
    );
  };

  const DetailRow = ({ label, value }: { label: string; value?: string }) => (
    value ? (
      <div style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #f0fdfa" }}>
        <span style={{ fontSize: "0.8rem", color: "#6b9e9e", minWidth: 180, flexShrink: 0, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: "0.88rem", color: "#0f4c4c", fontWeight: 500 }}>{value}</span>
      </div>
    ) : null
  );

  const StatusBadge = () => {
    if (document?.isDocumentVerified) return (
      <span style={{ padding: "4px 14px", borderRadius: 999, background: "#dcfce7", color: "#16a34a", fontSize: "0.78rem", fontWeight: 700 }}>✓ Verified</span>
    );
    if (document?.remark) return (
      <span style={{ padding: "4px 14px", borderRadius: 999, background: "#fef2f2", color: "#dc2626", fontSize: "0.78rem", fontWeight: 700 }}>✗ Action Required</span>
    );
    return (
      <span style={{ padding: "4px 14px", borderRadius: 999, background: "#fef9c3", color: "#a16207", fontSize: "0.78rem", fontWeight: 700 }}>⏳ Under Review</span>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fafffe", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus, textarea:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
      `}</style>

      <Navbar religionKey={theme.key} />

      {/* Header */}
      <div style={{ backgroundImage: `url(${theme.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", padding: "2.5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ccfbf1", marginBottom: "0.4rem" }}>My Account</div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", marginTop: "0.3rem" }}>{user?.email} · {user?.phone}</p>
          </div>
          <button
            onClick={() => { logout(); router.push(`/${religion}`); }}
            style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.84rem", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#6b9e9e" }}>Loading your details...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem", alignItems: "start" }}>

            {/* ── Sidebar ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Profile card */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e0f2f1", padding: "1.5rem", textAlign: "center", boxShadow: "0 2px 12px rgba(13,148,136,0.05)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #0d9488, #0f4c4c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif" }}>{user?.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#6b9e9e", marginTop: 4 }}>{user?.email}</div>
                <div style={{ fontSize: "0.78rem", color: "#6b9e9e" }}>{user?.phone}</div>
                {document && (
                  <div style={{ marginTop: "1rem" }}>
                    <StatusBadge />
                  </div>
                )}
              </div>

              {/* Status card */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e0f2f1", padding: "1.25rem", boxShadow: "0 2px 12px rgba(13,148,136,0.05)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f4c4c", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Application Status</div>
                {document ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {[
                      { label: "Details Submitted", done: true },
                      { label: "Under Review", done: true },
                      { label: "Verified", done: !!document.isDocumentVerified },
                      { label: "Certificate Issued", done: false },
                    ].map((step) => (
                      <div key={step.label} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: step.done ? "#0d9488" : "#e0f2f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {step.done && <span style={{ color: "#fff", fontSize: "0.6rem" }}>✓</span>}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: step.done ? "#0f4c4c" : "#6b9e9e", fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "#6b9e9e", lineHeight: 1.6 }}>No registration submitted yet. Fill in the form to begin.</p>
                )}
              </div>

              {document?.remark && (
                <div style={{ background: "#fef2f2", borderRadius: 12, border: "1px solid #fecaca", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", marginBottom: "0.4rem" }}>Action Required</div>
                  <p style={{ fontSize: "0.82rem", color: "#7f1d1d", lineHeight: 1.6 }}>{document.remark}</p>
                </div>
              )}
            </div>

            {/* ── Main Content ── */}
            <div>
              {/* Success / Error messages */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ padding: "12px 16px", borderRadius: 9, background: "#dcfce7", border: "1px solid #86efac", color: "#15803d", fontSize: "0.88rem", marginBottom: "1.25rem", fontWeight: 600 }}>
                    ✓ {successMsg}
                  </motion.div>
                )}
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ padding: "12px 16px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── VIEW MODE ── */}
              {document && !isEditing ? (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e0f2f1", padding: "2rem", boxShadow: "0 2px 16px rgba(13,148,136,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif" }}>Registration Details</h2>
                      <p style={{ fontSize: "0.78rem", color: "#6b9e9e", marginTop: 3 }}>
                        Submitted on {document.createdAt ? new Date(document.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setIsEditing(true); setSuccessMsg(""); setErrorMsg(""); }}
                      style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0d9488, #0f4c4c)", color: "#fff", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                      ✏️ Edit Details
                    </motion.button>
                  </div>

                  {/* Basic Info */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentTeal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Basic Information</div>
                    <DetailRow label="Mobile Number" value={document.mobileNumber} />
                    <DetailRow label="Email ID" value={document.emailId} />
                    <DetailRow label="State of Marriage" value={document.selectedState} />
                    <DetailRow label="Date of Marriage" value={document.dateOfMarriage ? new Date(document.dateOfMarriage).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : undefined} />
                    <DetailRow label="Venue of Marriage" value={document.venueOfMarriage} />
                  </div>

                  {/* Groom */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentTeal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Groom Details</div>
                    <DetailRow label="Groom Mobile" value={document.groomMobile} />
                    <DetailRow label="Groom Email" value={document.groomEmail} />
                    <DetailRow label="Occupation" value={document.groomOtherInfoOccupation} />
                    <DetailRow label="Religion" value={document.groomOtherInfoReligion} />
                    <DetailRow label="Marital Status" value={document.groomOtherInfoMaritalStatus} />
                  </div>

                  {/* Bride */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentTeal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Bride Details</div>
                    <DetailRow label="Occupation" value={document.brideOtherInfoOccupation} />
                    <DetailRow label="Religion" value={document.brideOtherInfoReligion} />
                    <DetailRow label="Marital Status" value={document.brideOtherInfoMaritalStatus} />
                  </div>

                  {/* Witnesses
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: theme.accentTeal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Witnesses</div>
                    <DetailRow label="Witness 1 Name" value={document.additionalDocumentWitness1Name} />
                    <DetailRow label="Witness 1 Phone" value={document.witness1PhoneNumber} />
                    <DetailRow label="Witness 2 Name" value={document.additionalDocumentWitness2Name} />
                    <DetailRow label="Witness 2 Phone" value={document.witness2PhoneNumber} />
                    <DetailRow label="Witness 3 Name" value={document.additionalDocumentWitness3Name} />
                    <DetailRow label="Witness 3 Phone" value={document.witness3PhoneNumber} />
                  </div> */}
                </div>
              ) : (
                /* ── FORM MODE ── */
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e0f2f1", padding: "2rem", boxShadow: "0 2px 16px rgba(13,148,136,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {document ? "Edit Registration Details" : "Start Your Registration"}
                      </h2>
                      <p style={{ fontSize: "0.78rem", color: "#6b9e9e", marginTop: 3 }}>
                        Fields marked <span style={{ color: "#0d9488" }}>*</span> are required
                      </p>
                    </div>
                    {document && (
                      <button onClick={() => { setIsEditing(false); setErrorMsg(""); setSuccessMsg(""); }}
                        style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e0f2f1", background: "#fff", color: "#6b9e9e", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                        Cancel
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                    {/* ── Section 1: Basic Info ── */}
                    <div>
                      <SectionHeading title="Basic Information" sub="Contact and marriage details" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <Label text="Your Mobile Number" required />
                          <input style={inputBase} placeholder="10-digit mobile" value={form.mobileNumber} onChange={setField("mobileNumber")} maxLength={10} />
                        </div>
                        <div>
                          <Label text="Your Email ID" />
                          <input type="email" style={inputBase} placeholder="you@example.com" value={form.emailId} onChange={setField("emailId")} />
                        </div>
                        <div>
                          <Label text="State of Marriage" required />
                          <select style={selectBase} value={form.selectedState} onChange={setField("selectedState")}>
                            <option value="">Select state...</option>
                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label text="Date of Marriage" required />
                          <input type="date" style={{ ...inputBase, colorScheme: "light" }} value={form.dateOfMarriage} onChange={setField("dateOfMarriage")} />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <Label text="Venue of Marriage" required />
                          <input style={inputBase} placeholder="Full address of the marriage venue" value={form.venueOfMarriage} onChange={setField("venueOfMarriage")} />
                        </div>
                      </div>
                    </div>

                    {/* ── Section 2: Groom ── */}
                    <div>
                      <SectionHeading title="Groom Details" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <Label text="Groom Mobile" />
                          <input style={inputBase} placeholder="10-digit mobile" value={form.groomMobile} onChange={setField("groomMobile")} maxLength={10} />
                        </div>
                        <div>
                          <Label text="Groom Email" />
                          <input type="email" style={inputBase} placeholder="groom@example.com" value={form.groomEmail} onChange={setField("groomEmail")} />
                        </div>
                        <div>
                          <Label text="Occupation" />
                          <input style={inputBase} placeholder="e.g. Engineer, Teacher" value={form.groomOtherInfoOccupation} onChange={setField("groomOtherInfoOccupation")} />
                        </div>
                        <div>
                          <Label text="Religion" />
                          <select style={selectBase} value={form.groomOtherInfoReligion} onChange={setField("groomOtherInfoReligion")}>
                            <option value="">Select...</option>
                            {RELIGIONS_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label text="Marital Status" />
                          <select style={selectBase} value={form.groomOtherInfoMaritalStatus} onChange={setField("groomOtherInfoMaritalStatus")}>
                            <option value="">Select...</option>
                            {MARITAL_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* ── Section 3: Bride ── */}
                    <div>
                      <SectionHeading title="Bride Details" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <Label text="Occupation" />
                          <input style={inputBase} placeholder="e.g. Doctor, Homemaker" value={form.brideOtherInfoOccupation} onChange={setField("brideOtherInfoOccupation")} />
                        </div>
                        <div>
                          <Label text="Religion" />
                          <select style={selectBase} value={form.brideOtherInfoReligion} onChange={setField("brideOtherInfoReligion")}>
                            <option value="">Select...</option>
                            {RELIGIONS_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label text="Marital Status" />
                          <select style={selectBase} value={form.brideOtherInfoMaritalStatus} onChange={setField("brideOtherInfoMaritalStatus")}>
                            <option value="">Select...</option>
                            {MARITAL_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* ── Section 4: Witnesses ── */}
                    {/* <div>
                      <SectionHeading title="Witnesses" sub="Minimum 2 witnesses required" />
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {[1, 2, 3].map((n) => (
                          <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem", borderRadius: 10, background: "#f0fdfa", border: "1px solid #e0f2f1" }}>
                            <div>
                              <Label text={`Witness ${n} Name`} required={n <= 2} />
                              <input style={inputBase} placeholder={`Full name of witness ${n}`}
                                value={form[`additionalDocumentWitness${n}Name` as keyof FormState] as string}
                                onChange={setField(`additionalDocumentWitness${n}Name` as keyof FormState)} />
                            </div>
                            <div>
                              <Label text={`Witness ${n} Phone`} required={n <= 2} />
                              <input style={inputBase} placeholder="10-digit mobile" maxLength={10}
                                value={form[`witness${n}PhoneNumber` as keyof FormState] as string}
                                onChange={setField(`witness${n}PhoneNumber` as keyof FormState)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* ── Section 5: Documents ── */}
                    <div>
                      <SectionHeading title="Upload Documents" sub="Upload clear photos or scans of the following" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <FileInput field="groomAadharFront" label="Groom Aadhar (Front)" />
                        <FileInput field="groomAadharBack" label="Groom Aadhar (Back)" />
                        <FileInput field="brideAadharFront" label="Bride Aadhar (Front)" />
                        <FileInput field="brideAadharBack" label="Bride Aadhar (Back)" />
                        <FileInput field="marriageProofPhoto" label="Marriage Proof Photo" />
                        <FileInput field="marriageProofCoupleImage" label="Couple Photo" />
                      </div>
                    </div>

                    {/* ── Submit ── */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", paddingTop: "0.5rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                          padding: "14px 32px", borderRadius: 10, border: "none",
                          background: submitting ? "#6b9e9e" : "linear-gradient(135deg, #0d9488, #0f4c4c)",
                          color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                          cursor: submitting ? "not-allowed" : "pointer",
                          fontFamily: "'Lato', sans-serif",
                        }}
                      >
                        {submitting ? "Submitting..." : document ? "Update Details →" : "Submit Registration →"}
                      </motion.button>
                      <p style={{ fontSize: "0.75rem", color: "#6b9e9e", lineHeight: 1.5 }}>
                        You can edit these details after submission.<br />
                        Our team will review within 1–2 working days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer style={{ background: "#0a3a3a", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
        © 2024 Register My Marriage · All Rights Reserved
      </footer>
    </div>
  );
}