import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewReviewForm from "@/components/new-review-form";

export default async function NewReviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <NewReviewForm />;
}
