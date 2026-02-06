import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  hasPermission,
  verifyProjectAccess,
  projectNotFoundResponse,
  handleApiError,
} from "@/lib/auth-utils";
import { addControlsToProjectSchema } from "@/lib/validations/project";

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

  const projectControls = await prisma.projectControl.findMany({
    where: { projectId },
    include: {
      control: {
        include: {
          standard: true,
        },
      },
    },
    orderBy: { control: { code: "asc" } },
  });

  return NextResponse.json(projectControls);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to add controls" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  const project = await verifyProjectAccess(projectId, organization!.id);
  if (!project) {
    return projectNotFoundResponse();
  }

  try {
    const body = await request.json();
    const validatedData = addControlsToProjectSchema.parse(body);

    const controls = await prisma.control.findMany({
      where: { id: { in: validatedData.controlIds } },
    });

    if (controls.length !== validatedData.controlIds.length) {
      return NextResponse.json(
        { error: "One or more controls not found" },
        { status: 400 }
      );
    }

    const existingProjectControls = await prisma.projectControl.findMany({
      where: {
        projectId,
        controlId: { in: validatedData.controlIds },
      },
    });

    const existingControlIds = new Set(
      existingProjectControls.map((pc) => pc.controlId)
    );
    const newControlIds = validatedData.controlIds.filter(
      (id) => !existingControlIds.has(id)
    );

    if (newControlIds.length === 0) {
      return NextResponse.json(
        { error: "All controls are already added to this project" },
        { status: 400 }
      );
    }

    const projectControls = await prisma.projectControl.createMany({
      data: newControlIds.map((controlId) => ({
        projectId,
        controlId,
      })),
    });

    return NextResponse.json(
      {
        message: `Added ${projectControls.count} controls to project`,
        added: projectControls.count,
        skipped: validatedData.controlIds.length - newControlIds.length,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err, "add controls to project");
  }
}
