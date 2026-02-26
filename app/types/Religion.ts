import { JSX } from "react";

export type ReligionKey =
  | "hinduism-sikhism-buddhism-jainism"
  | "islam"
  | "christianity"
  | "court-marriage"
  | "other";
  

export interface ReligionTheme {
  key: ReligionKey;
  label: string;
  shortLabel: string;
  subtitle: string;
  heroHeading: string;
  heroSubtext: string;

  bannerImage: string; // ✅ new

  accentTeal: string;
  lightTeal: string;
  darkTeal: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  legalActs: string[];
  howWeHelp: {
    title: string;
    body: string;
  }[];
}