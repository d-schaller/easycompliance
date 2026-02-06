import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { updateOrganizationalMeasureSchema } from "@/lib/validations/organizational-measure";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; measureId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId, measureId } = await params;

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

  const measure = await prisma.organizationalMeasure.findFirst({
    where: {
      id: measureId,
      projectId,
    },
  });

  if (!measure) {
    return NextResponse.json(
      { error: "Organizational measure not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(measure);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; measureId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to update organizational measures" },
      { status: 403 }
    );
  }

  const { projectId, measureId } = await params;

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

  const existingMeasure = await prisma.organizationalMeasure.findFirst({
    where: {
      id: measureId,
      projectId,
    },
  });

  if (!existingMeasure) {
    return NextResponse.json(
      { error: "Organizational measure not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = updateOrganizationalMeasureSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    if (validatedData.category !== undefined) {
      updateData.category = validatedData.category;
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      // Auto-set completedAt when status changes to IMPLEMENTED
      if (validatedData.status === "IMPLEMENTED" && !existingMeasure.completedAt) {
        updateData.completedAt = new Date();
      } else if (validatedData.status !== "IMPLEMENTED") {
        updateData.completedAt = null;
      }
    }
    if (validatedData.responsiblePerson !== undefined) {
      updateData.responsiblePerson = validatedData.responsiblePerson;
    }
    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : null;
    }
    if (validatedData.completedAt !== undefined) {
      updateData.completedAt = validatedData.completedAt
        ? new Date(validatedData.completedAt)
        : null;
    }
    if (validatedData.evidence !== undefined) {
      updateData.evidence = validatedData.evidence;
    }

    const measure = await prisma.organizationalMeasure.update({
      where: { id: measureId },
      data: updateData,
    });

    return NextResponse.json(measure);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error updating organizational measure:", err);
    return NextResponse.json(
      { error: "Failed to update organizational measure" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; measureId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to delete organizational measures" },
      { status: 403 }
    );
  }

  const { projectId, measureId } = await params;

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

  const existingMeasure = await prisma.organizationalMeasure.findFirst({
    where: {
      id: measureId,
      projectId,
    },
  });

  if (!existingMeasure) {
    return NextResponse.json(
      { error: "Organizational measure not found" },
      { status: 404 }
    );
  }

  await prisma.organizationalMeasure.delete({
    where: { id: measureId },
  });

  return NextResponse.json({ success: true });
}
