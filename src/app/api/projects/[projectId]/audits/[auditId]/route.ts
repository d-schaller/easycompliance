import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { completeAuditSchema } from "@/lib/validations/audit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; auditId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId, auditId } = await params;

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

  const audit = await prisma.audit.findFirst({
    where: {
      id: auditId,
      projectId,
    },
    include: {
      controlAudits: true,
    },
  });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json(audit);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; auditId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to update this audit" },
      { status: 403 }
    );
  }

  const { projectId, auditId } = await params;

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

  const existingAudit = await prisma.audit.findFirst({
    where: {
      id: auditId,
      projectId,
    },
  });

  if (!existingAudit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  if (existingAudit.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot modify a completed audit" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = completeAuditSchema.parse(body);

    const audit = await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "COMPLETED",
        completedBy: validatedData.completedBy,
        completedAt: new Date(),
        notes: validatedData.notes,
      },
      include: {
        controlAudits: true,
      },
    });

    return NextResponse.json(audit);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error updating audit:", err);
    return NextResponse.json(
      { error: "Failed to update audit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; auditId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "ADMIN")) {
    return NextResponse.json(
      { error: "You do not have permission to delete this audit" },
      { status: 403 }
    );
  }

  const { projectId, auditId } = await params;

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

  const existingAudit = await prisma.audit.findFirst({
    where: {
      id: auditId,
      projectId,
    },
  });

  if (!existingAudit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  await prisma.audit.delete({
    where: { id: auditId },
  });

  return NextResponse.json({ success: true });
}
