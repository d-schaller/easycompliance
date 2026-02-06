import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hasPermission } from "@/lib/auth-utils";
import { createDPIASchema, updateDPIASchema } from "@/lib/validations/dpia";

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

  const dpia = await prisma.dPIA.findUnique({
    where: { projectId },
  });

  if (!dpia) {
    return NextResponse.json({ error: "DPIA not found" }, { status: 404 });
  }

  // Parse JSON fields
  const parsedDPIA = {
    ...dpia,
    dataCategories: dpia.dataCategories ? JSON.parse(dpia.dataCategories) : null,
    sensitiveDataTypes: dpia.sensitiveDataTypes ? JSON.parse(dpia.sensitiveDataTypes) : null,
    identifiedRisks: dpia.identifiedRisks ? JSON.parse(dpia.identifiedRisks) : null,
  };

  return NextResponse.json(parsedDPIA);
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

    const dpia = await prisma.dPIA.create({
      data: {
        projectId,
        processingDescription: validatedData.processingDescription,
        dataCategories: validatedData.dataCategories
          ? JSON.stringify(validatedData.dataCategories)
          : null,
        sensitiveDataTypes: validatedData.sensitiveDataTypes
          ? JSON.stringify(validatedData.sensitiveDataTypes)
          : null,
        dataSubjects: validatedData.dataSubjects,
        estimatedDataSubjects: validatedData.estimatedDataSubjects,
        processingPurpose: validatedData.processingPurpose,
        legalBasis: validatedData.legalBasis,
        technologyDescription: validatedData.technologyDescription,
        preliminaryRiskLevel: validatedData.preliminaryRiskLevel,
      },
    });

    return NextResponse.json(dpia, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error creating DPIA:", err);
    return NextResponse.json(
      { error: "Failed to create DPIA" },
      { status: 500 }
    );
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

    // Prepare data for update, converting arrays to JSON strings
    const updateData: Record<string, unknown> = {};

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }
    if (validatedData.processingDescription !== undefined) {
      updateData.processingDescription = validatedData.processingDescription;
    }
    if (validatedData.dataCategories !== undefined) {
      updateData.dataCategories = validatedData.dataCategories
        ? JSON.stringify(validatedData.dataCategories)
        : null;
    }
    if (validatedData.sensitiveDataTypes !== undefined) {
      updateData.sensitiveDataTypes = validatedData.sensitiveDataTypes
        ? JSON.stringify(validatedData.sensitiveDataTypes)
        : null;
    }
    if (validatedData.dataSubjects !== undefined) {
      updateData.dataSubjects = validatedData.dataSubjects;
    }
    if (validatedData.estimatedDataSubjects !== undefined) {
      updateData.estimatedDataSubjects = validatedData.estimatedDataSubjects;
    }
    if (validatedData.processingPurpose !== undefined) {
      updateData.processingPurpose = validatedData.processingPurpose;
    }
    if (validatedData.legalBasis !== undefined) {
      updateData.legalBasis = validatedData.legalBasis;
    }
    if (validatedData.technologyDescription !== undefined) {
      updateData.technologyDescription = validatedData.technologyDescription;
    }
    if (validatedData.preliminaryRiskLevel !== undefined) {
      updateData.preliminaryRiskLevel = validatedData.preliminaryRiskLevel;
    }
    if (validatedData.identifiedRisks !== undefined) {
      updateData.identifiedRisks = validatedData.identifiedRisks
        ? JSON.stringify(validatedData.identifiedRisks)
        : null;
    }
    if (validatedData.dataProtectionByDesign !== undefined) {
      updateData.dataProtectionByDesign = validatedData.dataProtectionByDesign;
    }
    if (validatedData.residualRiskLevel !== undefined) {
      updateData.residualRiskLevel = validatedData.residualRiskLevel;
    }
    if (validatedData.residualRiskJustification !== undefined) {
      updateData.residualRiskJustification = validatedData.residualRiskJustification;
    }
    if (validatedData.requiresFDPICConsultation !== undefined) {
      updateData.requiresFDPICConsultation = validatedData.requiresFDPICConsultation;
    }
    if (validatedData.dpoConsulted !== undefined) {
      updateData.dpoConsulted = validatedData.dpoConsulted;
    }
    if (validatedData.dpoName !== undefined) {
      updateData.dpoName = validatedData.dpoName;
    }
    if (validatedData.dpoOpinion !== undefined) {
      updateData.dpoOpinion = validatedData.dpoOpinion;
    }
    if (validatedData.fdpicSubmissionDate !== undefined) {
      updateData.fdpicSubmissionDate = validatedData.fdpicSubmissionDate
        ? new Date(validatedData.fdpicSubmissionDate)
        : null;
    }
    if (validatedData.assessorName !== undefined) {
      updateData.assessorName = validatedData.assessorName;
    }
    if (validatedData.assessorRole !== undefined) {
      updateData.assessorRole = validatedData.assessorRole;
    }
    if (validatedData.approvedBy !== undefined) {
      updateData.approvedBy = validatedData.approvedBy;
    }
    if (validatedData.approvalDate !== undefined) {
      updateData.approvalDate = validatedData.approvalDate
        ? new Date(validatedData.approvalDate)
        : null;
    }

    const dpia = await prisma.dPIA.update({
      where: { projectId },
      data: updateData,
    });

    // Parse JSON fields for response
    const parsedDPIA = {
      ...dpia,
      dataCategories: dpia.dataCategories ? JSON.parse(dpia.dataCategories) : null,
      sensitiveDataTypes: dpia.sensitiveDataTypes ? JSON.parse(dpia.sensitiveDataTypes) : null,
      identifiedRisks: dpia.identifiedRisks ? JSON.parse(dpia.identifiedRisks) : null,
    };

    return NextResponse.json(parsedDPIA);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: err },
        { status: 400 }
      );
    }

    console.error("Error updating DPIA:", err);
    return NextResponse.json(
      { error: "Failed to update DPIA" },
      { status: 500 }
    );
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
