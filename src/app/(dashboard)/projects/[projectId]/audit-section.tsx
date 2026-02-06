"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronDown, ChevronRight } from "lucide-react";
import { StartAuditButton } from "./start-audit-button";

interface Audit {
  id: string;
  status: string;
  startedBy: string;
  startedAt: Date;
  completedBy: string | null;
  completedAt: Date | null;
}

interface AuditSectionProps {
  projectId: string;
  audits: Audit[];
  hasControls: boolean;
}

export function AuditSection({ projectId, audits, hasControls }: AuditSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const inProgressAudit = audits.find((a) => a.status === "IN_PROGRESS");
  const lastCompletedAudit = audits.find((a) => a.status === "COMPLETED");

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-base">Audit</CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Collapsed state info */}
            {!isExpanded && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {inProgressAudit ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    <span>Started {new Date(inProgressAudit.startedAt).toLocaleDateString()}</span>
                  </div>
                ) : lastCompletedAudit ? (
                  <span>
                    Last audit: {lastCompletedAudit.completedAt
                      ? new Date(lastCompletedAudit.completedAt).toLocaleDateString()
                      : "-"}
                  </span>
                ) : (
                  <span className="text-gray-400">No audits yet</span>
                )}
              </div>
            )}

            {/* Action button */}
            <div onClick={(e) => e.stopPropagation()}>
              {inProgressAudit ? (
                <Link href={`/projects/${projectId}/audit/${inProgressAudit.id}`}>
                  <Button variant="outline" size="sm">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Continue Audit
                  </Button>
                </Link>
              ) : (
                <StartAuditButton
                  projectId={projectId}
                  disabled={!hasControls}
                />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {inProgressAudit ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Started By</p>
                  <p className="text-sm font-medium">{inProgressAudit.startedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Started At</p>
                  <p className="text-sm font-medium">
                    {new Date(inProgressAudit.startedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : lastCompletedAudit ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-500">Last Audit</p>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed By</p>
                  <p className="text-sm font-medium">{lastCompletedAudit.completedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed At</p>
                  <p className="text-sm font-medium">
                    {lastCompletedAudit.completedAt
                      ? new Date(lastCompletedAudit.completedAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <Link href={`/projects/${projectId}/audit/${lastCompletedAudit.id}`}>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No audits performed</h3>
              <p className="mt-2 text-gray-500 max-w-md">
                {!hasControls
                  ? "Add technical controls to the project before starting an audit."
                  : "Start an audit to verify the implementation status of your controls."}
              </p>
              {hasControls && (
                <div className="mt-4">
                  <StartAuditButton projectId={projectId} />
                </div>
              )}
            </div>
          )}

          {/* Audit history */}
          {audits.filter(a => a.status === "COMPLETED").length > 1 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Audit History</h4>
              <div className="space-y-2">
                {audits
                  .filter((a) => a.status === "COMPLETED")
                  .slice(0, 5)
                  .map((audit) => (
                    <div
                      key={audit.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {audit.completedAt
                            ? new Date(audit.completedAt).toLocaleDateString()
                            : "-"}
                        </span>
                        <span className="text-gray-500">by {audit.completedBy}</span>
                      </div>
                      <Link href={`/projects/${projectId}/audit/${audit.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
