import { useParams } from "wouter";
import { getResearchRecordBySlug } from "@/data/researchRecords";
import ResearchRecordDetail from "@/pages/ResearchRecordDetail";
import TrustDetail from "@/pages/TrustDetail";

/**
 * Non-operating bankruptcy records share the /trusts namespace for stable research
 * discovery, but never enter the operating-trust JSON dataset or its aggregates.
 */
export default function TrustRecordRoute() {
  const { slug } = useParams<{ slug: string }>();
  const record = getResearchRecordBySlug(slug);

  return record ? <ResearchRecordDetail record={record} /> : <TrustDetail />;
}
