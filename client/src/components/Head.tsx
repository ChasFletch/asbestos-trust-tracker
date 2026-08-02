import { useEffect } from "react";
import { useLocation } from "wouter";
import { SITE_NAME, SITE_TITLE } from "@shared/const";

const ROUTE_TITLES: Record<string, string> = {
  "/": SITE_TITLE,
  "/trusts": `Trust Fund Data · ${SITE_NAME}`,
  "/news": `Trust Fund News · ${SITE_NAME}`,
  "/reports": `Research Reports · ${SITE_NAME}`,
  "/methodology": `Methodology · ${SITE_NAME}`,
  "/about": `About · ${SITE_NAME}`,
  "/corrections": `Corrections · ${SITE_NAME}`,
  "/404": `Page Not Found · ${SITE_NAME}`,
};

export function Head() {
  const [location] = useLocation();
  useEffect(() => {
    const t = ROUTE_TITLES[location.replace(/\/+$/, "") || "/"];
    if (t) document.title = t;
  }, [location]);
  return null;
}

/** For detail pages: call with the fetched record's title. */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title?.trim() ? `${title} · ${SITE_NAME}` : SITE_TITLE;
  }, [title]);
}
