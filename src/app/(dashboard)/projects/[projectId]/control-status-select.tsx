"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ControlStatusSelectProps {
  projectId: string;
  controlId: string;
  currentStatus: string;
}

const statusOptions = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PARTIALLY_IMPLEMENTED", label: "Partially Implemented" },
  { value: "IMPLEMENTED", label: "Implemented" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
];

export function ControlStatusSelect({
  projectId,
  controlId,
  currentStatus,
}: ControlStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      await fetch(`/api/projects/${projectId}/controls/${controlId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ implementationStatus: newStatus }),
      });

      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-32 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
