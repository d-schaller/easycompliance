import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ standardId: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { standardId } = await params;

  const standard = await prisma.standard.findFirst({
    where: {
      id: standardId,
      isGlobal: true,
    },
    include: {
      controls: {
        orderBy: { code: "asc" },
      },
    },
  });

  if (!standard) {
    return NextResponse.json({ error: "Standard not found" }, { status: 404 });
  }

  return NextResponse.json(standard);
}
