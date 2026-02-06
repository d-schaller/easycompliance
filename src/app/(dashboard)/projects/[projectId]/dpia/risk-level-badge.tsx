"use client";

import { Badge } from "@/components/ui/badge";

interface RiskLevelBadgeProps {
  level: string | null;
}

export function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  switch (level) {
    case "LOW":
      return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    case "MEDIUM":
      return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    case "HIGH":
      return <Badge className="bg-red-100 text-red-800">High</Badge>;
    default:
      return <Badge variant="outline">Not Assessed</Badge>;
  }
}
