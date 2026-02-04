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
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userOrg = await prisma.userOrganization.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userOrg) {
    redirect("/register");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and organization settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1">{session.user.name || "Not set"}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{session.user.email}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="mt-1 font-mono text-sm text-gray-500">
                {session.user.id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Organization Name
              </label>
              <p className="mt-1">{userOrg.organization.name}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-gray-500">Slug</label>
              <p className="mt-1 font-mono text-sm">
                {userOrg.organization.slug}
              </p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-gray-500">Your Role</label>
              <div className="mt-1">
                <Badge>{userOrg.role}</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created
              </label>
              <p className="mt-1">
                {new Date(userOrg.organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              People in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {userOrg.organization.users.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium">
                      {member.user.name || member.user.email}
                    </p>
                    {member.user.name && (
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "OWNER" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                    {member.userId === session.user.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
