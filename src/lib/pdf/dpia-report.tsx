import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  SENSITIVE_DATA_LABELS,
  DATA_CATEGORY_LABELS,
  LEGAL_BASIS_LABELS,
  RISK_LEVEL_LABELS,
  DPIA_STATUS_LABELS,
  type IdentifiedRisk,
} from "@/lib/validations/dpia";
import { MEASURE_CATEGORY_LABELS } from "@/lib/validations/organizational-measure";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  coverPage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  coverMeta: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  coverLegal: {
    fontSize: 10,
    color: "#888",
    marginTop: 40,
    textAlign: "center",
    fontStyle: "italic",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  headerDate: {
    fontSize: 9,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    marginTop: 16,
    color: "#1a1a1a",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#2563eb",
  },
  subsectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#374151",
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 8,
    color: "#1f2937",
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    marginBottom: 10,
    color: "#1f2937",
  },
  infoBox: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#d97706",
  },
  dangerBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#dc2626",
  },
  successBox: {
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#16a34a",
  },
  boxText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statusDraft: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },
  statusInReview: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusApproved: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusConsultation: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 9,
    alignSelf: "flex-start",
  },
  riskLow: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  riskMedium: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  riskHigh: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
    color: "#1f2937",
  },
  colRisk: { width: "40%" },
  colLikelihood: { width: "20%" },
  colImpact: { width: "20%" },
  colMitigated: { width: "20%" },
  // Control table columns
  colCode: { width: "15%" },
  colControlName: { width: "45%" },
  colStandard: { width: "20%" },
  colStatus: { width: "20%" },
  // Organizational measure columns
  colMeasureName: { width: "35%" },
  colCategory: { width: "20%" },
  colMeasureStatus: { width: "20%" },
  colResponsible: { width: "25%" },
  list: {
    marginLeft: 10,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 15,
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: "#1f2937",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  gridItem: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 8,
  },
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    marginTop: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    fontSize: 8,
    color: "#6b7280",
  },
});

interface ProjectControl {
  code: string;
  name: string;
  standardName: string;
  status: string;
}

interface OrganizationalMeasure {
  name: string;
  description: string | null;
  category: string | null;
  status: string;
}

interface DPIAReportProps {
  dpia: {
    id: string;
    status: string;
    processingDescription: string | null;
    dataCategories: string[] | null;
    sensitiveDataTypes: string[] | null;
    dataSubjects: string | null;
    estimatedDataSubjects: string | null;
    processingPurpose: string | null;
    legalBasis: string | null;
    technologyDescription: string | null;
    preliminaryRiskLevel: string | null;
    identifiedRisks: IdentifiedRisk[] | null;
    dataProtectionByDesign: string | null;
    residualRiskLevel: string | null;
    residualRiskJustification: string | null;
    requiresFDPICConsultation: boolean;
    dpoConsulted: boolean;
    dpoName: string | null;
    dpoOpinion: string | null;
    fdpicSubmissionDate: Date | null;
    assessorName: string | null;
    assessorRole: string | null;
    approvedBy: string | null;
    approvalDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  project: {
    name: string;
    description: string | null;
    organization: {
      name: string;
    };
  };
  controls: ProjectControl[];
  organizationalMeasures: OrganizationalMeasure[];
  generatedAt: Date;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return styles.statusApproved;
    case "IN_REVIEW":
      return styles.statusInReview;
    case "REQUIRES_CONSULTATION":
      return styles.statusConsultation;
    default:
      return styles.statusDraft;
  }
}

function getRiskStyle(level: string | null) {
  switch (level) {
    case "LOW":
      return styles.riskLow;
    case "MEDIUM":
      return styles.riskMedium;
    case "HIGH":
      return styles.riskHigh;
    default:
      return styles.riskLow;
  }
}

