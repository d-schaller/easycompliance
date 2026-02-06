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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";

interface CompleteAuditDialogProps {
  projectId: string;
  auditId: string;
  startedBy: string;
}

export function CompleteAuditDialog({
  projectId,
  auditId,
  startedBy,
}: CompleteAuditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [completedBy, setCompletedBy] = useState(startedBy);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!completedBy.trim()) {
      setError("Auditor name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/audits/${auditId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedBy,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to complete audit");
      }
    } catch (err) {
      console.error("Error completing audit:", err);
      setError("Failed to complete audit");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Audit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Complete Audit</DialogTitle>
            <DialogDescription>
              Mark this audit as complete. Once completed, the audit cannot be modified.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completedBy">Completed By</Label>
              <Input
                id="completedBy"
                placeholder="Enter your name"
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Audit Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any overall notes about this audit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
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
                  Completing...
                </>
              ) : (
                "Complete Audit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
