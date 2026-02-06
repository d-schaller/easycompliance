"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCheck, Loader2 } from "lucide-react";

interface StartAuditButtonProps {
  projectId: string;
  disabled?: boolean;
}

export function StartAuditButton({ projectId, disabled }: StartAuditButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [auditorName, setAuditorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!auditorName.trim()) {
      setError("Auditor name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/audits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startedBy: auditorName }),
      });

      if (response.ok) {
        const audit = await response.json();
        setOpen(false);
        setAuditorName("");
        router.push(`/projects/${projectId}/audit/${audit.id}`);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to start audit");
      }
    } catch (err) {
      console.error("Error starting audit:", err);
      setError("Failed to start audit");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Start Audit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Start New Audit</DialogTitle>
            <DialogDescription>
              Begin an audit to verify the implementation status of all controls in this project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="auditorName">Auditor Name</Label>
              <Input
                id="auditorName"
                placeholder="Enter your name"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Audit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
