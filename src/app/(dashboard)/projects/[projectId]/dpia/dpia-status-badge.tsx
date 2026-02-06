"use client";

import { Badge } from "@/components/ui/badge";

interface DPIAStatusBadgeProps {
  status: string;
}

export function DPIAStatusBadge({ status }: DPIAStatusBadgeProps) {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case "IN_REVIEW":
      return <Badge className="bg-blue-100 text-blue-800">In Review</Badge>;
    case "REQUIRES_CONSULTATION":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Requires FDPIC Consultation
        </Badge>
      );
    case "DRAFT":
    default:
      return <Badge variant="outline">Draft</Badge>;
  }
}
