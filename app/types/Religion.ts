import { JSX } from "react";

export type ReligionKey =
  | "hinduism-sikhism-buddhism-jainism"
  | "islam"
  | "christianity"
  | "other";

export interface ReligionTheme {
  key: ReligionKey;
  label: string;
  shortLabel: string;
  subtitle: string;
  heroHeading: string;
  heroSubtext: string;
  bannerBg: string;         // CSS gradient string
  accentTeal: string;       // primary teal shade
  lightTeal: string;        // bg tint
  darkTeal: string;         // text / deep bg
  borderColor: string;
  icon: JSX.Element;
  description: string;      // paragraph for home page intro
  legalActs: string[];      // relevant marriage acts
  howWeHelp: { title: string; body: string }[];
}