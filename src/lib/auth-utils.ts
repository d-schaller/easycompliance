import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export async function getUserOrganization(userId: string) {
  const userOrg = await prisma.userOrganization.findFirst({
    where: { userId },
    include: { organization: true },
  });
  return userOrg;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
      organization: null,
    };
  }

  const userOrg = await getUserOrganization(user.id);
  if (!userOrg) {
    return {
      error: NextResponse.json({ error: "No organization found" }, { status: 403 }),
      user: null,
      organization: null,
    };
  }

  return {
    error: null,
    user,
    organization: userOrg.organization,
    userOrg,
  };
}

export function hasPermission(
  role: string,
  requiredRole: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
): boolean {
  const roleHierarchy = {
    OWNER: 4,
    ADMIN: 3,
    MEMBER: 2,
    VIEWER: 1,
  };

  return (
    roleHierarchy[role as keyof typeof roleHierarchy] >=
    roleHierarchy[requiredRole]
  );
}

/**
 * Verifies that a project exists and belongs to the given organization.
 * Returns the project if found, or null if not found.
 */
export async function verifyProjectAccess(projectId: string, organizationId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
  });
  return project;
}

/**
 * Returns a 404 response for project not found.
 */
export function projectNotFoundResponse() {
  return NextResponse.json({ error: "Project not found" }, { status: 404 });
}

/**
 * Handles API errors consistently.
 * Returns appropriate error response based on error type.
 */
export function handleApiError(err: unknown, context: string) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid input data", details: err.issues },
      { status: 400 }
    );
  }

  console.error(`Error in ${context}:`, err);
  return NextResponse.json(
    { error: `Failed to ${context}` },
    { status: 500 }
  );
}
