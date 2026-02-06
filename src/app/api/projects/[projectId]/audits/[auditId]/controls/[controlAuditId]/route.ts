import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { updateControlAuditSchema } from "@/lib/validations/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; auditId: string; controlAuditId: string }> }
) {
  const { error, organization, userOrg, user } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to update control audits" },
      { status: 403 }
    );
  }

  const { projectId, auditId, controlAuditId } = await params;

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

  // Verify audit exists and belongs to project
  const audit = await prisma.audit.findFirst({
    where: {
      id: auditId,
      projectId,
    },
  });

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  if (audit.status === "COMPLETED") {
    return NextResponse.json(
      { error: "Cannot modify controls in a completed audit" },
      { status: 400 }
    );
  }

  // Verify control audit exists and belongs to audit
  const controlAudit = await prisma.controlAudit.findFirst({
    where: {
      id: controlAuditId,
      auditId,
    },
  });

  if (!controlAudit) {
    return NextResponse.json({ error: "Control audit not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validatedData = updateControlAuditSchema.parse(body);

    const updatedControlAudit = await prisma.controlAudit.update({
      where: { id: controlAuditId },
      data: {
        verificationStatus: validatedData.verificationStatus,
        notes: validatedData.notes,
        verifiedAt: validatedData.verificationStatus !== "NOT_VERIFIED" ? new Date() : null,
        verifiedBy: validatedData.verificationStatus !== "NOT_VERIFIED" ? user!.name || user!.email : null,
      },
    });

    return NextResponse.json(updatedControlAudit);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error updating control audit:", err);
    return NextResponse.json(
      { error: "Failed to update control audit" },
      { status: 500 }
    );
  }
}
