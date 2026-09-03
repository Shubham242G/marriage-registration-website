// types/Religion.ts

import { JSX } from "react";

export type ReligionKey =
  | "hinduism-sikhism-buddhism-jainism"
  | "islam"
  | "christianity"
  | "court-marriage"
  | "other";

export interface HelpItem {
  title: string;
  body: string;
}

export interface BenefitItem {
  title: string;
  text: string;
}

export interface TrustReason {
  title: string;
  body: string;
}

export interface StepItem {
  num: string;
  title: string;
  body: string;
}

export interface ReligionTheme {
  key: ReligionKey;
  label: string;
  shortLabel: string;
  subtitle: string;
  heroHeading: string;
  heroSubtext: string;
  bannerImage: string;
  accentTeal: string;
  lightTeal: string;
  darkTeal: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  legalActs: string[];
  howWeHelp: HelpItem[];
  // Optional fields for the home page
  benefits?: BenefitItem[];
  trustReasons?: TrustReason[];
  steps?: StepItem[];
  ctaHeading?: string;
  ctaSubtext?: string;
  footerBrand?: string;
  footerTagline?: string;
}