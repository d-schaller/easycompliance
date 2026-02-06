import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, CheckCircle, Clock, XCircle, Shield, FileText, AlertTriangle } from "lucide-react";
import { AddControlsDialog } from "./add-controls-dialog";
import { ControlsTable } from "./controls-table";
import { DownloadReportButton } from "./download-report-button";
import { CreateDPIAButton } from "./create-dpia-button";
import { OrganizationalMeasuresSection } from "./organizational-measures-section";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { projectId } = await params;

  const userOrg = await prisma.userOrganization.findFirst({
    where: { userId: session.user.id },
  });

  if (!userOrg) {
    redirect("/register");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: userOrg.organizationId,
    },
    include: {
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
      dpia: true,
      organizationalMeasures: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const standards = await prisma.standard.findMany({
    where: { isGlobal: true },
    include: {
      controls: {
        orderBy: { code: "asc" },
      },
    },
  });

  const existingControlIds = new Set(project.controls.map((pc) => pc.controlId));

  const stats = {
    total: project.controls.length,
    implemented: project.controls.filter(
      (c) => c.implementationStatus === "IMPLEMENTED"
    ).length,
    inProgress: project.controls.filter(
      (c) => c.implementationStatus === "IN_PROGRESS"
    ).length,
    notStarted: project.controls.filter(
      (c) => c.implementationStatus === "NOT_STARTED"
    ).length,
    notApplicable: project.controls.filter(
      (c) => c.implementationStatus === "NOT_APPLICABLE"
    ).length,
    partiallyImplemented: project.controls.filter(
      (c) => c.implementationStatus === "PARTIALLY_IMPLEMENTED"
    ).length,
  };

  const progress =
    stats.total > 0 ? Math.round((stats.implemented / stats.total) * 100) : 0;

  function getStatusBadge(status: string) {
    switch (status) {
      case "IMPLEMENTED":
        return <Badge className="bg-green-100 text-green-800">Implemented</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "NOT_STARTED":
        return <Badge variant="outline">Not Started</Badge>;
      case "NOT_APPLICABLE":
        return <Badge variant="secondary">N/A</Badge>;
      case "PARTIALLY_IMPLEMENTED":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge
              variant={
                project.status === "ACTIVE"
                  ? "default"
                  : project.status === "COMPLETED"
                  ? "secondary"
                  : "outline"
              }
            >
              {project.status.toLowerCase()}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 text-gray-600">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <DownloadReportButton
            projectId={project.id}
            projectName={project.name}
          />
          <AddControlsDialog
            projectId={project.id}
            standards={standards}
            existingControlIds={existingControlIds}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.implemented}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.total} controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              controls being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <XCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notStarted}</div>
            <p className="text-xs text-muted-foreground">
              controls pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DPIA Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>Data Protection Impact Assessment</CardTitle>
                <CardDescription>
                  DPIA in accordance with Art. 22 Swiss FADP
                </CardDescription>
              </div>
            </div>
            {project.dpia ? (
              <Link href={`/projects/${project.id}/dpia`}>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View DPIA
                </Button>
              </Link>
            ) : (
              <CreateDPIAButton projectId={project.id} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {project.dpia ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    className={
                      project.dpia.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : project.dpia.status === "IN_REVIEW"
                        ? "bg-blue-100 text-blue-800"
                        : project.dpia.status === "REQUIRES_CONSULTATION"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    variant={project.dpia.status === "DRAFT" ? "outline" : "default"}
                  >
                    {project.dpia.status === "APPROVED"
                      ? "Approved"
                      : project.dpia.status === "IN_REVIEW"
                      ? "In Review"
                      : project.dpia.status === "REQUIRES_CONSULTATION"
                      ? "Requires FDPIC Consultation"
                      : "Draft"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preliminary Risk</p>
                  <Badge
                    className={
                      project.dpia.preliminaryRiskLevel === "LOW"
                        ? "bg-green-100 text-green-800"
                        : project.dpia.preliminaryRiskLevel === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.dpia.preliminaryRiskLevel === "HIGH"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    variant={!project.dpia.preliminaryRiskLevel ? "outline" : "default"}
                  >
                    {project.dpia.preliminaryRiskLevel || "Not Assessed"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Residual Risk</p>
                  <Badge
                    className={
                      project.dpia.residualRiskLevel === "LOW"
                        ? "bg-green-100 text-green-800"
                        : project.dpia.residualRiskLevel === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.dpia.residualRiskLevel === "HIGH"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    variant={!project.dpia.residualRiskLevel ? "outline" : "default"}
                  >
                    {project.dpia.residualRiskLevel || "Not Assessed"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(project.dpia.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {project.dpia.requiresFDPICConsultation && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">FDPIC Consultation Required</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No DPIA created</h3>
              <p className="mt-2 text-gray-500 max-w-md">
                Create a Data Protection Impact Assessment to evaluate privacy risks
                and document protective measures for this project.
              </p>
              <div className="mt-4">
                <CreateDPIAButton projectId={project.id} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizational Measures Section */}
      <OrganizationalMeasuresSection
        projectId={project.id}
        measures={project.organizationalMeasures.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          category: m.category,
          status: m.status,
          responsiblePerson: m.responsiblePerson,
        }))}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Controls</CardTitle>
              <CardDescription>
                {stats.total} controls assigned to this project
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {project.controls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Plus className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No controls added</h3>
              <p className="mt-2 text-gray-500">
                Add controls from security standards to start tracking
              </p>
              <AddControlsDialog
                projectId={project.id}
                standards={standards}
                existingControlIds={existingControlIds}
              />
            </div>
          ) : (
            <ControlsTable
              projectId={project.id}
              controls={project.controls.map((pc) => ({
                id: pc.id,
                controlId: pc.controlId,
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
                  },
                },
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
