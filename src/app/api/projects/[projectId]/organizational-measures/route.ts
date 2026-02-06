import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { createOrganizationalMeasureSchema } from "@/lib/validations/organizational-measure";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId } = await params;

  // Verify project belongs to organization
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const measures = await prisma.organizationalMeasure.findMany({
    where: { projectId },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(measures);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to create organizational measures" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  // Verify project belongs to organization
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validatedData = createOrganizationalMeasureSchema.parse(body);

    const measure = await prisma.organizationalMeasure.create({
      data: {
        projectId,
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        responsiblePerson: validatedData.responsiblePerson,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
    });

    return NextResponse.json(measure, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error creating organizational measure:", err);
    return NextResponse.json(
      { error: "Failed to create organizational measure" },
      { status: 500 }
    );
  }
}
