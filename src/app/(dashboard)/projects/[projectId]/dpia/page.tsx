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
import {
  ArrowLeft,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Users,
  FileText,
  Scale,
  Settings,
} from "lucide-react";
import { DPIAStatusBadge } from "./dpia-status-badge";
import { RiskLevelBadge } from "./risk-level-badge";
import { DownloadDPIAButton } from "./download-dpia-button";
import {
  DATA_CATEGORY_LABELS,
  SENSITIVE_DATA_LABELS,
  LEGAL_BASIS_LABELS,
  type IdentifiedRisk,
} from "@/lib/validations/dpia";
import { MEASURE_CATEGORY_LABELS } from "@/lib/validations/organizational-measure";

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

export default async function DPIAPage({
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
        orderBy: [{ category: "asc" }, { name: "asc" }],
      },
    },
  });

  if (!project) {
    notFound();
  }

  if (!project.dpia) {
    redirect(`/projects/${projectId}`);
  }

  const dpia = project.dpia;

  // Parse JSON fields
  const dataCategories = dpia.dataCategories
    ? (JSON.parse(dpia.dataCategories) as string[])
    : [];
  const sensitiveDataTypes = dpia.sensitiveDataTypes
    ? (JSON.parse(dpia.sensitiveDataTypes) as string[])
    : [];
  const identifiedRisks = dpia.identifiedRisks
    ? (JSON.parse(dpia.identifiedRisks) as IdentifiedRisk[])
    : [];

  // Calculate stats for controls (technical measures)
  const controlStats = {
    total: project.controls.length,
    implemented: project.controls.filter(
      (c) => c.implementationStatus === "IMPLEMENTED"
    ).length,
  };

  // Calculate stats for organizational measures
  const orgMeasureStats = {
    total: project.organizationalMeasures.length,
    implemented: project.organizationalMeasures.filter(
      (m) => m.status === "IMPLEMENTED"
    ).length,
  };

  // Calculate completion percentage
  const sections = [
    dpia.processingDescription,
    dataCategories.length > 0,
    dpia.dataSubjects,
    dpia.processingPurpose,
    dpia.legalBasis,
    dpia.preliminaryRiskLevel,
    identifiedRisks.length > 0 || dpia.preliminaryRiskLevel === "LOW",
    controlStats.total > 0 || orgMeasureStats.total > 0,
    dpia.residualRiskLevel,
  ];
  const completedSections = sections.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedSections / sections.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Data Protection Impact Assessment</h1>
            <DPIAStatusBadge status={dpia.status} />
          </div>
          <p className="mt-1 text-gray-600">
            DPIA for {project.name} - Art. 22 Swiss FADP
          </p>
        </div>
        <div className="flex gap-2">
          <DownloadDPIAButton projectId={projectId} projectName={project.name} />
          <Link href={`/projects/${projectId}/dpia/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit DPIA
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Preliminary Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <RiskLevelBadge level={dpia.preliminaryRiskLevel} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residual Risk</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <RiskLevelBadge level={dpia.residualRiskLevel} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              FDPIC Consultation
            </CardTitle>
            <Scale className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {dpia.requiresFDPICConsultation ? (
              <Badge className="bg-yellow-100 text-yellow-800">Required</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800">Not Required</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warning for high residual risk */}
      {dpia.requiresFDPICConsultation && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">
                FDPIC Consultation Required
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                This DPIA indicates a high residual risk. According to Art. 23 FADP,
                you must consult with the Federal Data Protection and Information
                Commissioner (FDPIC) before proceeding with the data processing.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Processing Description
          </CardTitle>
          <CardDescription>
            Description of the planned data processing activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Processing Activities
            </h4>
            <p className="text-gray-900">
              {dpia.processingDescription || (
                <span className="text-gray-400 italic">Not specified</span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Purpose of Processing
            </h4>
            <p className="text-gray-900">
              {dpia.processingPurpose || (
                <span className="text-gray-400 italic">Not specified</span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Technology Description
            </h4>
            <p className="text-gray-900">
              {dpia.technologyDescription || (
                <span className="text-gray-400 italic">Not specified</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Data Categories & Subjects
          </CardTitle>
          <CardDescription>
            Types of personal data and affected individuals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Personal Data Categories
            </h4>
            {dataCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dataCategories.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {DATA_CATEGORY_LABELS[cat] || cat}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No categories specified</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Sensitive Data Types (Art. 5 FADP)
            </h4>
            {sensitiveDataTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sensitiveDataTypes.map((type) => (
                  <Badge key={type} className="bg-red-100 text-red-800">
                    {SENSITIVE_DATA_LABELS[type] || type}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No sensitive data types identified
              </p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Data Subjects
              </h4>
              <p className="text-gray-900">
                {dpia.dataSubjects || (
                  <span className="text-gray-400 italic">Not specified</span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Estimated Number
              </h4>
              <p className="text-gray-900">
                {dpia.estimatedDataSubjects || (
                  <span className="text-gray-400 italic">Not specified</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Basis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal Basis
          </CardTitle>
          <CardDescription>
            Lawful basis for processing under Swiss FADP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900">
            {dpia.legalBasis ? (
              LEGAL_BASIS_LABELS[dpia.legalBasis] || dpia.legalBasis
            ) : (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
          <CardDescription>
            Identified risks and their evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Preliminary Risk Level
              </h4>
              <RiskLevelBadge level={dpia.preliminaryRiskLevel} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Identified Risks
            </h4>
            {identifiedRisks.length > 0 ? (
              <div className="space-y-2">
                {identifiedRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{risk.description}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Likelihood:{" "}
                          <span className="font-medium">{risk.likelihood}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Impact:{" "}
                          <span className="font-medium">{risk.impact}</span>
                        </span>
                      </div>
                    </div>
                    {risk.mitigated ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No risks identified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Technical Measures (Controls) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Technical Measures (Security Controls)
              </CardTitle>
              <CardDescription>
                Controls from security standards assigned to this project
              </CardDescription>
            </div>
            <Link href={`/projects/${projectId}`}>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Manage Controls
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {project.controls.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <span>
                  <strong>{controlStats.implemented}</strong> of{" "}
                  <strong>{controlStats.total}</strong> controls implemented
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {project.controls.slice(0, 10).map((pc) => (
                  <div
                    key={pc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {pc.control.code}
                      </Badge>
                      <span className="text-sm truncate max-w-md">
                        {pc.control.name}
                      </span>
                    </div>
                    {getStatusBadge(pc.implementationStatus)}
                  </div>
                ))}
                {project.controls.length > 10 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    ... and {project.controls.length - 10} more controls
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              No security controls assigned to this project yet.{" "}
              <Link
                href={`/projects/${projectId}`}
                className="text-blue-600 underline"
              >
                Add controls
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Organizational Measures */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Organizational Measures
              </CardTitle>
              <CardDescription>
                Policies, training, and procedures to protect data
              </CardDescription>
            </div>
            <Link href={`/projects/${projectId}`}>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Manage Measures
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {project.organizationalMeasures.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <span>
                  <strong>{orgMeasureStats.implemented}</strong> of{" "}
                  <strong>{orgMeasureStats.total}</strong> measures implemented
                </span>
              </div>
              <div className="space-y-2">
                {project.organizationalMeasures.map((measure) => (
                  <div
                    key={measure.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      {measure.category && (
                        <Badge variant="outline" className="text-xs">
                          {MEASURE_CATEGORY_LABELS[measure.category] ||
                            measure.category}
                        </Badge>
                      )}
                      <span className="text-sm">{measure.name}</span>
                    </div>
                    {getStatusBadge(measure.status)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              No organizational measures defined yet.{" "}
              <Link
                href={`/projects/${projectId}`}
                className="text-blue-600 underline"
              >
                Add measures
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data Protection by Design */}
      <Card>
        <CardHeader>
          <CardTitle>Data Protection by Design</CardTitle>
          <CardDescription>
            Privacy-friendly design principles implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900">
            {dpia.dataProtectionByDesign || (
              <span className="text-gray-400 italic">Not specified</span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Residual Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Residual Risk Evaluation</CardTitle>
          <CardDescription>
            Risk level after implementing protective measures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Residual Risk Level
            </h4>
            <RiskLevelBadge level={dpia.residualRiskLevel} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Justification
            </h4>
            <p className="text-gray-900">
              {dpia.residualRiskJustification || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Consultation */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation</CardTitle>
          <CardDescription>
            DPO and FDPIC consultation status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                DPO Consulted
              </h4>
              <p className="text-gray-900">
                {dpia.dpoConsulted ? "Yes" : "No"}
                {dpia.dpoConsulted && dpia.dpoName && ` - ${dpia.dpoName}`}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                FDPIC Consultation Required
              </h4>
              <p className="text-gray-900">
                {dpia.requiresFDPICConsultation ? "Yes" : "No"}
                {dpia.fdpicSubmissionDate &&
                  ` - Submitted ${new Date(dpia.fdpicSubmissionDate).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          {dpia.dpoOpinion && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                DPO Opinion
              </h4>
              <p className="text-gray-900">{dpia.dpoOpinion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Assessor
              </h4>
              <p className="text-gray-900">
                {dpia.assessorName || (
                  <span className="text-gray-400 italic">Not specified</span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Role</h4>
              <p className="text-gray-900">
                {dpia.assessorRole || (
                  <span className="text-gray-400 italic">Not specified</span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Created
              </h4>
              <p className="text-gray-900">
                {new Date(dpia.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </h4>
              <p className="text-gray-900">
                {new Date(dpia.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {dpia.status === "APPROVED" && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <CheckCircle2 className="inline h-4 w-4 mr-1" />
                Approved
                {dpia.approvedBy && ` by ${dpia.approvedBy}`}
                {dpia.approvalDate &&
                  ` on ${new Date(dpia.approvalDate).toLocaleDateString()}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
