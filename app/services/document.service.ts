const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const prefix = "/document";

export interface IDocument {
  _id?: string;
  userId?: string;
  // Basic info
  mobileNumber: string;
  emailId: string;
  selectedState: string;
  dateOfMarriage: string;
  venueOfMarriage: string;
  // Groom
  groomEmail: string;
  groomMobile: string;
  groomOtherInfoOccupation: string;
  groomOtherInfoReligion: string;
  groomOtherInfoMaritalStatus: string;
  // Bride
  brideOtherInfoOccupation: string;
  brideOtherInfoReligion: string;
  brideOtherInfoMaritalStatus: string;
  // Witnesses
  witness1PhoneNumber: string;
  witness2PhoneNumber: string;
  witness3PhoneNumber: string;
  additionalDocumentWitness1Name: string;
  additionalDocumentWitness2Name: string;
  additionalDocumentWitness3Name: string;
  // Document images (base64 → filename after save)
  groomAadharFront: string;
  groomAadharBack: string;
  brideAadharFront: string;
  brideAadharBack: string;
  marriageProofPhoto: string;
  marriageProofCoupleImage: string;
  // Status
  isDocumentVerified?: boolean;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Convert a file to base64 string
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// GET document for logged-in user
export const getMyDocument = async (token: string): Promise<IDocument | null> => {
  const res = await fetch(`${BASE_URL}${prefix}/getByUser`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  // Returns array — take first item
  return data?.data?.[0] || null;
};

// POST create document
export const createDocument = async (
  body: Partial<IDocument>,
  token: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}${prefix}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to submit");
  return data;
};

// PATCH update document
export const updateDocument = async (
  id: string,
  body: Partial<IDocument>,
  token: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}${prefix}/updateById/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update");
  return data;
};