function getRiskBoxStyle(level: string | null) {
  switch (level) {
    case "LOW":
      return styles.successBox;
    case "MEDIUM":
      return styles.warningBox;
    case "HIGH":
      return styles.dangerBox;
    default:
      return styles.infoBox;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "IMPLEMENTED":
      return "Implemented";
    case "IN_PROGRESS":
      return "In Progress";
    case "NOT_STARTED":
      return "Not Started";
    case "NOT_APPLICABLE":
      return "N/A";
    case "PARTIALLY_IMPLEMENTED":
      return "Partial";
    default:
      return status;
  }
}

export function DPIAReport({ dpia, project, controls, organizationalMeasures, generatedAt }: DPIAReportProps) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>
            Data Protection Impact Assessment
          </Text>
          <Text style={styles.coverSubtitle}>
            Datenschutz-Folgenabschätzung (DSFA)
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20, fontFamily: "Helvetica-Bold" }}>
            {project.name}
          </Text>
          <Text style={styles.coverMeta}>{project.organization.name}</Text>
          <Text style={styles.coverMeta}>
            Generated: {generatedAt.toLocaleDateString("en-CH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.coverMeta, { marginTop: 20 }]}>
            Status: {DPIA_STATUS_LABELS[dpia.status] || dpia.status}
          </Text>
          <Text style={styles.coverLegal}>
            In accordance with Art. 22 Swiss Federal Act on Data Protection (FADP)
          </Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>1. Executive Summary</Text>

        <Text style={[styles.statusBadge, getStatusStyle(dpia.status)]}>
          {DPIA_STATUS_LABELS[dpia.status] || dpia.status}
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Preliminary Risk Level</Text>
            <Text style={[styles.riskBadge, getRiskStyle(dpia.preliminaryRiskLevel)]}>
              {dpia.preliminaryRiskLevel
                ? RISK_LEVEL_LABELS[dpia.preliminaryRiskLevel]
                : "Not assessed"}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Residual Risk Level</Text>
            <Text style={[styles.riskBadge, getRiskStyle(dpia.residualRiskLevel)]}>
              {dpia.residualRiskLevel
                ? RISK_LEVEL_LABELS[dpia.residualRiskLevel]
                : "Not assessed"}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>DPO Consulted</Text>
            <Text style={styles.value}>{dpia.dpoConsulted ? "Yes" : "No"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>FDPIC Consultation Required</Text>
            <Text style={styles.value}>
              {dpia.requiresFDPICConsultation ? "Yes" : "No"}
            </Text>
          </View>
        </View>

        {dpia.requiresFDPICConsultation && (
          <View style={styles.warningBox}>
            <Text style={styles.boxText}>
              This DPIA indicates a high residual risk. Consultation with the Federal
              Data Protection and Information Commissioner (FDPIC) is required under
              Art. 23 FADP before proceeding with the data processing.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>2. Processing Description</Text>

        <Text style={styles.label}>Description of Processing Activities</Text>
        <Text style={styles.paragraph}>
          {dpia.processingDescription || "Not provided"}
        </Text>

        <Text style={styles.label}>Purpose of Processing</Text>
        <Text style={styles.paragraph}>
          {dpia.processingPurpose || "Not provided"}
        </Text>

        <Text style={styles.label}>Technology Description</Text>
        <Text style={styles.paragraph}>
          {dpia.technologyDescription || "Not provided"}
        </Text>

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Data Categories & Subjects */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>3. Data Categories</Text>

        <Text style={styles.subsectionTitle}>Personal Data Categories</Text>
        {dpia.dataCategories && dpia.dataCategories.length > 0 ? (
          <View style={styles.list}>
            {dpia.dataCategories.map((cat, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  {DATA_CATEGORY_LABELS[cat] || cat}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>No data categories specified</Text>
        )}

        <Text style={styles.subsectionTitle}>
          Sensitive Personal Data (Art. 5 FADP)
        </Text>
        {dpia.sensitiveDataTypes && dpia.sensitiveDataTypes.length > 0 ? (
          <View style={styles.list}>
            {dpia.sensitiveDataTypes.map((type, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  {SENSITIVE_DATA_LABELS[type] || type}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>
            No sensitive personal data categories identified
          </Text>
        )}

        <Text style={styles.sectionTitle}>4. Data Subjects</Text>

        <Text style={styles.label}>Categories of Data Subjects</Text>
        <Text style={styles.paragraph}>
          {dpia.dataSubjects || "Not specified"}
        </Text>

        <Text style={styles.label}>Estimated Number of Data Subjects</Text>
        <Text style={styles.paragraph}>
          {dpia.estimatedDataSubjects || "Not specified"}
        </Text>

        <Text style={styles.sectionTitle}>5. Legal Basis</Text>
        <Text style={styles.paragraph}>
          {dpia.legalBasis
            ? LEGAL_BASIS_LABELS[dpia.legalBasis] || dpia.legalBasis
            : "Not specified"}
        </Text>

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Risk Assessment */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>6. Risk Assessment</Text>

        <Text style={styles.subsectionTitle}>Preliminary Risk Evaluation</Text>
        <View style={getRiskBoxStyle(dpia.preliminaryRiskLevel)}>
          <Text style={styles.boxText}>
            Preliminary Risk Level:{" "}
            {dpia.preliminaryRiskLevel
              ? RISK_LEVEL_LABELS[dpia.preliminaryRiskLevel]
              : "Not assessed"}
          </Text>
        </View>

        <Text style={styles.subsectionTitle}>Identified Risks</Text>
        {dpia.identifiedRisks && dpia.identifiedRisks.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colRisk]}>Risk</Text>
              <Text style={[styles.tableHeaderCell, styles.colLikelihood]}>
                Likelihood
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colImpact]}>Impact</Text>
              <Text style={[styles.tableHeaderCell, styles.colMitigated]}>
                Mitigated
              </Text>
            </View>
            {dpia.identifiedRisks.map((risk, idx) => (
              <View
                key={idx}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <Text style={[styles.tableCell, styles.colRisk]}>
                  {risk.description}
                </Text>
                <Text style={[styles.tableCell, styles.colLikelihood]}>
                  {RISK_LEVEL_LABELS[risk.likelihood]}
                </Text>
                <Text style={[styles.tableCell, styles.colImpact]}>
                  {RISK_LEVEL_LABELS[risk.impact]}
                </Text>
                <Text style={[styles.tableCell, styles.colMitigated]}>
                  {risk.mitigated ? "Yes" : "No"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>No risks identified</Text>
        )}

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Protective Measures */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>7. Protective Measures</Text>

        <Text style={styles.subsectionTitle}>Technical Measures (Security Controls)</Text>
        {controls.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colCode]}>Code</Text>
              <Text style={[styles.tableHeaderCell, styles.colControlName]}>Control</Text>
              <Text style={[styles.tableHeaderCell, styles.colStandard]}>Standard</Text>
              <Text style={[styles.tableHeaderCell, styles.colStatus]}>Status</Text>
            </View>
            {controls.map((control, idx) => (
              <View
                key={idx}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <Text style={[styles.tableCell, styles.colCode]}>{control.code}</Text>
                <Text style={[styles.tableCell, styles.colControlName]}>{control.name}</Text>
                <Text style={[styles.tableCell, styles.colStandard]}>{control.standardName}</Text>
                <Text style={[styles.tableCell, styles.colStatus]}>{getStatusLabel(control.status)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>No security controls assigned to this project</Text>
        )}

        <Text style={styles.subsectionTitle}>Organizational Measures</Text>
        {organizationalMeasures.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colMeasureName]}>Measure</Text>
              <Text style={[styles.tableHeaderCell, styles.colCategory]}>Category</Text>
              <Text style={[styles.tableHeaderCell, styles.colMeasureStatus]}>Status</Text>
            </View>
            {organizationalMeasures.map((measure, idx) => (
              <View
                key={idx}
                style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              >
                <Text style={[styles.tableCell, styles.colMeasureName]}>{measure.name}</Text>
                <Text style={[styles.tableCell, styles.colCategory]}>
                  {measure.category ? MEASURE_CATEGORY_LABELS[measure.category] || measure.category : "-"}
                </Text>
                <Text style={[styles.tableCell, styles.colMeasureStatus]}>{getStatusLabel(measure.status)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.paragraph}>No organizational measures defined</Text>
        )}

        <Text style={styles.subsectionTitle}>Data Protection by Design</Text>
        <Text style={styles.paragraph}>
          {dpia.dataProtectionByDesign || "Not specified"}
        </Text>

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Residual Risk */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>8. Residual Risk Evaluation</Text>

        <View style={getRiskBoxStyle(dpia.residualRiskLevel)}>
          <Text style={styles.boxText}>
            Residual Risk Level:{" "}
            {dpia.residualRiskLevel
              ? RISK_LEVEL_LABELS[dpia.residualRiskLevel]
              : "Not assessed"}
          </Text>
        </View>

        <Text style={styles.label}>Justification</Text>
        <Text style={styles.paragraph}>
          {dpia.residualRiskJustification || "Not provided"}
        </Text>

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Consultation & Approval */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>DPIA - {project.name}</Text>
          <Text style={styles.headerDate}>{generatedAt.toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>9. Consultation</Text>

        <Text style={styles.subsectionTitle}>Data Protection Officer (DPO)</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>DPO Consulted</Text>
            <Text style={styles.value}>{dpia.dpoConsulted ? "Yes" : "No"}</Text>
          </View>
          {dpia.dpoConsulted && dpia.dpoName && (
            <View style={styles.gridItem}>
              <Text style={styles.label}>DPO Name</Text>
              <Text style={styles.value}>{dpia.dpoName}</Text>
            </View>
          )}
        </View>

        {dpia.dpoOpinion && (
          <>
            <Text style={styles.label}>DPO Opinion</Text>
            <View style={styles.infoBox}>
              <Text style={styles.boxText}>{dpia.dpoOpinion}</Text>
            </View>
          </>
        )}

        <Text style={styles.subsectionTitle}>
          FDPIC Consultation (Art. 23 FADP)
        </Text>
        {dpia.requiresFDPICConsultation ? (
          <View style={styles.warningBox}>
            <Text style={styles.boxText}>
              Consultation with the Federal Data Protection and Information
              Commissioner (FDPIC) is required.
              {dpia.fdpicSubmissionDate &&
                ` Submission date: ${new Date(dpia.fdpicSubmissionDate).toLocaleDateString("en-CH")}`}
            </Text>
          </View>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.boxText}>
              FDPIC consultation is not required based on the risk assessment.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>10. Assessment Details</Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Assessor Name</Text>
            <Text style={styles.value}>{dpia.assessorName || "Not specified"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Assessor Role</Text>
            <Text style={styles.value}>{dpia.assessorRole || "Not specified"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Assessment Date</Text>
            <Text style={styles.value}>
              {new Date(dpia.createdAt).toLocaleDateString("en-CH")}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>
              {new Date(dpia.updatedAt).toLocaleDateString("en-CH")}
            </Text>
          </View>
        </View>

        {dpia.status === "APPROVED" && (
          <>
            <Text style={styles.subsectionTitle}>Approval</Text>
            <View style={styles.successBox}>
              <Text style={styles.boxText}>
                This DPIA has been approved
                {dpia.approvedBy && ` by ${dpia.approvedBy}`}
                {dpia.approvalDate &&
                  ` on ${new Date(dpia.approvalDate).toLocaleDateString("en-CH")}`}
                .
              </Text>
            </View>
          </>
        )}

        <View style={styles.signatureSection}>
          <Text style={styles.subsectionTitle}>Signatures</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Assessor</Text>
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Approving Authority</Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text>
            This Data Protection Impact Assessment was prepared in accordance with
            Art. 22 of the Swiss Federal Act on Data Protection (FADP). It should be
            reviewed and updated whenever there are significant changes to the
            processing activities or when new risks are identified.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>{project.organization.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
