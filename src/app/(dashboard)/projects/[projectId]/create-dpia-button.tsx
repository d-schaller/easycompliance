"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface CreateDPIAButtonProps {
  projectId: string;
}

export function CreateDPIAButton({ projectId }: CreateDPIAButtonProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    setIsCreating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/dpia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        router.push(`/projects/${projectId}/dpia/edit`);
        router.refresh();
      } else {
        const data = await response.json();
        console.error("Error creating DPIA:", data.error);
      }
    } catch (error) {
      console.error("Error creating DPIA:", error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create DPIA
        </>
      )}
    </Button>
  );
}
