import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck } from "lucide-react";

export default async function StandardsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const standards = await prisma.standard.findMany({
    where: { isGlobal: true },
    include: {
      _count: {
        select: { controls: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Standards</h1>
        <p className="mt-2 text-gray-600">
          Browse available compliance frameworks and their controls
        </p>
      </div>

      {standards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileCheck className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No standards available</h3>
            <p className="mt-2 text-gray-500">
              Run the seed script to populate security standards
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {standards.map((standard) => (
            <Link key={standard.id} href={`/standards/${standard.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{standard.name}</CardTitle>
                    <Badge variant="outline">{standard.version}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {standard.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Controls</span>
                    <span className="font-medium">{standard._count.controls}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
