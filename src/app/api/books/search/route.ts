import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/books";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchBooks(query);
  return NextResponse.json({ results });
}
