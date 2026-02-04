import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

export default async function StandardDetailPage({
  params,
}: {
  params: Promise<{ standardId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { standardId } = await params;

  const standard = await prisma.standard.findFirst({
    where: {
      id: standardId,
      isGlobal: true,
    },
    include: {
      controls: {
        orderBy: { code: "asc" },
      },
    },
  });

  if (!standard) {
    notFound();
  }

  const categories = [...new Set(standard.controls.map((c) => c.category))];
  const controlsByCategory = categories.reduce((acc, category) => {
    acc[category || "Uncategorized"] = standard.controls.filter(
      (c) => c.category === category
    );
    return acc;
  }, {} as Record<string, typeof standard.controls>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/standards">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{standard.name}</h1>
            <Badge variant="outline">{standard.version}</Badge>
          </div>
          {standard.description && (
            <p className="mt-1 text-gray-600">{standard.description}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Controls</span>
              <span className="font-medium">{standard.controls.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Categories</span>
              <span className="font-medium">{categories.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category || "uncategorized"} variant="secondary">
                  {category || "Uncategorized"} (
                  {controlsByCategory[category || "Uncategorized"].length})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.entries(controlsByCategory).map(([category, controls]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>{controls.length} controls</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="font-mono text-sm">
                      {control.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {control.name}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm text-gray-500">
                        {control.description}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
