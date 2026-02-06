"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, Trash2, Save, Info } from "lucide-react";
import {
  DATA_CATEGORIES,
  DATA_CATEGORY_LABELS,
  SENSITIVE_DATA_TYPES,
  SENSITIVE_DATA_LABELS,
  LEGAL_BASIS_OPTIONS,
  LEGAL_BASIS_LABELS,
  DPIA_STATUS_LABELS,
  type IdentifiedRisk,
} from "@/lib/validations/dpia";

interface DPIAFormData {
  status: string;
  processingDescription: string;
  dataCategories: string[];
  sensitiveDataTypes: string[];
  dataSubjects: string;
  estimatedDataSubjects: string;
  processingPurpose: string;
  legalBasis: string;
  technologyDescription: string;
  preliminaryRiskLevel: string;
  identifiedRisks: IdentifiedRisk[];
  dataProtectionByDesign: string;
  residualRiskLevel: string;
  residualRiskJustification: string;
  requiresFDPICConsultation: boolean;
  dpoConsulted: boolean;
  dpoName: string;
  dpoOpinion: string;
  assessorName: string;
  assessorRole: string;
}

export default function EditDPIAPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<DPIAFormData>({
    status: "DRAFT",
    processingDescription: "",
    dataCategories: [],
    sensitiveDataTypes: [],
    dataSubjects: "",
    estimatedDataSubjects: "",
    processingPurpose: "",
    legalBasis: "",
    technologyDescription: "",
    preliminaryRiskLevel: "",
    identifiedRisks: [],
    dataProtectionByDesign: "",
    residualRiskLevel: "",
    residualRiskJustification: "",
    requiresFDPICConsultation: false,
    dpoConsulted: false,
    dpoName: "",
    dpoOpinion: "",
    assessorName: "",
    assessorRole: "",
  });

  useEffect(() => {
    async function fetchDPIA() {
      try {
        const response = await fetch(`/api/projects/${projectId}/dpia`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            status: data.status || "DRAFT",
            processingDescription: data.processingDescription || "",
            dataCategories: data.dataCategories || [],
            sensitiveDataTypes: data.sensitiveDataTypes || [],
            dataSubjects: data.dataSubjects || "",
            estimatedDataSubjects: data.estimatedDataSubjects || "",
            processingPurpose: data.processingPurpose || "",
            legalBasis: data.legalBasis || "",
            technologyDescription: data.technologyDescription || "",
            preliminaryRiskLevel: data.preliminaryRiskLevel || "",
            identifiedRisks: data.identifiedRisks || [],
            dataProtectionByDesign: data.dataProtectionByDesign || "",
            residualRiskLevel: data.residualRiskLevel || "",
            residualRiskJustification: data.residualRiskJustification || "",
            requiresFDPICConsultation: data.requiresFDPICConsultation || false,
            dpoConsulted: data.dpoConsulted || false,
            dpoName: data.dpoName || "",
            dpoOpinion: data.dpoOpinion || "",
            assessorName: data.assessorName || "",
            assessorRole: data.assessorRole || "",
          });
        }
      } catch (err) {
        console.error("Error fetching DPIA:", err);
        setError("Failed to load DPIA data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDPIA();
  }, [projectId]);

  async function handleSave() {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/dpia`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dataCategories: formData.dataCategories.length > 0 ? formData.dataCategories : null,
          sensitiveDataTypes: formData.sensitiveDataTypes.length > 0 ? formData.sensitiveDataTypes : null,
          identifiedRisks: formData.identifiedRisks.length > 0 ? formData.identifiedRisks : null,
          preliminaryRiskLevel: formData.preliminaryRiskLevel || null,
          residualRiskLevel: formData.residualRiskLevel || null,
          legalBasis: formData.legalBasis || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save DPIA");
      }

      router.push(`/projects/${projectId}/dpia`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save DPIA");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleDataCategory(category: string) {
    setFormData((prev) => ({
      ...prev,
      dataCategories: prev.dataCategories.includes(category)
        ? prev.dataCategories.filter((c) => c !== category)
        : [...prev.dataCategories, category],
    }));
  }

  function toggleSensitiveDataType(type: string) {
    setFormData((prev) => ({
      ...prev,
      sensitiveDataTypes: prev.sensitiveDataTypes.includes(type)
        ? prev.sensitiveDataTypes.filter((t) => t !== type)
        : [...prev.sensitiveDataTypes, type],
    }));
  }

  function addRisk() {
    setFormData((prev) => ({
      ...prev,
      identifiedRisks: [
        ...prev.identifiedRisks,
        { description: "", likelihood: "MEDIUM", impact: "MEDIUM", mitigated: false },
      ],
    }));
  }

  function updateRisk(index: number, field: keyof IdentifiedRisk, value: string | boolean) {
    setFormData((prev) => ({
      ...prev,
      identifiedRisks: prev.identifiedRisks.map((risk, i) =>
        i === index ? { ...risk, [field]: value } : risk
      ),
    }));
  }

  function removeRisk(index: number) {
    setFormData((prev) => ({
      ...prev,
      identifiedRisks: prev.identifiedRisks.filter((_, i) => i !== index),
    }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}/dpia`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit DPIA</h1>
          <p className="mt-1 text-gray-600">
            Data Protection Impact Assessment - Art. 22 Swiss FADP
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-64">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DPIA_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stage 1: Processing Description */}
      <Card>
        <CardHeader>
          <CardTitle>1. Processing Description</CardTitle>
          <CardDescription>
            Describe the planned data processing activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="processingDescription">
              Description of Processing Activities
            </Label>
            <Textarea
              id="processingDescription"
              value={formData.processingDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  processingDescription: e.target.value,
                }))
              }
              placeholder="Describe what personal data will be processed and how..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="processingPurpose">Purpose of Processing</Label>
            <Textarea
              id="processingPurpose"
              value={formData.processingPurpose}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  processingPurpose: e.target.value,
                }))
              }
              placeholder="Explain why this data processing is necessary..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="technologyDescription">Technology Description</Label>
            <Textarea
              id="technologyDescription"
              value={formData.technologyDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  technologyDescription: e.target.value,
                }))
              }
              placeholder="Describe the technology and systems used for processing..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage 1: Data Categories */}
      <Card>
        <CardHeader>
          <CardTitle>2. Data Categories</CardTitle>
          <CardDescription>
            Select the types of personal data that will be processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Personal Data Categories</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {DATA_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={formData.dataCategories.includes(category)}
                    onCheckedChange={() => toggleDataCategory(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {DATA_CATEGORY_LABELS[category]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">
              Sensitive Personal Data (Art. 5 FADP)
            </Label>
            <p className="text-sm text-gray-500 mb-3">
              Select if any of these particularly sensitive categories are processed
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SENSITIVE_DATA_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.sensitiveDataTypes.includes(type)}
                    onCheckedChange={() => toggleSensitiveDataType(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {SENSITIVE_DATA_LABELS[type]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage 1: Data Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>3. Data Subjects</CardTitle>
          <CardDescription>
            Describe the individuals whose data will be processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataSubjects">Categories of Data Subjects</Label>
            <Textarea
              id="dataSubjects"
              value={formData.dataSubjects}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dataSubjects: e.target.value }))
              }
              placeholder="e.g., Employees, Customers, Website visitors..."
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="estimatedDataSubjects">
              Estimated Number of Data Subjects
            </Label>
            <Input
              id="estimatedDataSubjects"
              value={formData.estimatedDataSubjects}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedDataSubjects: e.target.value,
                }))
              }
              placeholder="e.g., 1,000-10,000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage 1: Legal Basis */}
      <Card>
        <CardHeader>
          <CardTitle>4. Legal Basis</CardTitle>
          <CardDescription>
            Select the lawful basis for processing under Swiss FADP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md">
            <Label htmlFor="legalBasis">Legal Basis</Label>
            <Select
              value={formData.legalBasis}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, legalBasis: value }))
              }
            >
              <SelectTrigger id="legalBasis">
                <SelectValue placeholder="Select legal basis..." />
              </SelectTrigger>
              <SelectContent>
                {LEGAL_BASIS_OPTIONS.map((basis) => (
                  <SelectItem key={basis} value={basis}>
                    {LEGAL_BASIS_LABELS[basis]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stage 1: Preliminary Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>5. Preliminary Risk Assessment</CardTitle>
          <CardDescription>
            Evaluate the initial risk level of the processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md">
            <Label htmlFor="preliminaryRiskLevel">Preliminary Risk Level</Label>
            <Select
              value={formData.preliminaryRiskLevel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, preliminaryRiskLevel: value }))
              }
            >
              <SelectTrigger id="preliminaryRiskLevel">
                <SelectValue placeholder="Select risk level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              If HIGH, a complete DPIA is required under Art. 22 FADP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stage 2: Identified Risks */}
      <Card>
        <CardHeader>
          <CardTitle>6. Identified Risks</CardTitle>
          <CardDescription>
            List specific risks to data subjects rights and freedoms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.identifiedRisks.map((risk, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg space-y-3 bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <Label>Risk {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRisk(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div>
                <Label htmlFor={`risk-${index}-desc`}>Description</Label>
                <Textarea
                  id={`risk-${index}-desc`}
                  value={risk.description}
                  onChange={(e) =>
                    updateRisk(index, "description", e.target.value)
                  }
                  placeholder="Describe the risk..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`risk-${index}-likelihood`}>Likelihood</Label>
                  <Select
                    value={risk.likelihood}
                    onValueChange={(value) =>
                      updateRisk(index, "likelihood", value)
                    }
                  >
                    <SelectTrigger id={`risk-${index}-likelihood`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`risk-${index}-impact`}>Impact</Label>
                  <Select
                    value={risk.impact}
                    onValueChange={(value) => updateRisk(index, "impact", value)}
                  >
                    <SelectTrigger id={`risk-${index}-impact`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${index}-mitigated`}
                      checked={risk.mitigated}
                      onCheckedChange={(checked) =>
                        updateRisk(index, "mitigated", checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`risk-${index}-mitigated`}
                      className="text-sm font-medium"
                    >
                      Mitigated
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addRisk}>
            <Plus className="mr-2 h-4 w-4" />
            Add Risk
          </Button>
        </CardContent>
      </Card>

      {/* Stage 2: Protective Measures */}
      <Card>
        <CardHeader>
          <CardTitle>7. Protective Measures</CardTitle>
          <CardDescription>
            Technical and organizational measures to mitigate risks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Protective measures are managed separately
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Technical Measures:</strong> The security controls from standards
                (ISO 27001, NIST CSF, etc.) assigned to this project serve as technical
                measures. Manage them on the{" "}
                <Link href={`/projects/${projectId}`} className="underline">
                  project page
                </Link>.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Organizational Measures:</strong> Manage policies, training,
                and procedures in the Organizational Measures section on the{" "}
                <Link href={`/projects/${projectId}`} className="underline">
                  project page
                </Link>.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="dataProtectionByDesign">
              Data Protection by Design
            </Label>
            <Textarea
              id="dataProtectionByDesign"
              value={formData.dataProtectionByDesign}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataProtectionByDesign: e.target.value,
                }))
              }
              placeholder="Describe how data protection is built into the system by design..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage 2: Residual Risk */}
      <Card>
        <CardHeader>
          <CardTitle>8. Residual Risk Evaluation</CardTitle>
          <CardDescription>
            Risk level after implementing protective measures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full max-w-md">
            <Label htmlFor="residualRiskLevel">Residual Risk Level</Label>
            <Select
              value={formData.residualRiskLevel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, residualRiskLevel: value }))
              }
            >
              <SelectTrigger id="residualRiskLevel">
                <SelectValue placeholder="Select risk level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="residualRiskJustification">Justification</Label>
            <Textarea
              id="residualRiskJustification"
              value={formData.residualRiskJustification}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  residualRiskJustification: e.target.value,
                }))
              }
              placeholder="Explain how the residual risk level was determined..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Consultation */}
      <Card>
        <CardHeader>
          <CardTitle>9. Consultation</CardTitle>
          <CardDescription>
            DPO and FDPIC consultation requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dpoConsulted"
              checked={formData.dpoConsulted}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  dpoConsulted: checked as boolean,
                }))
              }
            />
            <label htmlFor="dpoConsulted" className="text-sm font-medium">
              Data Protection Officer (DPO) has been consulted
            </label>
          </div>

          {formData.dpoConsulted && (
            <div className="grid gap-4 md:grid-cols-2 pl-6">
              <div>
                <Label htmlFor="dpoName">DPO Name</Label>
                <Input
                  id="dpoName"
                  value={formData.dpoName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dpoName: e.target.value }))
                  }
                  placeholder="Enter DPO name"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="dpoOpinion">DPO Opinion</Label>
                <Textarea
                  id="dpoOpinion"
                  value={formData.dpoOpinion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dpoOpinion: e.target.value,
                    }))
                  }
                  placeholder="Record the DPO's opinion on the assessment..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="requiresFDPICConsultation"
              checked={formData.requiresFDPICConsultation}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  requiresFDPICConsultation: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="requiresFDPICConsultation"
              className="text-sm font-medium"
            >
              FDPIC consultation is required (Art. 23 FADP)
            </label>
          </div>
          <p className="text-sm text-gray-500 pl-6">
            Required if residual risk remains HIGH and no DPO has been consulted
          </p>
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle>10. Assessment Details</CardTitle>
          <CardDescription>
            Information about the person conducting this assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="assessorName">Assessor Name</Label>
              <Input
                id="assessorName"
                value={formData.assessorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assessorName: e.target.value,
                  }))
                }
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="assessorRole">Assessor Role</Label>
              <Input
                id="assessorRole"
                value={formData.assessorRole}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assessorRole: e.target.value,
                  }))
                }
                placeholder="e.g., IT Security Manager"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Link href={`/projects/${projectId}/dpia`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
