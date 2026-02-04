"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { ControlStatusSelect } from "./control-status-select";

interface ControlDetailDialogProps {
  projectId: string;
  projectControl: {
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
  };
  children: React.ReactNode;
}

export function ControlDetailDialog({
  projectId,
  projectControl,
  children,
}: ControlDetailDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [description, setDescription] = useState(
    projectControl.implementationDescription || ""
  );
  const [referenceUrl, setReferenceUrl] = useState(
    projectControl.referenceUrl || ""
  );
  const [responsible, setResponsible] = useState(
    projectControl.responsiblePerson || ""
  );

  async function handleSave() {
    setIsSaving(true);
    try {
      await fetch(
        `/api/projects/${projectId}/controls/${projectControl.controlId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            implementationDescription: description || null,
            referenceUrl: referenceUrl || null,
            responsiblePerson: responsible || null,
          }),
        }
      );
      router.refresh();
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {projectControl.control.code}
            </Badge>
            <Badge variant="secondary">
              {projectControl.control.standard.shortName}
            </Badge>
          </div>
          <DialogTitle className="text-xl">
            {projectControl.control.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {projectControl.control.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                <ControlStatusSelect
                  projectId={projectId}
                  controlId={projectControl.controlId}
                  currentStatus={projectControl.implementationStatus}
                />
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor="responsible" className="text-sm font-medium">
                Responsible Person
              </Label>
              <Input
                id="responsible"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="e.g., John Smith"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Implementation Description
            </Label>
            <p className="text-xs text-gray-500 mb-1">
              Describe how this control is implemented in your organization
            </p>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your implementation approach..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="referenceUrl" className="text-sm font-medium">
              Reference Document
            </Label>
            <p className="text-xs text-gray-500 mb-1">
              Link to external documentation (e.g., Confluence, SharePoint, Google Docs)
            </p>
            <div className="flex gap-2">
              <Input
                id="referenceUrl"
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              {referenceUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
