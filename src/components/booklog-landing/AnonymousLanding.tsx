import type { FeaturedShelf } from "@/lib/book-stats";
import { FONT_SANS, PAPER, RULE_WEIGHT, SHEET_SHADOW } from "./theme";
import { LandingHeader, type LandingUser } from "./LandingHeader";
import { Hero } from "./Hero";
import { Stats, type LandingStats } from "./Stats";
import { RecommendedSection, type LandingBook } from "./RecommendedSection";
import { PopularSection } from "./PopularSection";
import { LeafScoreSection } from "./LeafScoreSection";
import { ShelvesSection } from "./ShelvesSection";
import { CtaBand } from "./CtaBand";
import { Footer } from "./Footer";

export function AnonymousLanding({
  topBook,
  stats,
  recommended,
  trending,
  shelves,
  user = null,
}: {
  topBook: { title: string; author: string | null; rating: number } | null;
  stats: LandingStats;
  recommended: LandingBook[];
  trending: LandingBook[];
  shelves: FeaturedShelf[];
  user?: LandingUser;
}) {
  const isLoggedIn = !!user;

  return (
    <div
      className="ed-shell-outer"
      style={{
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginTop: "-1.5rem",
        width: "100vw",
        minHeight: "100vh",
        background: PAPER.bg,
        padding: "44px 40px 72px",
        fontFamily: FONT_SANS,
        color: PAPER.rule,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          background: PAPER.sheet,
          border: `${RULE_WEIGHT}px solid ${PAPER.rule}`,
          boxShadow: `${SHEET_SHADOW}px ${SHEET_SHADOW}px 0 ${PAPER.rule}`,
        }}
      >
        <LandingHeader user={user} />
        <Hero topBook={topBook} isLoggedIn={isLoggedIn} />
        <Stats stats={stats} />
        <RecommendedSection books={recommended} />
        <PopularSection books={trending} />
        <LeafScoreSection />
        <ShelvesSection shelves={shelves} />
        <CtaBand />
        <Footer />
      </div>
    </div>
  );
}
