import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  coverSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
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
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  headerDate: {
    fontSize: 10,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#1a1a1a",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    marginRight: "2%",
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  summaryCardLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  summaryCardValue: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },
  summaryCardSubtext: {
    fontSize: 9,
    color: "#666",
    marginTop: 3,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  statusBreakdown: {
    marginTop: 15,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusLabel: {
    flex: 1,
    fontSize: 10,
  },
  statusCount: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginRight: 10,
  },
  statusPercent: {
    fontSize: 10,
    color: "#666",
    width: 40,
    textAlign: "right",
  },
  categoryHeader: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    padding: 8,
    marginTop: 15,
    marginBottom: 0,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 28,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#374151",
  },
  tableCell: {
    fontSize: 8,
    color: "#1f2937",
    paddingRight: 4,
  },
  colCode: {
    width: "10%",
  },
  colName: {
    width: "32%",
  },
  colStatus: {
    width: "15%",
  },
  colDescription: {
    width: "43%",
  },
  statusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 7,
    alignSelf: "flex-start",
  },
  statusImplemented: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusInProgress: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusPartial: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
  },
  statusNotStarted: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  statusNA: {
    backgroundColor: "#f3f4f6",
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
  executiveSummary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  executiveSummaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#1e3a5f",
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fefce8",
    borderRadius: 4,
    fontSize: 8,
    color: "#713f12",
  },
  controlName: {
    fontSize: 8,
    color: "#1f2937",
    lineHeight: 1.3,
  },
  controlDescription: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.3,
  },
});

interface ProjectControl {
  id: string;
  implementationStatus: string;
  implementationDescription: string | null;
  referenceUrl: string | null;
  responsiblePerson: string | null;
  control: {
    code: string;
    name: string;
    description: string;
    category: string | null;
    standard: {
      shortName: string;
      name: string;
    };
  };
}

interface ProjectReportProps {
  project: {
    name: string;
    description: string | null;
    status: string;
    createdAt: Date;
    organization: {
      name: string;
    };
  };
  controls: ProjectControl[];
  generatedAt: Date;
}

const STATUS_LABELS: Record<string, string> = {
  IMPLEMENTED: "Implemented",
  IN_PROGRESS: "In Progress",
  PARTIALLY_IMPLEMENTED: "Partial",
  NOT_STARTED: "Not Started",
  NOT_APPLICABLE: "N/A",
};

const STATUS_COLORS: Record<string, string> = {
  IMPLEMENTED: "#22c55e",
  IN_PROGRESS: "#3b82f6",
  PARTIALLY_IMPLEMENTED: "#eab308",
  NOT_STARTED: "#9ca3af",
  NOT_APPLICABLE: "#6b7280",
};

function getStatusStyle(status: string) {
  switch (status) {
    case "IMPLEMENTED":
      return styles.statusImplemented;
    case "IN_PROGRESS":
      return styles.statusInProgress;
    case "PARTIALLY_IMPLEMENTED":
      return styles.statusPartial;
    case "NOT_APPLICABLE":
      return styles.statusNA;
    default:
      return styles.statusNotStarted;
  }
}

function calculateStats(controls: ProjectControl[]) {
  const total = controls.length;
  const byStatus = {
    IMPLEMENTED: 0,
    IN_PROGRESS: 0,
    PARTIALLY_IMPLEMENTED: 0,
    NOT_STARTED: 0,
    NOT_APPLICABLE: 0,
  };

  controls.forEach((c) => {
    const status = c.implementationStatus as keyof typeof byStatus;
    if (status in byStatus) {
      byStatus[status]++;
    }
  });

  const applicableTotal = total - byStatus.NOT_APPLICABLE;
  const complianceRate =
    applicableTotal > 0
      ? Math.round((byStatus.IMPLEMENTED / applicableTotal) * 100)
      : 0;

  const progressRate =
    applicableTotal > 0
      ? Math.round(
          ((byStatus.IMPLEMENTED +
            byStatus.IN_PROGRESS +
            byStatus.PARTIALLY_IMPLEMENTED) /
            applicableTotal) *
            100
        )
      : 0;

  return { total, byStatus, applicableTotal, complianceRate, progressRate };
}

