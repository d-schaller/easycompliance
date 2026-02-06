# EasyCompliance

A multi-tenant web application for managing IT security controls and compliance across different security standards (ISO 27001, NIST CSF, SOC 2, etc.).

## Quick Start

```bash
# Start PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with standards and controls
npm run db:seed

# Start development server
npm run dev
```

Access the application at http://localhost:3000

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js (Auth.js)

## Project Structure

```
easycompliance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── projects/       # Project management
│   │   │   ├── controls/       # Control library
│   │   │   ├── standards/      # Security standards
│   │   │   └── settings/       # Organization settings
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth endpoints
│   │   │   ├── projects/       # Project CRUD
│   │   │   ├── controls/       # Controls listing
│   │   │   └── standards/      # Standards listing
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components (sidebar, header)
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── auth-utils.ts       # Auth helper functions
│   │   ├── utils.ts            # General utilities
│   │   └── validations/        # Zod schemas
│   └── types/                  # TypeScript type definitions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed/                   # Seed data
│       ├── iso27001.json       # ISO 27001:2022 controls
│       ├── nist-csf.json       # NIST CSF 2.0 controls
│       └── seed.ts             # Seed script
├── docker-compose.yml          # Local PostgreSQL
└── .env.local                  # Local environment variables
```

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes (dev)
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Database Schema

### Core Models

- **User**: Application users with email/password or OAuth
- **Organization**: Multi-tenant organizations
- **UserOrganization**: User-org membership with roles (OWNER, ADMIN, MEMBER, VIEWER)
- **Standard**: Security standards (ISO 27001, NIST CSF)
- **Control**: Individual controls within a standard
- **Project**: Compliance projects belonging to an organization
- **ProjectControl**: Controls assigned to a project with implementation status (Technical Measures)
- **OrganizationalMeasure**: Custom organizational measures (policies, training, procedures) for a project
- **DPIA**: Data Protection Impact Assessment for a project (Swiss FADP Art. 22 compliant)
- **Audit**: Audit record for verifying control implementation status
- **ControlAudit**: Individual control verification records within an audit

### Key Relationships

- Users belong to Organizations via UserOrganization (many-to-many with roles)
- Organizations have many Projects
- Standards have many Controls
- Projects have many ProjectControls (Technical Measures from standards)
- Projects have many OrganizationalMeasures (custom policies, training, procedures)
- Projects have one optional DPIA
- Projects have many Audits (each audit has ControlAudits for each control)

## Authentication

- Email/password authentication with bcrypt hashing
- Optional OAuth with Google and GitHub
- JWT session strategy
- Middleware protection for dashboard routes

## API Routes

All API routes require authentication.

### Projects
- `GET /api/projects` - List organization's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project with controls
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Project Controls
- `GET /api/projects/[id]/controls` - List project controls
- `POST /api/projects/[id]/controls` - Add controls to project
- `PATCH /api/projects/[id]/controls/[controlId]` - Update control status
- `DELETE /api/projects/[id]/controls/[controlId]` - Remove control

### Standards
- `GET /api/standards` - List all standards
- `GET /api/standards/[id]` - Get standard with controls

### Controls
- `GET /api/controls` - List/search controls (with filters)

### DPIA (Data Protection Impact Assessment)
- `GET /api/projects/[id]/dpia` - Get project's DPIA
- `POST /api/projects/[id]/dpia` - Create DPIA for project
- `PATCH /api/projects/[id]/dpia` - Update DPIA
- `DELETE /api/projects/[id]/dpia` - Delete DPIA
- `GET /api/projects/[id]/dpia/report` - Download DPIA as PDF

### Organizational Measures
- `GET /api/projects/[id]/organizational-measures` - List project's organizational measures
- `POST /api/projects/[id]/organizational-measures` - Create organizational measure
- `PATCH /api/projects/[id]/organizational-measures/[measureId]` - Update measure
- `DELETE /api/projects/[id]/organizational-measures/[measureId]` - Delete measure

### Audits
- `GET /api/projects/[id]/audits` - List project's audits
- `POST /api/projects/[id]/audits` - Start new audit (creates ControlAudit for each project control)
- `GET /api/projects/[id]/audits/[auditId]` - Get audit with control audits
- `PATCH /api/projects/[id]/audits/[auditId]` - Complete audit
- `DELETE /api/projects/[id]/audits/[auditId]` - Delete audit
- `PATCH /api/projects/[id]/audits/[auditId]/controls/[controlAuditId]` - Update control verification status

## Environment Variables

Required variables in `.env.local`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Adding New Security Standards

1. Create a JSON file in `prisma/seed/` with the standard and controls
2. Import and add to `prisma/seed/seed.ts`
3. Run `npm run db:seed`

JSON format:
```json
{
  "standard": {
    "name": "Standard Name",
    "shortName": "SHORT",
    "version": "1.0",
    "description": "Description"
  },
  "controls": [
    {
      "code": "1.1",
      "name": "Control Name",
      "description": "Control description",
      "category": "Category",
      "subcategory": "Subcategory"
    }
  ]
}
```

## Implementation Status Values

- `NOT_STARTED` - Control not yet addressed
- `IN_PROGRESS` - Currently being implemented
- `PARTIALLY_IMPLEMENTED` - Some aspects implemented
- `IMPLEMENTED` - Fully implemented
- `NOT_APPLICABLE` - Not relevant to organization

## Authorization

Role hierarchy for organization access:
- **OWNER** - Full access, can delete organization
- **ADMIN** - Can manage projects, users, settings
- **MEMBER** - Can create/edit projects and controls
- **VIEWER** - Read-only access

## Project Structure (Compliance View)

Each project has three main sections:

1. **DPIA (Data Protection Impact Assessment)**
   - Swiss FADP Art. 22 compliant assessment
   - Two-stage process: preliminary assessment + full assessment
   - Includes risk identification, data categories, legal basis
   - PDF report generation
   - FDPIC consultation tracking when required

2. **Organizational Measures**
   - Custom policies, training, and procedures
   - Categories: Policy & Governance, Training & Awareness, Process & Procedure, Access Control, Incident Response, Monitoring & Audit, Vendor Management, Documentation
   - Tracked separately from technical controls

3. **Technical Measures**
   - Security controls from standards (ISO 27001, NIST CSF, SOC 2)
   - Assigned from the control library
   - Implementation status tracking

4. **Audit**
   - Verify implementation status of controls
   - Track verification status: NOT_VERIFIED, VERIFIED, NEEDS_ATTENTION
   - Record auditor name and timestamps
   - Add notes per control and overall audit notes
   - Only one audit can be in progress at a time

## Development Notes

- All database queries are scoped to the user's organization
- Use `requireAuth()` helper for API route authentication
- Use `hasPermission()` to check role-based access
- The landing page is public; dashboard routes require auth
- Prisma client is a singleton to prevent connection exhaustion
- PDF generation uses @react-pdf/renderer
