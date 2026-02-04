"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";

interface Standard {
  id: string;
  name: string;
  shortName: string;
}

interface ControlsFilterProps {
  standards: Standard[];
  selectedStandardId?: string;
  searchQuery?: string;
}

export function ControlsFilter({
  standards,
  selectedStandardId,
  searchQuery,
}: ControlsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery || "");

  const updateFilters = useCallback(
    (updates: { standardId?: string | null; search?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.standardId !== undefined) {
        if (updates.standardId) {
          params.set("standardId", updates.standardId);
        } else {
          params.delete("standardId");
        }
      }

      if (updates.search !== undefined) {
        if (updates.search) {
          params.set("search", updates.search);
        } else {
          params.delete("search");
        }
      }

      router.push(`/controls?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters({ search: search || null });
  }

  function handleClearFilters() {
    setSearch("");
    router.push("/controls");
  }

  const hasFilters = selectedStandardId || searchQuery;

  return (
    <div className="flex flex-wrap gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search controls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <Select
        value={selectedStandardId || "all"}
        onValueChange={(value) =>
          updateFilters({ standardId: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Standards" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Standards</SelectItem>
          {standards.map((standard) => (
            <SelectItem key={standard.id} value={standard.id}>
              {standard.shortName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" onClick={handleClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
