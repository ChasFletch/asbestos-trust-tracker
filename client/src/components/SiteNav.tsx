import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Clock" },
  { href: "/trusts", label: "Trust Data" },
  { href: "/news", label: "News" },
  { href: "/reports", label: "Reports" },
  { href: "/methodology", label: "Methodology" },
  { href: "/provenance", label: "Figure History" },
  { href: "/source-recovery", label: "Source Recovery" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            className="font-mono font-bold text-primary"
            style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
          >
            AsbestosTrusts
            <span className="text-muted-foreground">.org</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors no-underline ${
                location === l.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://asbestosatlas.org"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors no-underline"
          >
            AsbestosAtlas.org ↗
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm border-b border-border/30 no-underline ${
                location === l.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://asbestosatlas.org"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 text-sm text-muted-foreground no-underline"
          >
            AsbestosAtlas.org ↗
          </a>
        </div>
      )}
    </header>
  );
}
