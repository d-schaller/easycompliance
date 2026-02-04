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
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Standard {
  id: string;
  name: string;
  shortName: string;
  controls: {
    id: string;
    code: string;
    name: string;
    category: string | null;
  }[];
}

interface AddControlsDialogProps {
  projectId: string;
  standards: Standard[];
  existingControlIds: Set<string>;
}

export function AddControlsDialog({
  projectId,
  standards,
  existingControlIds,
}: AddControlsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const currentStandard = standards.find((s) => s.id === selectedStandard);
  const availableControls =
    currentStandard?.controls.filter((c) => !existingControlIds.has(c.id)) || [];

  const categories = [
    ...new Set(availableControls.map((c) => c.category).filter(Boolean)),
  ] as string[];

  // Filter controls by selected category
  const filteredControls =
    selectedCategory === "all"
      ? availableControls
      : availableControls.filter((c) => c.category === selectedCategory);

  // Check if all filtered controls are selected
  const allFilteredSelected =
    filteredControls.length > 0 &&
    filteredControls.every((c) => selectedControls.has(c.id));

  function handleSelectAll() {
    const newSelected = new Set(selectedControls);
    if (allFilteredSelected) {
      // Deselect all filtered controls
      filteredControls.forEach((c) => newSelected.delete(c.id));
    } else {
      // Select all filtered controls
      filteredControls.forEach((c) => newSelected.add(c.id));
    }
    setSelectedControls(newSelected);
  }

  function handleToggleControl(controlId: string) {
    const newSelected = new Set(selectedControls);
    if (newSelected.has(controlId)) {
      newSelected.delete(controlId);
    } else {
      newSelected.add(controlId);
    }
    setSelectedControls(newSelected);
  }

  function handleStandardChange(standardId: string) {
    setSelectedStandard(standardId);
    setSelectedCategory("all");
    setSelectedControls(new Set());
  }

  async function handleSubmit() {
    if (selectedControls.size === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ controlIds: Array.from(selectedControls) }),
      });

      if (response.ok) {
        setOpen(false);
        setSelectedControls(new Set());
        setSelectedStandard("");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Controls
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Controls to Project</DialogTitle>
          <DialogDescription>
            Select controls from a security standard to add to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Select value={selectedStandard} onValueChange={handleStandardChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a standard" />
            </SelectTrigger>
            <SelectContent>
              {standards.map((standard) => (
                <SelectItem key={standard.id} value={standard.id}>
                  {standard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentStandard && (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 flex-1">
                  {categories.length > 0 && (
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={filteredControls.length === 0}
                  >
                    {allFilteredSelected ? "Deselect All" : "Select All"}
                    {selectedCategory !== "all" && ` (${filteredControls.length})`}
                  </Button>
                </div>
                <Badge variant="secondary">
                  {selectedControls.size} selected
                </Badge>
              </div>

              <div className="flex-1 overflow-auto border rounded-md">
                {availableControls.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    All controls from this standard are already added to the
                    project.
                  </div>
                ) : filteredControls.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No controls match the selected filter.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredControls.map((control) => (
                      <label
                        key={control.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedControls.has(control.id)}
                          onCheckedChange={() => handleToggleControl(control.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">
                              {control.code}
                            </span>
                            {control.category && (
                              <Badge variant="outline" className="text-xs">
                                {control.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {control.name}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedControls.size === 0 || isLoading}
          >
            {isLoading
              ? "Adding..."
              : `Add ${selectedControls.size} Controls`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
