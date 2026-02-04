import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const standards = await prisma.standard.findMany({
    where: { isGlobal: true },
    include: {
      _count: {
        select: { controls: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(standards);
}
