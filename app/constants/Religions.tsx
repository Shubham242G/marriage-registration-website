import React from "react";
import { ReligionKey, ReligionTheme } from "../types/Religion";

export const RELIGION_THEMES: Record<ReligionKey, ReligionTheme> = {
  "hinduism-sikhism-buddhism-jainism": {
    key: "hinduism-sikhism-buddhism-jainism",
    label: "Hinduism / Sikhism / Buddhism / Jainism",
    shortLabel: "Dharmic Faiths",
    subtitle: "Vivah · Anand Karaj · Dharmic Rites",
    heroHeading: "Honouring Sacred Traditions",
    heroSubtext:
      "Legally register your Vivah, Anand Karaj or Dharmic union with dignity, care, and complete legal compliance — all from the comfort of your home.",
    bannerBg:
      "linear-gradient(135deg, #0f4c4c 0%, #0d6b6b 45%, #0a5555 100%)",
    accentTeal: "#0d9488",
    lightTeal: "#f0fdfa",
    darkTeal: "#0f4c4c",
    borderColor: "#99f6e4",
    icon: (
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#99f6e4" strokeWidth="1.2" />
        <text x="24" y="32" textAnchor="middle" fontSize="22" fill="#5eead4" fontFamily="serif">
          ॐ
        </text>
      </svg>
    ),
    description:
      "For millions of families across India, marriage is not merely a legal contract — it is a sacred covenant witnessed by fire, scripture, and community. Whether your ceremony follows the Saptapadi of Hindu Vivah, the four Lavans of Anand Karaj, the serene simplicity of a Buddhist union, or the vows of Jain matrimony, each tradition carries centuries of spiritual meaning. Our platform exists to honour these traditions while ensuring every couple receives the full legal protection their union deserves.",
    legalActs: [
      "Hindu Marriage Act, 1955",
      "Special Marriage Act, 1954",
      "Anand Marriage Act, 1909",
    ],
    howWeHelp: [
      {
        title: "Document Guidance",
        body: "We walk you through every document required under the Hindu Marriage Act and Anand Marriage Act — Aadhaar, birth proof, witness affidavits, and ceremony photographs — so nothing is missed.",
      },
      {
        title: "Multi-Faith Coverage",
        body: "Whether Hindu, Sikh, Buddhist, or Jain, our platform adapts to the specific legal requirements of each tradition under a unified workflow.",
      },
      {
        title: "Expert Verification",
        body: "Our legal team reviews every submission before it reaches the registrar, catching errors that commonly lead to rejection.",
      },
      {
        title: "Ceremony-Specific Proofs",
        body: "We help you compile the right ceremony-specific proofs — Varmala photos, Phera records, Laav certificates — that satisfy government requirements.",
      },
    ],
  },

  islam: {
    key: "islam",
    label: "Islam",
    shortLabel: "Islam",
    subtitle: "Nikah Registration",
    heroHeading: "Protecting Your Nikah, Legally",
    heroSubtext:
      "Ensure your Nikah is recognised under Indian law with a seamless, guided registration process — preserving both religious sanctity and legal security.",
    bannerBg:
      "linear-gradient(135deg, #0f4c4c 0%, #0d6b6b 45%, #134e4a 100%)",
    accentTeal: "#0d9488",
    lightTeal: "#f0fdfa",
    darkTeal: "#0f4c4c",
    borderColor: "#99f6e4",
    icon: (
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#99f6e4" strokeWidth="1.2" strokeDasharray="3 2" />
        <path
          d="M24 8 L25.5 18 L35 18 L27.5 23.5 L30 33 L24 28 L18 33 L20.5 23.5 L13 18 L22.5 18 Z"
          fill="#5eead4"
          opacity="0.85"
        />
        <circle cx="24" cy="11" r="2" fill="#5eead4" />
      </svg>
    ),
    description:
      "A Nikah conducted in the presence of witnesses and officiated by a Qazi or Maulvi holds profound religious significance. However, without civil registration, couples may face serious legal challenges — from inheritance disputes to visa complications. Our platform bridges the gap between Islamic matrimonial tradition and Indian civil law, ensuring your union is honoured both in the eyes of your faith and the Government of India.",
    legalActs: [
      "Muslim Personal Law (Shariat) Application Act, 1937",
      "Special Marriage Act, 1954",
      "Muslim Women (Protection of Rights on Marriage) Act, 2019",
    ],
    howWeHelp: [
      {
        title: "Nikahnama Assistance",
        body: "We assist in digitising and validating your Nikahnama alongside government-recognised documentation, creating a complete legal record.",
      },
      {
        title: "Qazi Coordination",
        body: "Our team can help coordinate with registered Qazis and provide guidance on the documentation they must submit for civil registration.",
      },
      {
        title: "Rights Protection",
        body: "Legal registration under the Special Marriage Act safeguards both spouses' rights under Indian law regardless of future disputes.",
      },
      {
        title: "Witness Documentation",
        body: "We guide you through proper witness affidavit preparation — a critical requirement often overlooked in Nikah registrations.",
      },
    ],
  },

  christianity: {
    key: "christianity",
    label: "Christianity",
    shortLabel: "Christianity",
    subtitle: "Christian Marriage Registration",
    heroHeading: "Your Vows, Fully Recognised",
    heroSubtext:
      "From church ceremony to official certificate — we handle the legal registration of your Christian marriage with professionalism and care.",
    bannerBg:
      "linear-gradient(135deg, #0f4c4c 0%, #0e7490 45%, #0f4c4c 100%)",
    accentTeal: "#0e7490",
    lightTeal: "#ecfeff",
    darkTeal: "#164e63",
    borderColor: "#a5f3fc",
    icon: (
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <rect x="21" y="6" width="6" height="36" rx="3" fill="#67e8f9" opacity="0.9" />
        <rect x="10" y="16" width="28" height="6" rx="3" fill="#67e8f9" opacity="0.9" />
      </svg>
    ),
    description:
      "Christian marriages in India hold a cherished place in the country's plural social fabric. Whether solemnised in a Catholic cathedral, a Protestant chapel, or a small community church, your marriage carries spiritual weight and legal significance. Under the Indian Christian Marriage Act, registration is not just a formality — it is the foundation of your legal rights as a married couple. We make this process effortless, accurate, and transparent.",
    legalActs: [
      "Indian Christian Marriage Act, 1872",
      "Special Marriage Act, 1954",
      "Divorce Act, 1869 (for reference)",
    ],
    howWeHelp: [
      {
        title: "Church Certificate Validation",
        body: "We help you prepare and validate your church-issued marriage certificate for submission to civil authorities — a step many couples find confusing.",
      },
      {
        title: "Minister & Registrar Coordination",
        body: "Our team guides you on the role of the officiating minister, marriage registrar, and the notification period required under the 1872 Act.",
      },
      {
        title: "Banns & Notice Compliance",
        body: "We ensure your marriage notice and banns comply with the legal publication requirements, avoiding delays in your registration.",
      },
      {
        title: "Certificate Delivery",
        body: "After verification, your official marriage certificate is delivered digitally and by post — legally valid across all government and international institutions.",
      },
    ],
  },

  other: {
    key: "other",
    label: "Other / Civil Marriage",
    shortLabel: "Other / Civil",
    subtitle: "Special Marriage Act Registration",
    heroHeading: "Love Beyond Boundaries",
    heroSubtext:
      "For interfaith, inter-caste, or civil marriages — we provide a straightforward, judgement-free path to legal recognition under the Special Marriage Act.",
    bannerBg:
      "linear-gradient(135deg, #0f4c4c 0%, #115e59 45%, #0f4c4c 100%)",
    accentTeal: "#14b8a6",
    lightTeal: "#f0fdfa",
    darkTeal: "#134e4a",
    borderColor: "#5eead4",
    icon: (
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <circle cx="24" cy="24" r="18" stroke="#5eead4" strokeWidth="1.5" />
        <path d="M16 24 C16 18, 32 18, 32 24 C32 30, 16 30, 16 24Z" stroke="#5eead4" strokeWidth="1.2" fill="none" />
        <circle cx="24" cy="24" r="4" fill="#5eead4" opacity="0.7" />
      </svg>
    ),
    description:
      "The Special Marriage Act, 1954 was enacted with a vision of a modern, secular India — a legal framework that recognises every couple's right to marry regardless of religion, caste, or community. Whether yours is an interfaith love story, an inter-caste union, or simply a preference for a civil ceremony, you deserve the same legal protections and dignified process as any other couple. Our platform is built with this exact purpose: to make the Special Marriage Act accessible, understandable, and stress-free.",
    legalActs: [
      "Special Marriage Act, 1954",
      "Foreign Marriage Act, 1969",
      "Registration of Births, Deaths and Marriages Act",
    ],
    howWeHelp: [
      {
        title: "30-Day Notice Management",
        body: "We guide you through the mandatory 30-day notice period, handling the paperwork and helping you understand what to expect during this window.",
      },
      {
        title: "Interfaith Documentation",
        body: "Our team is experienced with interfaith couples and the unique documentation challenges they face — we ensure a respectful, thorough process.",
      },
      {
        title: "Privacy & Sensitivity",
        body: "We understand that interfaith and inter-caste marriages can be sensitive. Our process is fully confidential and handled with discretion.",
      },
      {
        title: "Legal Counselling Access",
        body: "Couples using our platform get access to legal Q&A sessions to address specific concerns about rights, objection handling, and post-registration matters.",
      },
    ],
  },
};

export const ALL_RELIGIONS = Object.values(RELIGION_THEMES);