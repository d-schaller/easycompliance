import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield } from "lucide-react";
import { ControlsFilter } from "./controls-filter";

export default async function ControlsPage({
  searchParams,
}: {
  searchParams: Promise<{ standardId?: string; search?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { standardId, search } = await searchParams;

  const standards = await prisma.standard.findMany({
    where: { isGlobal: true },
    orderBy: { name: "asc" },
  });

  const where: Record<string, unknown> = {};

  if (standardId) {
    where.standardId = standardId;
  }

  if (search) {
    where.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const controls = await prisma.control.findMany({
    where,
    include: {
      standard: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
    },
    orderBy: [{ standard: { name: "asc" } }, { code: "asc" }],
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Controls Library</h1>
        <p className="mt-2 text-gray-600">
          Browse and search security controls across all standards
        </p>
      </div>

      <ControlsFilter
        standards={standards}
        selectedStandardId={standardId}
        searchQuery={search}
      />

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>
            {controls.length} controls found
            {controls.length === 100 && " (showing first 100)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {controls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No controls found</h3>
              <p className="mt-2 text-gray-500">
                {search
                  ? "Try adjusting your search query"
                  : "Run the seed script to populate controls"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-32">Standard</TableHead>
                  <TableHead className="w-40">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="font-mono text-sm">
                      {control.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{control.name}</p>
                        <p className="line-clamp-1 text-sm text-gray-500">
                          {control.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {control.standard.shortName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {control.category || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
