"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  MinusCircle,
  AlertCircle,
} from "lucide-react";
import { ControlStatusSelect } from "./control-status-select";
import { ControlDetailDialog } from "./control-detail-dialog";

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "IMPLEMENTED":
      return (
        <CheckCircle2
          className="h-4 w-4 text-green-600"
          title="Implemented"
        />
      );
    case "IN_PROGRESS":
      return (
        <Clock
          className="h-4 w-4 text-blue-600"
          title="In Progress"
        />
      );
    case "PARTIALLY_IMPLEMENTED":
      return (
        <AlertCircle
          className="h-4 w-4 text-yellow-600"
          title="Partially Implemented"
        />
      );
    case "NOT_APPLICABLE":
      return (
        <MinusCircle
          className="h-4 w-4 text-gray-400"
          title="Not Applicable"
        />
      );
    case "NOT_STARTED":
    default:
      return (
        <Circle
          className="h-4 w-4 text-gray-300"
          title="Not Started"
        />
      );
  }
}

interface ProjectControlData {
  id: string;
  controlId: string;
  implementationStatus: string;
  implementationDescription: string | null;
  referenceUrl: string | null;
  responsiblePerson: string | null;
  control: {
    code: string;
    name: string;
    description: string;
    category: string | null;
    standard: {
      shortName: string;
    };
  };
}

interface ControlsTableProps {
  projectId: string;
  controls: ProjectControlData[];
}

export function ControlsTable({ projectId, controls }: ControlsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-20">Code</TableHead>
            <TableHead className="min-w-[200px] max-w-[300px]">Control</TableHead>
            <TableHead className="w-24">Standard</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controls.map((pc) => (
            <ControlDetailDialog
              key={pc.id}
              projectId={projectId}
              projectControl={pc}
            >
              <TableRow className="cursor-pointer hover:bg-gray-50">
                <TableCell className="pr-0">
                  <StatusIcon status={pc.implementationStatus} />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {pc.control.code}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div>
                    <p className="font-medium text-sm line-clamp-1">
                      {pc.control.name}
                    </p>
                    {pc.implementationDescription && (
                      <p className="text-xs text-green-600 line-clamp-1 mt-0.5">
                        {pc.implementationDescription}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {pc.control.standard.shortName}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <ControlStatusSelect
                    projectId={projectId}
                    controlId={pc.controlId}
                    currentStatus={pc.implementationStatus}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-1">
                    {pc.referenceUrl && (
                      <a
                        href={pc.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800"
                        title="View reference document"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {pc.implementationDescription && (
                      <FileText className="h-4 w-4 text-gray-400" title="Has implementation description" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </ControlDetailDialog>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
