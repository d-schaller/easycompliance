import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  hasPermission,
  verifyProjectAccess,
  projectNotFoundResponse,
  handleApiError,
} from "@/lib/auth-utils";
import { createDPIASchema, updateDPIASchema } from "@/lib/validations/dpia";
import { parseDPIA, prepareDPIAForDB } from "@/lib/dpia-utils";

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

  const dpia = await prisma.dPIA.findUnique({
    where: { projectId },
  });

  if (!dpia) {
    return NextResponse.json({ error: "DPIA not found" }, { status: 404 });
  }

  return NextResponse.json(parseDPIA(dpia));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to create a DPIA" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  const project = await verifyProjectAccess(projectId, organization!.id);
  if (!project) {
    return projectNotFoundResponse();
  }

  // Check if DPIA already exists
  const existingDPIA = await prisma.dPIA.findUnique({
    where: { projectId },
  });

  if (existingDPIA) {
    return NextResponse.json(
      { error: "A DPIA already exists for this project" },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = createDPIASchema.parse(body);

    const dbData = prepareDPIAForDB(validatedData);

    const dpia = await prisma.dPIA.create({
      data: {
        projectId,
        ...dbData,
      },
    });

    return NextResponse.json(parseDPIA(dpia), { status: 201 });
  } catch (err) {
    return handleApiError(err, "create DPIA");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to update the DPIA" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  const project = await verifyProjectAccess(projectId, organization!.id);
  if (!project) {
    return projectNotFoundResponse();
  }

  // Check if DPIA exists
  const existingDPIA = await prisma.dPIA.findUnique({
    where: { projectId },
  });

  if (!existingDPIA) {
    return NextResponse.json({ error: "DPIA not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validatedData = updateDPIASchema.parse(body);

    const dbData = prepareDPIAForDB(validatedData);

    const dpia = await prisma.dPIA.update({
      where: { projectId },
      data: dbData,
    });

    return NextResponse.json(parseDPIA(dpia));
  } catch (err) {
    return handleApiError(err, "update DPIA");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "ADMIN")) {
    return NextResponse.json(
      { error: "You do not have permission to delete the DPIA" },
      { status: 403 }
    );
  }

  const { projectId } = await params;

  const project = await verifyProjectAccess(projectId, organization!.id);
  if (!project) {
    return projectNotFoundResponse();
  }

  // Check if DPIA exists
  const existingDPIA = await prisma.dPIA.findUnique({
    where: { projectId },
  });

  if (!existingDPIA) {
    return NextResponse.json({ error: "DPIA not found" }, { status: 404 });
  }

  await prisma.dPIA.delete({
    where: { projectId },
  });

  return NextResponse.json({ success: true });
}