function groupControlsByCategory(controls: ProjectControl[]) {
  const grouped: Record<string, ProjectControl[]> = {};

  controls.forEach((control) => {
    const key = `${control.control.standard.shortName} - ${control.control.category || "General"}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(control);
  });

  // Sort controls within each group by code
  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => a.control.code.localeCompare(b.control.code));
  });

  return grouped;
}

// Truncate text to avoid overflow
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

export function ProjectReport({
  project,
  controls,
  generatedAt,
}: ProjectReportProps) {
  const stats = calculateStats(controls);
  const groupedControls = groupControlsByCategory(controls);
  const sortedCategories = Object.keys(groupedControls).sort();

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>Compliance Report</Text>
          <Text style={styles.coverSubtitle}>{project.name}</Text>
          <Text style={styles.coverMeta}>{project.organization.name}</Text>
          <Text style={styles.coverMeta}>
            Generated: {generatedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <Text style={styles.headerDate}>
            {generatedAt.toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Executive Summary</Text>

        <View style={styles.executiveSummary}>
          <Text style={styles.executiveSummaryText}>
            This report provides an overview of the compliance status for{" "}
            {project.name}. Out of {stats.total} total controls,{" "}
            {stats.byStatus.IMPLEMENTED} are fully implemented (
            {stats.complianceRate}% compliance rate).{" "}
            {stats.byStatus.IN_PROGRESS > 0 &&
              `${stats.byStatus.IN_PROGRESS} controls are currently in progress. `}
            {stats.byStatus.NOT_STARTED > 0 &&
              `${stats.byStatus.NOT_STARTED} controls have not yet been started. `}
            {stats.byStatus.NOT_APPLICABLE > 0 &&
              `${stats.byStatus.NOT_APPLICABLE} controls were marked as not applicable.`}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Compliance Rate</Text>
            <Text style={styles.summaryCardValue}>{stats.complianceRate}%</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${stats.complianceRate}%` },
                ]}
              />
            </View>
            <Text style={styles.summaryCardSubtext}>
              {stats.byStatus.IMPLEMENTED} of {stats.applicableTotal} applicable
              controls
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Total Controls</Text>
            <Text style={styles.summaryCardValue}>{stats.total}</Text>
            <Text style={styles.summaryCardSubtext}>
              Across {Object.keys(groupedControls).length} categories
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Work in Progress</Text>
            <Text style={styles.summaryCardValue}>
              {stats.byStatus.IN_PROGRESS + stats.byStatus.PARTIALLY_IMPLEMENTED}
            </Text>
            <Text style={styles.summaryCardSubtext}>
              Controls being implemented
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Requiring Action</Text>
            <Text style={styles.summaryCardValue}>
              {stats.byStatus.NOT_STARTED}
            </Text>
            <Text style={styles.summaryCardSubtext}>Controls not started</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Status Breakdown</Text>

        <View style={styles.statusBreakdown}>
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <View key={status} style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: STATUS_COLORS[status] },
                ]}
              />
              <Text style={styles.statusLabel}>{STATUS_LABELS[status]}</Text>
              <Text style={styles.statusCount}>{count}</Text>
              <Text style={styles.statusPercent}>
                {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text>
            This report was generated automatically and reflects the compliance
            status as of {generatedAt.toLocaleDateString()}. For official
            certification purposes, please consult with your compliance officer
            or auditor.
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

      {/* Detailed Control Report */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>Detailed Control Status</Text>
          <Text style={styles.headerDate}>
            {generatedAt.toLocaleDateString()}
          </Text>
        </View>

        {sortedCategories.map((category) => (
          <View key={category}>
            <View style={styles.categoryHeader} wrap={false}>
              <Text>{category} ({groupedControls[category].length} controls)</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader} fixed>
                <Text style={[styles.tableHeaderCell, styles.colCode]}>
                  Code
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colName]}>
                  Control Name
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colStatus]}>
                  Status
                </Text>
                <Text style={[styles.tableHeaderCell, styles.colDescription]}>
                  Implementation Notes
                </Text>
              </View>
              {groupedControls[category].map((control, idx) => (
                <View
                  key={control.id}
                  style={[
                    styles.tableRow,
                    idx % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                  wrap={false}
                >
                  <View style={styles.colCode}>
                    <Text style={styles.tableCell}>
                      {control.control.code}
                    </Text>
                  </View>
                  <View style={styles.colName}>
                    <Text style={styles.controlName}>
                      {truncateText(control.control.name, 60)}
                    </Text>
                  </View>
                  <View style={styles.colStatus}>
                    <Text
                      style={[
                        styles.statusBadge,
                        getStatusStyle(control.implementationStatus),
                      ]}
                    >
                      {STATUS_LABELS[control.implementationStatus] ||
                        control.implementationStatus}
                    </Text>
                  </View>
                  <View style={styles.colDescription}>
                    <Text style={styles.controlDescription}>
                      {control.implementationDescription
                        ? truncateText(control.implementationDescription, 100)
                        : "-"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

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
