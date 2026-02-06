"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Settings, Trash2 } from "lucide-react";
import {
  MEASURE_CATEGORIES,
  MEASURE_CATEGORY_LABELS,
  IMPLEMENTATION_STATUS_OPTIONS,
  type MeasureCategory,
} from "@/lib/constants";

interface OrganizationalMeasure {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  status: string;
  responsiblePerson: string | null;
}

interface OrganizationalMeasuresSectionProps {
  projectId: string;
  measures: OrganizationalMeasure[];
}

function getStatusBadge(status: string) {
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

export function OrganizationalMeasuresSection({
  projectId,
  measures,
}: OrganizationalMeasuresSectionProps) {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMeasure, setSelectedMeasure] = useState<OrganizationalMeasure | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    responsiblePerson: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "",
    responsiblePerson: "",
  });

  async function handleAdd() {
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/organizational-measures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description || undefined,
            category: formData.category || undefined,
            responsiblePerson: formData.responsiblePerson || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add measure");
      }

      setFormData({ name: "", description: "", category: "", responsiblePerson: "" });
      setIsAddDialogOpen(false);
      toast.success("Measure added");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add measure");
    } finally {
      setIsLoading(false);
    }
  }

  function openEditDialog(measure: OrganizationalMeasure) {
    setSelectedMeasure(measure);
    setEditFormData({
      name: measure.name,
      description: measure.description || "",
      category: measure.category || "",
      status: measure.status,
      responsiblePerson: measure.responsiblePerson || "",
    });
    setIsEditDialogOpen(true);
  }

  async function handleUpdate() {
    if (!selectedMeasure || !editFormData.name.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/organizational-measures/${selectedMeasure.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editFormData.name,
            description: editFormData.description || null,
            category: editFormData.category || null,
            status: editFormData.status,
            responsiblePerson: editFormData.responsiblePerson || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update measure");
      }

      setIsEditDialogOpen(false);
      setSelectedMeasure(null);
      toast.success("Measure updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update measure");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(measureId: string) {
    if (!confirm("Are you sure you want to delete this measure?")) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/organizational-measures/${measureId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete measure");
      }

      toast.success("Measure deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete measure");
    }
  }

  const stats = {
    total: measures.length,
    implemented: measures.filter((m) => m.status === "IMPLEMENTED").length,
    inProgress: measures.filter((m) => m.status === "IN_PROGRESS").length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Organizational Measures</CardTitle>
              <CardDescription>
                Policies, training, and procedures for data protection
              </CardDescription>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Measure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Organizational Measure</DialogTitle>
                <DialogDescription>
                  Add a new policy, training, or procedure to this project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Data Protection Training"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MEASURE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {MEASURE_CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the measure..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="responsible">Responsible Person</Label>
                  <Input
                    id="responsible"
                    value={formData.responsiblePerson}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        responsiblePerson: e.target.value,
                      }))
                    }
                    placeholder="e.g., HR Manager"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={isLoading || !formData.name.trim()}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add Measure"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {measures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Settings className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No measures added</h3>
            <p className="mt-2 text-gray-500">
              Add organizational measures like policies, training, and procedures
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                <strong>{stats.implemented}</strong> implemented
              </span>
              <span>
                <strong>{stats.inProgress}</strong> in progress
              </span>
              <span>
                <strong>{stats.total}</strong> total
              </span>
            </div>
            <div className="space-y-2">
              {measures.map((measure) => (
                <div
                  key={measure.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => openEditDialog(measure)}
                >
                  <div className="flex items-center gap-3">
                    {measure.category && (
                      <Badge variant="outline" className="text-xs">
                        {MEASURE_CATEGORY_LABELS[measure.category as MeasureCategory] ||
                          measure.category}
                      </Badge>
                    )}
                    <div>
                      <p className="font-medium">{measure.name}</p>
                      {measure.responsiblePerson && (
                        <p className="text-xs text-gray-500">
                          {measure.responsiblePerson}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(measure.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(measure.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organizational Measure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {MEASURE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {MEASURE_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPLEMENTATION_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-responsible">Responsible Person</Label>
              <Input
                id="edit-responsible"
                value={editFormData.responsiblePerson}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    responsiblePerson: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isLoading || !editFormData.name.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
