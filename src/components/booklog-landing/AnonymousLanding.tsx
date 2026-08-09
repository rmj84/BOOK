import type { FeaturedShelf } from "@/lib/book-stats";
import { BG_ANGLE, FONT_BODY, PALETTE } from "./theme";
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
}: {
  topBook: { title: string; author: string | null; rating: number } | null;
  stats: LandingStats;
  recommended: LandingBook[];
  trending: LandingBook[];
  shelves: FeaturedShelf[];
}) {
  return (
    <div
      style={{
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        marginTop: "-1.5rem",
        width: "100vw",
        overflow: "hidden",
        background: `linear-gradient(${BG_ANGLE}deg,${PALETTE.a} 0%,${PALETTE.b} 30%,${PALETTE.c} 62%,${PALETTE.d} 100%)`,
        fontFamily: FONT_BODY,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(250,255,244,0.85),rgba(250,255,244,0) 66%)",
          top: -180,
          right: -80,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(150,220,140,0.5),rgba(255,255,255,0) 70%)",
          top: 420,
          left: -120,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <Hero topBook={topBook} />
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
