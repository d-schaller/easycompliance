"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, AlertTriangle, MinusCircle, Loader2 } from "lucide-react";
import { VERIFICATION_STATUS_LABELS } from "@/lib/validations/audit";

interface ControlAuditRowProps {
  projectId: string;
  auditId: string;
  controlAudit: {
    id: string;
    projectControlId: string;
    verificationStatus: string;
    notes: string | null;
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
  projectControl: {
    id: string;
    implementationStatus: string;
    control: {
      code: string;
      name: string;
      standard: {
        shortName: string;
      };
    };
  };
  isCompleted: boolean;
}

const IMPLEMENTATION_STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  IMPLEMENTED: "Implemented",
  NOT_APPLICABLE: "N/A",
  PARTIALLY_IMPLEMENTED: "Partial",
};

export function ControlAuditRow({
  projectId,
  auditId,
  controlAudit,
  projectControl,
  isCompleted,
}: ControlAuditRowProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState(controlAudit.notes || "");
  const [notesTimeout, setNotesTimeout] = useState<NodeJS.Timeout | null>(null);

  async function handleStatusChange(newStatus: string) {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/audits/${auditId}/controls/${controlAudit.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verificationStatus: newStatus,
            notes: notes || null,
          }),
        }
      );

      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Error updating control audit:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNotesChange(value: string) {
    setNotes(value);

    // Debounce the save
    if (notesTimeout) {
      clearTimeout(notesTimeout);
    }

    const timeout = setTimeout(async () => {
      try {
        await fetch(
          `/api/projects/${projectId}/audits/${auditId}/controls/${controlAudit.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verificationStatus: controlAudit.verificationStatus,
              notes: value || null,
            }),
          }
        );
      } catch (err) {
        console.error("Error saving notes:", err);
      }
    }, 500);

    setNotesTimeout(timeout);
  }

  function getVerificationIcon(status: string) {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "NEEDS_ATTENTION":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <MinusCircle className="h-4 w-4 text-gray-400" />;
    }
  }

  function getImplementationStatusBadge(status: string) {
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
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-medium">
              {projectControl.control.code}
            </span>
            <Badge variant="outline" className="text-xs">
              {projectControl.control.standard.shortName}
            </Badge>
          </div>
          <p className="text-sm text-gray-700">{projectControl.control.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Implementation</p>
            {getImplementationStatusBadge(projectControl.implementationStatus)}
          </div>

          <div className="text-right min-w-[160px]">
            <p className="text-xs text-gray-500 mb-1">Verification</p>
            {isCompleted ? (
              <div className="flex items-center gap-2 justify-end">
                {getVerificationIcon(controlAudit.verificationStatus)}
                <span className="text-sm">
                  {VERIFICATION_STATUS_LABELS[controlAudit.verificationStatus]}
                </span>
              </div>
            ) : (
              <Select
                value={controlAudit.verificationStatus}
                onValueChange={handleStatusChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[160px]">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_VERIFIED">
                    <div className="flex items-center gap-2">
                      <MinusCircle className="h-4 w-4 text-gray-400" />
                      Not Verified
                    </div>
                  </SelectItem>
                  <SelectItem value="VERIFIED">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Verified
                    </div>
                  </SelectItem>
                  <SelectItem value="NEEDS_ATTENTION">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Needs Attention
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {(controlAudit.notes || !isCompleted) && (
        <div>
          {isCompleted ? (
            controlAudit.notes && (
              <div className="bg-gray-50 rounded p-2 text-sm text-gray-600">
                {controlAudit.notes}
              </div>
            )
          ) : (
            <Textarea
              placeholder="Add notes about this control verification..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="text-sm"
              rows={2}
            />
          )}
        </div>
      )}

      {controlAudit.verifiedAt && controlAudit.verifiedBy && (
        <p className="text-xs text-gray-500">
          Verified by {controlAudit.verifiedBy} on{" "}
          {new Date(controlAudit.verifiedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
