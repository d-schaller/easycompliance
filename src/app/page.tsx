import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">EasyCompliance</span>
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
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Simplify your{" "}
              <span className="text-blue-600">IT compliance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
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

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Everything you need for compliance management
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Built for teams who take security seriously
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-gray-50 p-6">
                <Shield className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold">
                  Multiple Standards
                </h3>
                <p className="mt-2 text-gray-600">
                  Support for ISO 27001, NIST CSF, SOC 2, and custom frameworks
                </p>
              </div>

              <div className="rounded-lg border bg-gray-50 p-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold">Track Progress</h3>
                <p className="mt-2 text-gray-600">
                  Monitor control implementation status across your organization
                </p>
              </div>

              <div className="rounded-lg border bg-gray-50 p-6">
                <FileCheck className="h-10 w-10 text-purple-600" />
                <h3 className="mt-4 text-lg font-semibold">
                  Evidence Management
                </h3>
                <p className="mt-2 text-gray-600">
                  Maintain documentation and evidence for each control
                </p>
              </div>

              <div className="rounded-lg border bg-gray-50 p-6">
                <Users className="h-10 w-10 text-orange-600" />
                <h3 className="mt-4 text-lg font-semibold">Team Collaboration</h3>
                <p className="mt-2 text-gray-600">
                  Assign controls to team members and track accountability
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-blue-600 px-8 py-16 text-center">
              <h2 className="text-3xl font-bold text-white">
                Ready to simplify compliance?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Get started in minutes with our pre-built control libraries
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white px-8 text-blue-600 hover:bg-gray-100"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">EasyCompliance</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EasyCompliance. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
