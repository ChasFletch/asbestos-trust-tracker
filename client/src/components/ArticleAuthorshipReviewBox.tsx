import { ExternalLink, FileCheck2, ShieldCheck } from "lucide-react";
import type { ResearchDeskProfile } from "@/data/researchDeskPeople";

type LegalReviewCredit = {
  person: ResearchDeskProfile;
  /** Only populate when a content-specific review occurred. */
  reviewScope?: string;
  /** ISO date of an actual content-specific review. */
  reviewedAt?: string;
};

type ArticleAuthorshipReviewBoxProps = {
  author: ResearchDeskProfile;
  legalReviewers: readonly LegalReviewCredit[];
  publishedAt?: string;
  materiallyUpdatedAt?: string;
  sourceCutoffAt?: string;
  methodologyUrl?: string;
  correctionsUrl?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-mono text-xs font-semibold text-primary"
    >
      {initials}
    </span>
  );
}

function ProfileCard({
  profile,
  label,
  reviewScope,
  reviewedAt,
}: {
  profile: ResearchDeskProfile;
  label: string;
  reviewScope?: string;
  reviewedAt?: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Monogram name={profile.name} />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{label}</p>
          <p className="mt-1 font-semibold text-foreground">{profile.name}</p>
          <p className="text-sm text-muted-foreground">
            {profile.role}
            {profile.organization ? ` · ${profile.organization}` : ""}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.bio}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${profile.name} verified credentials`}>
        {profile.credentials.map((credential) => (
          <li key={credential} className="rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
            {credential}
          </li>
        ))}
      </ul>

      {reviewScope ? (
        <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Review scope: </span>
          {reviewScope}
        </p>
      ) : (
        <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-6 text-muted-foreground">
          Designated to provide legal-research review when an article requires legal-context review. A designation alone does not state that this individual reviewed this specific publication.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {profile.profileUrl ? (
          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Official profile <ExternalLink size={13} aria-hidden="true" />
          </a>
        ) : null}
        {profile.wikidataUrl ? (
          <a
            href={profile.wikidataUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Wikidata identity <ExternalLink size={13} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      {reviewedAt ? <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Reviewed {formatDate(reviewedAt)}</p> : null}
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Profile checked {formatDate(profile.profileLastVerified)}</p>
    </article>
  );
}

export function ArticleAuthorshipReviewBox({
  author,
  legalReviewers,
  publishedAt,
  materiallyUpdatedAt,
  sourceCutoffAt,
  methodologyUrl = "/methodology",
  correctionsUrl = "/corrections",
}: ArticleAuthorshipReviewBoxProps) {
  return (
    <aside aria-labelledby="research-desk-credits-heading" className="mt-10 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileCheck2 size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Danziger & De Llano Research Desk</p>
          <h2 id="research-desk-credits-heading" className="mt-1 font-serif text-xl font-semibold text-foreground">Authorship and legal review</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">This publication identifies who prepared the research, the designated legal-review team, and any article-specific review that occurred.</p>
        </div>
      </div>

      <section className="mt-6" aria-labelledby="research-author-heading">
        <h3 id="research-author-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">Research prepared by</h3>
        <div className="mt-3"><ProfileCard profile={author} label="Research author" /></div>
      </section>

      <section className="mt-6" aria-labelledby="legal-review-team-heading">
        <h3 id="legal-review-team-heading" className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
          <ShieldCheck size={15} aria-hidden="true" className="text-primary" />
          Legal review team
        </h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {legalReviewers.map(({ person, reviewScope, reviewedAt }) => (
            <ProfileCard key={person.id} profile={person} label="Designated legal reviewer" reviewScope={reviewScope} reviewedAt={reviewedAt} />
          ))}
        </div>
      </section>

      {publishedAt || materiallyUpdatedAt || sourceCutoffAt ? (
        <dl className="mt-6 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-3">
          {publishedAt ? <div><dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Published</dt><dd className="mt-1 text-foreground">{formatDate(publishedAt)}</dd></div> : null}
          {materiallyUpdatedAt ? <div><dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Materially updated</dt><dd className="mt-1 text-foreground">{formatDate(materiallyUpdatedAt)}</dd></div> : null}
          {sourceCutoffAt ? <div><dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Source cut-off</dt><dd className="mt-1 text-foreground">{formatDate(sourceCutoffAt)}</dd></div> : null}
        </dl>
      ) : null}

      <div className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.035] p-4 text-sm leading-6 text-muted-foreground">
        <p>AsbestosTrusts.org is funded by Danziger & De Llano, LLP.</p>
        <p className="mt-2">This publication is general research based on public sources. It is not legal advice and does not evaluate any individual claim or legal right.</p>
      </div>

      <nav aria-label="Research Desk resources" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a href={methodologyUrl} className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Read methodology</a>
        <a href={correctionsUrl} className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Report a correction</a>
      </nav>
    </aside>
  );
}
