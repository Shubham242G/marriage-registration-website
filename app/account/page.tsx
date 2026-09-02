"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import { RELIGION_THEMES } from "../constants/Religions";
import type { ReligionKey } from "../types/Religion";
import { useAuth } from "../context/AuthContext";
import {
  getMyDocument,
  createDocument,
  updateDocument,
  fileToBase64,
} from "../services/document.service";

type FormState = Record<string, any>;
type DocumentData = Record<string, any>;
type ImageField = string;

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

  groomIdProofType: "",
  groomAadharFront: "",
  groomAadharBack: "",
  groomVoterIdFront: "",
  groomVoterIdBack: "",

  groomBirthProofType: "",
  groomPassportFront: "",
  groomPassportBack: "",
  groomBirthCertificateImage: "",

  brideOtherInfoOccupation: "",
  brideOtherInfoReligion: "",
  brideOtherInfoMaritalStatus: "",
  brideOtherInfoResidingSinceYear: "",

  brideAadharFront: "",
  brideAadharBack: "",
  brideOtherProofImage: "",
  brideOtherProofName: "",

  brideBirthProofImage: "",
  brideBirthProofName: "",

  marriageProofPhoto: "",
  marriageProofCoupleImage: "",
  marriageProofInvitation: "",

  religiousCertificateType: "",
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

function valueOrEmpty(value: any) {
  if (value === null || value === undefined) return "";
  return value;
}

function documentToForm(document: DocumentData): FormState {
  const form: FormState = { ...EMPTY_FORM };

  Object.keys(EMPTY_FORM).forEach((key) => {
    form[key] = valueOrEmpty(document?.[key]);
  });

  return form;
}

function cleanPayload(form: FormState): FormState {
  const payload = { ...form };

  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.userId;

  delete payload.isDocumentVerified;
  delete payload.remark;
  delete payload.isDeleted;

  return payload;
}

/**
 * The backend returns:
 *
 * {
 *   message: "...",
 *   data: [...]
 * }
 *
 * Depending on the service implementation, getMyDocument()
 * may already unwrap this response. This helper supports both.
 */
