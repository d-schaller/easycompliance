import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const standardId = searchParams.get("standardId");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (standardId) {
    where.standardId = standardId;
  }

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const controls = await prisma.control.findMany({
    where,
    include: {
      standard: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
    },
    orderBy: [{ standard: { name: "asc" } }, { code: "asc" }],
  });

  return NextResponse.json(controls);
}
