import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProjectReport } from "@/lib/pdf/project-report";
import React from "react";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { error, organization } = await requireAuth();
  if (error) return error;

  const { projectId } = await params;

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
      controls: {
        include: {
          control: {
            include: {
              standard: {
                select: {
                  shortName: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          control: {
            code: "asc",
          },
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await renderToBuffer(
      React.createElement(ProjectReport, {
        project: {
          name: project.name,
          description: project.description,
          status: project.status,
          createdAt: project.createdAt,
          organization: project.organization,
        },
        controls: project.controls.map((pc) => ({
          id: pc.id,
          implementationStatus: pc.implementationStatus,
          implementationDescription: pc.implementationDescription,
          referenceUrl: pc.referenceUrl,
          responsiblePerson: pc.responsiblePerson,
          control: {
            code: pc.control.code,
            name: pc.control.name,
            description: pc.control.description,
            category: pc.control.category,
            standard: {
              shortName: pc.control.standard.shortName,
              name: pc.control.standard.name,
            },
          },
        })),
        generatedAt: new Date(),
      })
    );

    const filename = `${project.name.replace(/[^a-z0-9]/gi, "_")}_Compliance_Report_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
