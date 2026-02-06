import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, projectNotFoundResponse } from "@/lib/auth-utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { DPIAReport } from "@/lib/pdf/dpia-report";
import { parseDPIA } from "@/lib/dpia-utils";
import React from "react";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId } = await params;

  // Need to include related data for the PDF, so using findFirst with includes
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organization!.id,
    },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
      dpia: true,
      controls: {
        include: {
          control: {
            include: {
              standard: true,
            },
          },
        },
        orderBy: { control: { code: "asc" } },
      },
      organizationalMeasures: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) {
    return projectNotFoundResponse();
  }

  if (!project.dpia) {
    return NextResponse.json({ error: "DPIA not found" }, { status: 404 });
  }

  const parsedDPIAData = parseDPIA(project.dpia);

  // Prepare controls data for PDF
  const controls = project.controls.map((pc) => ({
    code: pc.control.code,
    name: pc.control.name,
    standardName: pc.control.standard.shortName,
    status: pc.implementationStatus,
  }));

  // Prepare organizational measures data for PDF
  const organizationalMeasures = project.organizationalMeasures.map((m) => ({
    name: m.name,
    description: m.description,
    category: m.category,
    status: m.status,
  }));

  const generatedAt = new Date();

  try {
    const element = React.createElement(DPIAReport, {
      dpia: parsedDPIAData,
      project: {
        name: project.name,
        description: project.description,
        organization: project.organization,
      },
      controls,
      organizationalMeasures,
      generatedAt,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);

    const filename = `DPIA-${project.name.replace(/[^a-zA-Z0-9]/g, "-")}-${generatedAt.toISOString().split("T")[0]}.pdf`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Error generating DPIA PDF:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
