import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { updateProjectControlSchema } from "@/lib/validations/project";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; controlId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId, controlId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectControl = await prisma.projectControl.findFirst({
    where: {
      projectId,
      controlId,
    },
    include: {
      control: {
        include: {
          standard: true,
        },
      },
    },
  });

  if (!projectControl) {
    return NextResponse.json(
      { error: "Control not found in project" },
      { status: 404 }
    );
  }

  return NextResponse.json(projectControl);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; controlId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to update controls" },
      { status: 403 }
    );
  }

  const { projectId, controlId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectControl = await prisma.projectControl.findFirst({
    where: {
      projectId,
      controlId,
    },
  });

  if (!projectControl) {
    return NextResponse.json(
      { error: "Control not found in project" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = updateProjectControlSchema.parse(body);

    const updateData: Record<string, unknown> = { ...validatedData };

    if (validatedData.dueDate) {
      updateData.dueDate = new Date(validatedData.dueDate);
    }

    if (validatedData.implementationStatus === "IMPLEMENTED") {
      updateData.completedAt = new Date();
    } else if (projectControl.implementationStatus === "IMPLEMENTED") {
      updateData.completedAt = null;
    }

    const updatedControl = await prisma.projectControl.update({
      where: { id: projectControl.id },
      data: updateData,
      include: {
        control: {
          include: {
            standard: true,
          },
        },
      },
    });

    return NextResponse.json(updatedControl);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error updating project control:", err);
    return NextResponse.json(
      { error: "Failed to update control" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; controlId: string }> }
) {
  const { error, organization, userOrg } = await requireAuth();
  if (error) return error;

  if (!hasPermission(userOrg!.role, "MEMBER")) {
    return NextResponse.json(
      { error: "You do not have permission to remove controls" },
      { status: 403 }
    );
  }

  const { projectId, controlId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectControl = await prisma.projectControl.findFirst({
    where: {
      projectId,
      controlId,
    },
  });

  if (!projectControl) {
    return NextResponse.json(
      { error: "Control not found in project" },
      { status: 404 }
    );
  }

  await prisma.projectControl.delete({
    where: { id: projectControl.id },
  });

  return NextResponse.json({ success: true });
}
