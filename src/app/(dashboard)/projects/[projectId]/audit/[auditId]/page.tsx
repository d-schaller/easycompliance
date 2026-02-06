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
import { ArrowLeft, ClipboardCheck, CheckCircle, AlertTriangle, MinusCircle } from "lucide-react";
import { ControlAuditRow } from "./control-audit-row";
import { CompleteAuditDialog } from "./complete-audit-dialog";

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; auditId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { projectId, auditId } = await params;

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
  });

  if (!project) {
    notFound();
  }

  const audit = await prisma.audit.findFirst({
    where: {
      id: auditId,
      projectId,
    },
    include: {
      controlAudits: true,
    },
  });

  if (!audit) {
    notFound();
  }

  // Get project controls with their control info
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

  // Map control audits to their project controls
  const controlAuditMap = new Map(
    audit.controlAudits.map((ca) => [ca.projectControlId, ca])
  );

  const isCompleted = audit.status === "COMPLETED";

  // Calculate stats
  const stats = {
    total: audit.controlAudits.length,
    verified: audit.controlAudits.filter((ca) => ca.verificationStatus === "VERIFIED").length,
    needsAttention: audit.controlAudits.filter((ca) => ca.verificationStatus === "NEEDS_ATTENTION").length,
    notVerified: audit.controlAudits.filter((ca) => ca.verificationStatus === "NOT_VERIFIED").length,
  };

  const progress = stats.total > 0 ? Math.round(((stats.verified + stats.needsAttention) / stats.total) * 100) : 0;

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
            <ClipboardCheck className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Audit</h1>
            <Badge
              className={
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          </div>
          <p className="mt-1 text-gray-600">{project.name}</p>
        </div>
        {!isCompleted && (
          <CompleteAuditDialog
            projectId={projectId}
            auditId={auditId}
            startedBy={audit.startedBy}
          />
        )}
      </div>

      {/* Audit Info */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-500">Started By</p>
              <p className="font-medium">{audit.startedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Started At</p>
              <p className="font-medium">
                {new Date(audit.startedAt).toLocaleString()}
              </p>
            </div>
            {isCompleted && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Completed By</p>
                  <p className="font-medium">{audit.completedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed At</p>
                  <p className="font-medium">
                    {audit.completedAt
                      ? new Date(audit.completedAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </>
            )}
          </div>
          {audit.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">Audit Notes</p>
              <p className="text-sm">{audit.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.total} controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needsAttention}</div>
            <p className="text-xs text-muted-foreground">
              controls flagged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Verified</CardTitle>
            <MinusCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notVerified}</div>
            <p className="text-xs text-muted-foreground">
              controls remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls List */}
      <Card>
        <CardHeader>
          <CardTitle>Control Verification</CardTitle>
          <CardDescription>
            Verify each control&apos;s implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectControls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No controls to audit</h3>
              <p className="mt-2 text-gray-500">
                This project has no technical controls assigned.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectControls.map((pc) => {
                const controlAudit = controlAuditMap.get(pc.id);
                if (!controlAudit) return null;

                return (
                  <ControlAuditRow
                    key={controlAudit.id}
                    projectId={projectId}
                    auditId={auditId}
                    controlAudit={{
                      id: controlAudit.id,
                      projectControlId: controlAudit.projectControlId,
                      verificationStatus: controlAudit.verificationStatus,
                      notes: controlAudit.notes,
                      verifiedAt: controlAudit.verifiedAt?.toISOString() || null,
                      verifiedBy: controlAudit.verifiedBy,
                    }}
                    projectControl={{
                      id: pc.id,
                      implementationStatus: pc.implementationStatus,
                      control: {
                        code: pc.control.code,
                        name: pc.control.name,
                        standard: {
                          shortName: pc.control.standard.shortName,
                        },
                      },
                    }}
                    isCompleted={isCompleted}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
