import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">EasyCompliance</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Simplify your{" "}
              <span className="text-primary">IT compliance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Manage security controls across ISO 27001, NIST CSF, SOC 2, and
              more. Track implementation progress, maintain evidence, and
              demonstrate compliance with confidence.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Everything you need for compliance management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built for teams who take security seriously
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Multiple Standards
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Support for ISO 27001, NIST CSF, SOC 2, and custom frameworks
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Track Progress</h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor control implementation status across your organization
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <FileCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Evidence Management
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Maintain documentation and evidence for each control
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Team Collaboration</h3>
                <p className="mt-2 text-muted-foreground">
                  Assign controls to team members and track accountability
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-16 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Ready to simplify compliance?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Get started in minutes with our pre-built control libraries
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white px-8 text-primary hover:bg-white/90"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">EasyCompliance</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EasyCompliance. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
