import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  hasPermission,
  verifyProjectAccess,
  projectNotFoundResponse,
  handleApiError,
} from "@/lib/auth-utils";
import { startAuditSchema } from "@/lib/validations/audit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId } = await params;

  const project = await verifyProjectAccess(projectId, organization!.id);
  if (!project) {
    return projectNotFoundResponse();
  }

  const audits = await prisma.audit.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      controlAudits: true,
    },
  });

  return NextResponse.json(audits);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to create an audit" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  // Need to include controls for creating audit entries
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
    include: {
      controls: true,
    },
  });

  if (!project) {
    return projectNotFoundResponse();
  }

  // Check if there's already an audit in progress
  const existingAudit = await prisma.audit.findFirst({
    where: {
      projectId,
      status: "IN_PROGRESS",
    },
  });

  if (existingAudit) {
    return NextResponse.json(
      { error: "An audit is already in progress for this project" },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = startAuditSchema.parse(body);

    // Create audit with control audit entries for each project control
    const audit = await prisma.audit.create({
      data: {
        projectId,
        startedBy: validatedData.startedBy,
        controlAudits: {
          create: project.controls.map((pc) => ({
            projectControlId: pc.id,
          })),
        },
      },
      include: {
        controlAudits: true,
      },
    });

    return NextResponse.json(audit, { status: 201 });
  } catch (err) {
    return handleApiError(err, "create audit");
  }
}
