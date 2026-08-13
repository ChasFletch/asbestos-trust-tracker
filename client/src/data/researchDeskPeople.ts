export type ResearchDeskProfile = {
  id: string;
  name: string;
  role: string;
  organization?: string;
  bio: string;
  credentials: string[];
  practiceAreas?: string[];
  profileUrl?: string;
  wikidataUrl?: string;
  profileLastVerified: string;
};

export const RESEARCH_DESK: ResearchDeskProfile = {
  id: "dandell-research-desk",
  name: "Danziger & De Llano Research Desk",
  role: "Research and editorial team",
  organization: "Danziger & De Llano, LLP",
  bio: "The Research Desk publishes source-linked public research on U.S. asbestos bankruptcy trusts, related proceedings, and the limits of the available record.",
  credentials: ["Source-linked public research", "Published methodology and corrections record"],
  profileUrl: "/about",
  profileLastVerified: "2026-08-13",
};

export const PAUL_DANZIGER: ResearchDeskProfile = {
  id: "paul-danziger",
  name: "Paul Danziger",
  role: "Designated Legal Reviewer",
  organization: "Danziger & De Llano, LLP",
  bio: "Founding Partner of Danziger & De Llano, LLP. His public firm profile describes work in asbestos and mesothelioma, personal injury, product liability, and complex business litigation.",
  credentials: [
    "Eligible to practice in Texas",
    "Texas Bar No. 00788880",
    "Northwestern University School of Law, J.D.",
  ],
  practiceAreas: ["Asbestos and mesothelioma", "Personal injury", "Product liability"],
  profileUrl: "https://dandell.com/lawyers/paul-danziger/",
  wikidataUrl: "https://www.wikidata.org/wiki/Q139044594",
  profileLastVerified: "2026-08-13",
};

export const ROD_DE_LLANO: ResearchDeskProfile = {
  id: "rod-de-llano",
  name: "Rod de Llano",
  role: "Designated Legal Reviewer",
  organization: "Danziger & De Llano, LLP",
  bio: "Founding Partner of Danziger & De Llano, LLP. His public firm profile describes work in asbestos and mesothelioma, personal injury, product liability, and insurance disputes.",
  credentials: [
    "Eligible to practice in Texas",
    "Texas Bar No. 00786666",
    "University of Texas School of Law, December 1991",
  ],
  practiceAreas: ["Asbestos and mesothelioma", "Personal injury", "Product liability"],
  profileUrl: "https://dandell.com/lawyers/rod-de-llano/",
  wikidataUrl: "https://www.wikidata.org/wiki/Q139044724",
  profileLastVerified: "2026-08-13",
};

export const DESIGNATED_LEGAL_REVIEWERS = [PAUL_DANZIGER, ROD_DE_LLANO] as const;
