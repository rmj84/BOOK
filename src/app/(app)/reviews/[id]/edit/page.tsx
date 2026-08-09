import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateReview } from "@/lib/actions/reviews";
import LeafScoreInput from "@/components/leaf-score-input";
import SubmitButton from "@/components/submit-button";
import { FONT_SERIF, PAPER, ctaButtonStyle, monoLabel } from "@/components/booklog-landing/theme";

type Params = { params: Promise<{ id: string }> };

const textareaStyle = {
  width: "100%",
  border: `1px solid ${PAPER.rule}`,
  background: PAPER.sheet,
  padding: "14px 16px",
  fontFamily: "'IBM Plex Sans KR',sans-serif",
  fontSize: 14,
  lineHeight: 1.8,
  color: PAPER.rule,
  outline: "none",
  resize: "vertical" as const,
  boxSizing: "border-box" as const,
};

export default async function EditReviewPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const review = await prisma.review.findUnique({
    where: { id },
    include: { book: true },
  });
  if (!review) notFound();
  if (review.userId !== session.user.id) redirect(`/reviews/${id}`);

  const updateWithId = updateReview.bind(null, id);

  return (
    <form action={updateWithId}>
      <div style={{ ...monoLabel, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Edit</div>
      <h1 style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 700, margin: "0 0 26px", color: PAPER.rule, wordBreak: "keep-all" }}>
        {review.book.title} 후기 수정
      </h1>

      <div style={{ marginBottom: 26 }}>
        <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 10 }}>잎점수</div>
        <LeafScoreInput name="rating" defaultValue={review.rating} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ ...monoLabel, letterSpacing: "0.12em", marginBottom: 10 }}>후기</div>
        <textarea name="content" required rows={6} defaultValue={review.content} style={textareaStyle} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'IBM Plex Sans KR',sans-serif", fontSize: 13.5, color: "#3A362F", marginBottom: 24 }}>
        <input type="checkbox" name="isPublic" defaultChecked={review.isPublic} />
        다른 사람에게 공개하기
      </label>

      <SubmitButton pendingText="저장 중..." style={ctaButtonStyle}>
        저장
      </SubmitButton>
    </form>
  );
}