function normalizeDocumentResponse(response: any): DocumentData | null {
  if (!response) {
    return null;
  }

  // Backend response:
  // { message, data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data.length > 0 ? response.data[0] : null;
  }

  // If service returns:
  // { data: document }
  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    if (response.data._id || response.data.userId) {
      return response.data;
    }
  }

  // If service already returns an array.
  if (Array.isArray(response)) {
    return response.length > 0 ? response[0] : null;
  }

  // If service already returns the document.
  if (response?._id || response?.userId) {
    return response;
  }

  return null;
}

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
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 8,
        color: "#333",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#dc2626", marginLeft: 4 }}>*</span>
      )}
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
        marginBottom: 32,
        padding: 24,
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 22,
          color: "#222",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function Grid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 20,
      }}
    >
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>

      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: 10,
          outline: "none",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: 10,
          outline: "none",
          fontSize: 14,
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: ImageField;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Allows selecting the same file again.
    event.target.value = "";

    if (!file) return;

    try {
      setUploading(true);

      const base64 = await fileToBase64(file);

      onChange(base64);
    } catch (error) {
      console.error("File upload error:", error);
      alert("Unable to process this file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label required={required}>{label}</Label>

      <div
        style={{
          border: "1px dashed #cbd5e1",
          borderRadius: 12,
          padding: 14,
          background: "#f8fafc",
        }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            width: "100%",
            fontSize: 14,
          }}
        />

        {uploading && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: "#666",
            }}
          >
            Processing file...
          </p>
        )}

        {value && !uploading && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: "#16a34a",
            }}
          >
            ✓ File selected
          </p>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();

  /**
   * RELIGION IS OPTIONAL.
   *
   * If the route is:
   * /hindu/account
   *
   * religion = "hindu"
   *
   * If the route is:
   * /account
   *
   * religion = ""
   *
   * The page still works in both cases.
   */
  const religion = (params?.religion as string) || "";

  /**
   * If religion is not selected, use Hindu only as the
   * fallback visual theme. It does NOT mean the user's
   * religion is being saved as Hindu.
   */
  const theme =
    RELIGION_THEMES[religion as ReligionKey] ||
    RELIGION_THEMES["hinduism-sikhism-buddhism-jainism"];

  const { token, isLoggedIn } = useAuth();

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [document, setDocument] = useState<DocumentData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadedTokenRef = useRef<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = useCallback(
    (field: string, value: any) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setError("");
      setSuccess("");
    },
    []
  );

  /**
   * Authentication redirect.
   *
   * If religion exists:
   * /hindu/login
   *
   * If religion does NOT exist:
   * /login
   */
  useEffect(() => {
    if (isLoggedIn) return;

    router.push(religion ? `/${religion}/login` : "/login");
  }, [isLoggedIn, religion, router]);

  /**
   * Load user's existing document.
   */
  useEffect(() => {
    if (!isLoggedIn || !token) {
      setLoading(false);
      return;
    }

    if (loadedTokenRef.current === token) {
      return;
    }

    loadedTokenRef.current = token;

    const loadDocument = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMyDocument(token);

        console.log("Document API response:", response);

        const existingDocument =
          normalizeDocumentResponse(response);

        console.log(
          "Normalized document:",
          existingDocument
        );

        if (existingDocument) {
          setDocument(existingDocument);
          setForm(documentToForm(existingDocument));
        } else {
          setDocument(null);
          setForm({ ...EMPTY_FORM });
        }
      } catch (err: any) {
        console.error("Error loading document:", err);

        setError(
          err?.message ||
            "Unable to load your marriage registration details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [token, isLoggedIn]);

  const refreshDocument = async () => {
    if (!token) return;

    try {
      const response = await getMyDocument(token);

      console.log("Refresh document response:", response);

      const existingDocument =
        normalizeDocumentResponse(response);

      if (existingDocument) {
        setDocument(existingDocument);
        setForm(documentToForm(existingDocument));
      }
    } catch (err) {
      console.error("Error refreshing document:", err);
    }
  };

  const validateForm = () => {
    if (!form.mobileNumber?.trim()) {
      return "Please enter your mobile number.";
    }

    if (!form.emailId?.trim()) {
      return "Please enter your email address.";
    }

    if (!form.selectedState?.trim()) {
      return "Please select your state.";
    }

    if (!form.dateOfMarriage) {
      return "Please select the date of marriage.";
    }

    if (!form.venueOfMarriage?.trim()) {
      return "Please enter the marriage venue.";
    }

    if (!form.groomMobile?.trim()) {
      return "Please enter the groom's mobile number.";
    }

    if (!form.groomEmail?.trim()) {
      return "Please enter the groom's email.";
    }

    if (!form.groomOtherInfoOccupation?.trim()) {
      return "Please enter the groom's occupation.";
    }

    if (!form.groomOtherInfoReligion?.trim()) {
      return "Please enter the groom's religion.";
    }

    if (!form.groomOtherInfoMaritalStatus?.trim()) {
      return "Please enter the groom's marital status.";
    }

    if (!form.groomOtherInfoResidingSinceYear) {
      return "Please enter the groom's residing-since year.";
    }

    if (!form.groomIdProofType) {
      return "Please select the groom's identity proof.";
    }

    if (form.groomIdProofType === "AADHAR") {
      if (!form.groomAadharFront) {
        return "Please upload the groom's Aadhar front.";
      }

      if (!form.groomAadharBack) {
        return "Please upload the groom's Aadhar back.";
      }
    }

    if (form.groomIdProofType === "VOTER_ID") {
      if (!form.groomVoterIdFront) {
        return "Please upload the groom's Voter ID front.";
      }

      if (!form.groomVoterIdBack) {
        return "Please upload the groom's Voter ID back.";
      }
    }

    if (!form.groomBirthProofType) {
      return "Please select the groom's birth proof.";
    }

    if (form.groomBirthProofType === "PASSPORT") {
      if (!form.groomPassportFront) {
        return "Please upload the groom's passport front.";
      }

      if (!form.groomPassportBack) {
        return "Please upload the groom's passport back.";
      }
    }

    if (
      form.groomBirthProofType === "BIRTH_CERTIFICATE" ||
      form.groomBirthProofType === "10TH_BIRTH_CERTIFICATE"
    ) {
      if (!form.groomBirthCertificateImage) {
        return "Please upload the groom's birth certificate.";
      }
    }

    if (!form.brideOtherInfoOccupation?.trim()) {
      return "Please enter the bride's occupation.";
    }

    if (!form.brideOtherInfoReligion?.trim()) {
      return "Please enter the bride's religion.";
    }

    if (!form.brideOtherInfoMaritalStatus?.trim()) {
      return "Please enter the bride's marital status.";
    }

    if (!form.brideOtherInfoResidingSinceYear) {
      return "Please enter the bride's residing-since year.";
    }

    if (!form.brideAadharFront) {
      return "Please upload the bride's Aadhar front.";
    }

    if (!form.brideAadharBack) {
      return "Please upload the bride's Aadhar back.";
    }

    if (!form.brideOtherProofImage) {
      return "Please upload the bride's other proof.";
    }

    if (!form.brideOtherProofName?.trim()) {
      return "Please enter the bride's other proof name.";
    }

    if (!form.brideBirthProofImage) {
      return "Please upload the bride's birth proof.";
    }

    if (!form.brideBirthProofName?.trim()) {
      return "Please enter the bride's birth proof name.";
    }

    if (!form.marriageProofPhoto) {
      return "Please upload the marriage proof photo.";
    }

    if (!form.marriageProofCoupleImage) {
      return "Please upload the couple photograph.";
    }

    if (!form.marriageProofInvitation) {
      return "Please upload the marriage invitation.";
    }

    /**
     * Backend expects uppercase religious certificate types.
     */
    const certificateReligion =
      String(form.religiousCertificateType || "").toUpperCase();

    if (
      certificateReligion === "SIKH" ||
      certificateReligion === "MUSLIM" ||
      certificateReligion === "CHRISTIAN"
    ) {
      if (!form.religiousCertificateImage) {
        return "Please upload the religious certificate.";
      }

      if (!form.religiousCertificateName?.trim()) {
        return "Please enter the religious certificate name.";
      }

      if (!form.religiousAuthorityName?.trim()) {
        return "Please enter the religious authority name.";
      }

      if (!form.religiousCertificateDate) {
        return "Please enter the religious certificate date.";
      }

      if (!form.religiousCertificateNumber?.trim()) {
        return "Please enter the religious certificate number.";
      }
    }

    if (!form.additionalDocumentWitness1Name?.trim()) {
      return "Please enter witness 1 name.";
    }

    if (!form.additionalDocumentWitness2Name?.trim()) {
      return "Please enter witness 2 name.";
    }

    if (!form.witness1PhoneNumber?.trim()) {
      return "Please enter witness 1 phone number.";
    }

    if (!form.witness2PhoneNumber?.trim()) {
      return "Please enter witness 2 phone number.";
    }

    if (!form.witness1AadharFront) {
      return "Please upload witness 1 Aadhar front.";
    }

    if (!form.witness1AadharBack) {
      return "Please upload witness 1 Aadhar back.";
    }

    if (!form.witness1PanCardPhoto) {
      return "Please upload witness 1 PAN card.";
    }

    if (!form.witness2AadharFront) {
      return "Please upload witness 2 Aadhar front.";
    }

    if (!form.witness2AadharBack) {
      return "Please upload witness 2 Aadhar back.";
    }

    if (!form.witness2PanCardPhoto) {
      return "Please upload witness 2 PAN card.";
    }

    if (!form.signatureImageGroom) {
      return "Please upload the groom's signature.";
    }

    if (!form.signatureImageBride) {
      return "Please upload the bride's signature.";
    }

    if (!form.signatureImageWitness1) {
      return "Please upload witness 1 signature.";
    }

    if (!form.signatureImageWitness2) {
      return "Please upload witness 2 signature.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token) {
      setError("Your session has expired. Please login again.");
      return;
    }

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const payload = cleanPayload(form);

    /**
     * Do not send an empty religious certificate type
     * if the user did not select one.
     */
    if (!payload.religiousCertificateType) {
      delete payload.religiousCertificateType;
      delete payload.religiousCertificateImage;
      delete payload.religiousCertificateName;
      delete payload.religiousAuthorityName;
      delete payload.religiousCertificateDate;
      delete payload.religiousCertificateNumber;
    } else {
      payload.religiousCertificateType =
        String(payload.religiousCertificateType).toUpperCase();
    }

    setSaving(true);

    try {
      let response;

      if (document?._id) {
        response = await updateDocument(
          document._id,
          payload as any,
          token
        );

        console.log("Update document response:", response);

        setSuccess(
          "Your marriage registration details have been updated successfully."
        );
      } else {
        response = await createDocument(
          payload as any,
          token
        );

        console.log("Create document response:", response);

        setSuccess(
          "Your marriage registration details have been saved successfully."
        );
      }

      await refreshDocument();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      console.error("Save document error:", err);

      setError(
        err?.message ||
          "Something went wrong while saving your registration details."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            style={{
              marginBottom: 30,
            }}
          >
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                margin: 0,
                color: "#111827",
              }}
            >
              Marriage Registration
            </h1>

            <p
              style={{
                marginTop: 8,
                color: "#6b7280",
                fontSize: 15,
              }}
            >
              Fill in the details and upload the required documents
              for marriage registration.
            </p>
          </div>

          {loading && (
            <div
              style={{
                padding: 20,
                background: "#fff",
                borderRadius: 14,
                marginBottom: 24,
              }}
            >
              Loading your registration details...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "14px 18px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "14px 18px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Section title="Applicant Details">
              <Grid>
                <TextInput
                  label="Mobile Number"
                  value={form.mobileNumber}
                  onChange={(value) =>
                    updateField("mobileNumber", value)
                  }
                  required
                  type="tel"
                />

                <TextInput
                  label="Email Address"
                  value={form.emailId}
                  onChange={(value) =>
                    updateField("emailId", value)
                  }
                  required
                  type="email"
                />

                <SelectInput
                  label="State"
                  value={form.selectedState}
                  onChange={(value) =>
                    updateField("selectedState", value)
                  }
                  required
                  options={[
                    {
                      label: "Delhi",
                      value: "Delhi",
                    },
                    {
                      label: "Uttar Pradesh",
                      value: "Uttar Pradesh",
                    },
                    {
                      label: "Haryana",
                      value: "Haryana",
                    },
                    {
                      label: "Punjab",
                      value: "Punjab",
                    },
                    {
                      label: "Rajasthan",
                      value: "Rajasthan",
                    },
                    {
                      label: "Maharashtra",
                      value: "Maharashtra",
                    },
                    {
                      label: "Other",
                      value: "Other",
                    },
                  ]}
                />

                <TextInput
                  label="Date of Marriage"
                  value={form.dateOfMarriage}
                  onChange={(value) =>
                    updateField("dateOfMarriage", value)
                  }
                  required
                  type="date"
                />

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <Label required>
                    Venue of Marriage
                  </Label>

                  <textarea
                    value={form.venueOfMarriage ?? ""}
                    onChange={(e) =>
                      updateField(
                        "venueOfMarriage",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter complete marriage venue"
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                  />
                </div>
              </Grid>
            </Section>

            <Section title="Groom Details">
              <Grid>
                <TextInput
                  label="Groom Mobile"
                  value={form.groomMobile}
                  onChange={(value) =>
                    updateField("groomMobile", value)
                  }
                  required
                  type="tel"
                />

                <TextInput
                  label="Groom Email"
                  value={form.groomEmail}
                  onChange={(value) =>
                    updateField("groomEmail", value)
                  }
                  required
                  type="email"
                />

                <TextInput
                  label="Occupation"
                  value={form.groomOtherInfoOccupation}
                  onChange={(value) =>
                    updateField(
                      "groomOtherInfoOccupation",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Religion"
                  value={form.groomOtherInfoReligion}
                  onChange={(value) =>
                    updateField(
                      "groomOtherInfoReligion",
                      value
                    )
                  }
                  required
                />

                <SelectInput
                  label="Marital Status"
                  value={form.groomOtherInfoMaritalStatus}
                  onChange={(value) =>
                    updateField(
                      "groomOtherInfoMaritalStatus",
                      value
                    )
                  }
                  required
                  options={[
                    {
                      label: "Never Married",
                      value: "Never Married",
                    },
                    {
                      label: "Divorced",
                      value: "Divorced",
                    },
                    {
                      label: "Widower",
                      value: "Widower",
                    },
                    {
                      label: "Other",
                      value: "Other",
                    },
                  ]}
                />

                <TextInput
                  label="Residing Since Year"
                  value={
                    form.groomOtherInfoResidingSinceYear
                  }
                  onChange={(value) =>
                    updateField(
                      "groomOtherInfoResidingSinceYear",
                      value
                    )
                  }
                  required
                  type="number"
                />
              </Grid>
            </Section>

            <Section title="Groom Identity Proof">
              <Grid>
                <SelectInput
                  label="Identity Proof Type"
                  value={form.groomIdProofType}
                  onChange={(value) =>
                    updateField(
                      "groomIdProofType",
                      value
                    )
                  }
                  required
                  options={[
                    {
                      label: "Aadhar Card",
                      value: "AADHAR",
                    },
                    {
                      label: "Voter ID",
                      value: "VOTER_ID",
                    },
                  ]}
                />

                {form.groomIdProofType === "AADHAR" && (
                  <>
                    <FileInput
                      label="Groom Aadhar Front"
                      value={form.groomAadharFront}
                      onChange={(value) =>
                        updateField(
                          "groomAadharFront",
                          value
                        )
                      }
                      required
                    />

                    <FileInput
                      label="Groom Aadhar Back"
                      value={form.groomAadharBack}
                      onChange={(value) =>
                        updateField(
                          "groomAadharBack",
                          value
                        )
                      }
                      required
                    />
                  </>
                )}

                {form.groomIdProofType === "VOTER_ID" && (
                  <>
                    <FileInput
                      label="Groom Voter ID Front"
                      value={form.groomVoterIdFront}
                      onChange={(value) =>
                        updateField(
                          "groomVoterIdFront",
                          value
                        )
                      }
                      required
                    />

                    <FileInput
                      label="Groom Voter ID Back"
                      value={form.groomVoterIdBack}
                      onChange={(value) =>
                        updateField(
                          "groomVoterIdBack",
                          value
                        )
                      }
                      required
                    />
                  </>
                )}
              </Grid>
            </Section>

            <Section title="Groom Birth Proof">
              <Grid>
                <SelectInput
                  label="Birth Proof Type"
                  value={form.groomBirthProofType}
                  onChange={(value) =>
                    updateField(
                      "groomBirthProofType",
                      value
                    )
                  }
                  required
                  options={[
                    {
                      label: "Passport",
                      value: "PASSPORT",
                    },
                    {
                      label: "10th Birth Certificate",
                      value: "BIRTH_CERTIFICATE",
                    },
                  ]}
                />

                {form.groomBirthProofType ===
                  "PASSPORT" && (
                  <>
                    <FileInput
                      label="Passport Front"
                      value={form.groomPassportFront}
                      onChange={(value) =>
                        updateField(
                          "groomPassportFront",
                          value
                        )
                      }
                      required
                    />

                    <FileInput
                      label="Passport Back"
                      value={form.groomPassportBack}
                      onChange={(value) =>
                        updateField(
                          "groomPassportBack",
                          value
                        )
                      }
                      required
                    />
                  </>
                )}

                {(form.groomBirthProofType ===
                  "BIRTH_CERTIFICATE" ||
                  form.groomBirthProofType ===
                    "10TH_BIRTH_CERTIFICATE") && (
                  <FileInput
                    label="Birth Certificate"
                    value={
                      form.groomBirthCertificateImage
                    }
                    onChange={(value) =>
                      updateField(
                        "groomBirthCertificateImage",
                        value
                      )
                    }
                    required
                  />
                )}
              </Grid>
            </Section>

            <Section title="Bride Details">
              <Grid>
                <TextInput
                  label="Occupation"
                  value={form.brideOtherInfoOccupation}
                  onChange={(value) =>
                    updateField(
                      "brideOtherInfoOccupation",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Religion"
                  value={form.brideOtherInfoReligion}
                  onChange={(value) =>
                    updateField(
                      "brideOtherInfoReligion",
                      value
                    )
                  }
                  required
                />

                <SelectInput
                  label="Marital Status"
                  value={form.brideOtherInfoMaritalStatus}
                  onChange={(value) =>
                    updateField(
                      "brideOtherInfoMaritalStatus",
                      value
                    )
                  }
                  required
                  options={[
                    {
                      label: "Never Married",
                      value: "Never Married",
                    },
                    {
                      label: "Divorced",
                      value: "Divorced",
                    },
                    {
                      label: "Widow",
                      value: "Widow",
                    },
                    {
                      label: "Other",
                      value: "Other",
                    },
                  ]}
                />

                <TextInput
                  label="Residing Since Year"
                  value={
                    form.brideOtherInfoResidingSinceYear
                  }
                  onChange={(value) =>
                    updateField(
                      "brideOtherInfoResidingSinceYear",
                      value
                    )
                  }
                  required
                  type="number"
                />
              </Grid>
            </Section>

            <Section title="Bride Documents">
              <Grid>
                <FileInput
                  label="Bride Aadhar Front"
                  value={form.brideAadharFront}
                  onChange={(value) =>
                    updateField(
                      "brideAadharFront",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Bride Aadhar Back"
                  value={form.brideAadharBack}
                  onChange={(value) =>
                    updateField(
                      "brideAadharBack",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Bride Other Proof"
                  value={form.brideOtherProofImage}
                  onChange={(value) =>
                    updateField(
                      "brideOtherProofImage",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Other Proof Name"
                  value={form.brideOtherProofName}
                  onChange={(value) =>
                    updateField(
                      "brideOtherProofName",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Bride Birth Proof"
                  value={form.brideBirthProofImage}
                  onChange={(value) =>
                    updateField(
                      "brideBirthProofImage",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Birth Proof Name"
                  value={form.brideBirthProofName}
                  onChange={(value) =>
                    updateField(
                      "brideBirthProofName",
                      value
                    )
                  }
                  required
                />
              </Grid>
            </Section>

            <Section title="Marriage Proof">
              <Grid>
                <FileInput
                  label="Marriage Proof Photo"
                  value={form.marriageProofPhoto}
                  onChange={(value) =>
                    updateField(
                      "marriageProofPhoto",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Couple Photograph"
                  value={form.marriageProofCoupleImage}
                  onChange={(value) =>
                    updateField(
                      "marriageProofCoupleImage",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Marriage Invitation"
                  value={form.marriageProofInvitation}
                  onChange={(value) =>
                    updateField(
                      "marriageProofInvitation",
                      value
                    )
                  }
                  required
                />
              </Grid>
            </Section>

            <Section title="Religious Certificate">
              <Grid>
                <SelectInput
                  label="Religious Certificate Type"
                  value={form.religiousCertificateType}
                  onChange={(value) =>
                    updateField(
                      "religiousCertificateType",
                      value
                    )
                  }
                  options={[
                    {
                      label: "Sikh",
                      value: "SIKH",
                    },
                    {
                      label: "Muslim",
                      value: "MUSLIM",
                    },
                    {
                      label: "Christian",
                      value: "CHRISTIAN",
                    },
                  ]}
                />

                {form.religiousCertificateType && (
                  <>
                    <FileInput
                      label="Religious Certificate"
                      value={
                        form.religiousCertificateImage
                      }
                      onChange={(value) =>
                        updateField(
                          "religiousCertificateImage",
                          value
                        )
                      }
                      required
                    />

                    <TextInput
                      label="Certificate Name"
                      value={
                        form.religiousCertificateName
                      }
                      onChange={(value) =>
                        updateField(
                          "religiousCertificateName",
                          value
                        )
                      }
                      required
                    />

                    <TextInput
                      label="Religious Authority Name"
                      value={
                        form.religiousAuthorityName
                      }
                      onChange={(value) =>
                        updateField(
                          "religiousAuthorityName",
                          value
                        )
                      }
                      required
                    />

                    <TextInput
                      label="Certificate Date"
                      value={
                        form.religiousCertificateDate
                      }
                      onChange={(value) =>
                        updateField(
                          "religiousCertificateDate",
                          value
                        )
                      }
                      required
                      type="date"
                    />

                    <TextInput
                      label="Certificate Number"
                      value={
                        form.religiousCertificateNumber
                      }
                      onChange={(value) =>
                        updateField(
                          "religiousCertificateNumber",
                          value
                        )
                      }
                      required
                    />
                  </>
                )}
              </Grid>
            </Section>

            <Section title="Witness 1">
              <Grid>
                <TextInput
                  label="Witness 1 Name"
                  value={
                    form.additionalDocumentWitness1Name
                  }
                  onChange={(value) =>
                    updateField(
                      "additionalDocumentWitness1Name",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Witness 1 Phone"
                  value={form.witness1PhoneNumber}
                  onChange={(value) =>
                    updateField(
                      "witness1PhoneNumber",
                      value
                    )
                  }
                  required
                  type="tel"
                />

                <FileInput
                  label="Witness 1 Aadhar Front"
                  value={form.witness1AadharFront}
                  onChange={(value) =>
                    updateField(
                      "witness1AadharFront",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 1 Aadhar Back"
                  value={form.witness1AadharBack}
                  onChange={(value) =>
                    updateField(
                      "witness1AadharBack",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 1 PAN Card"
                  value={form.witness1PanCardPhoto}
                  onChange={(value) =>
                    updateField(
                      "witness1PanCardPhoto",
                      value
                    )
                  }
                  required
                />
              </Grid>
            </Section>

            <Section title="Witness 2">
              <Grid>
                <TextInput
                  label="Witness 2 Name"
                  value={
                    form.additionalDocumentWitness2Name
                  }
                  onChange={(value) =>
                    updateField(
                      "additionalDocumentWitness2Name",
                      value
                    )
                  }
                  required
                />

                <TextInput
                  label="Witness 2 Phone"
                  value={form.witness2PhoneNumber}
                  onChange={(value) =>
                    updateField(
                      "witness2PhoneNumber",
                      value
                    )
                  }
                  required
                  type="tel"
                />

                <FileInput
                  label="Witness 2 Aadhar Front"
                  value={form.witness2AadharFront}
                  onChange={(value) =>
                    updateField(
                      "witness2AadharFront",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 2 Aadhar Back"
                  value={form.witness2AadharBack}
                  onChange={(value) =>
                    updateField(
                      "witness2AadharBack",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 2 PAN Card"
                  value={form.witness2PanCardPhoto}
                  onChange={(value) =>
                    updateField(
                      "witness2PanCardPhoto",
                      value
                    )
                  }
                  required
                />
              </Grid>
            </Section>

            <Section title="Signatures">
              <Grid>
                <FileInput
                  label="Groom Signature"
                  value={form.signatureImageGroom}
                  onChange={(value) =>
                    updateField(
                      "signatureImageGroom",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Bride Signature"
                  value={form.signatureImageBride}
                  onChange={(value) =>
                    updateField(
                      "signatureImageBride",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 1 Signature"
                  value={form.signatureImageWitness1}
                  onChange={(value) =>
                    updateField(
                      "signatureImageWitness1",
                      value
                    )
                  }
                  required
                />

                <FileInput
                  label="Witness 2 Signature"
                  value={form.signatureImageWitness2}
                  onChange={(value) =>
                    updateField(
                      "signatureImageWitness2",
                      value
                    )
                  }
                  required
                />
              </Grid>
            </Section>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <button
                type="submit"
                disabled={saving || loading}
                style={{
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 30px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor:
                    saving || loading
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    saving || loading ? 0.7 : 1,
                  background:
                    (theme as any)?.accentTeal ||
                    (theme as any)?.primary ||
                    "#0f766e",
                  color: "#fff",
                  minWidth: 180,
                }}
              >
                {saving
                  ? "Saving..."
                  : document?._id
                  ? "Update Registration"
                  : "Save Registration"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}





