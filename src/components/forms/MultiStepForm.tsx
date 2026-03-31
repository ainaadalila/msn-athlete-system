"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step1PersonalId } from "./steps/Step1PersonalId";
import { Step2PersonalData } from "./steps/Step2PersonalData";
import { Step3Achievements } from "./steps/Step3Achievements";
import { Step4Assessments } from "./steps/Step4Assessments";
import { Step5Review } from "./steps/Step5Review";
import { useLanguage } from "@/context/LanguageContext";
import {
  fullAthleteSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type FullAthleteForm,
} from "@/lib/validations/athlete.schema";
import { uploadAthletePhoto } from "@/lib/storage/photos";
import { createClient } from "@/lib/supabase/client";

interface MultiStepFormProps {
  defaultValues?: Partial<FullAthleteForm> & { id?: string };
  mode?: "create" | "edit";
}

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema, step4Schema, null];

export function MultiStepForm({ defaultValues, mode = "create" }: MultiStepFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const steps = [
    t.steps.step1,
    t.steps.step2,
    t.steps.step3,
    t.steps.step4,
    t.steps.step5,
  ];

  const methods = useForm<FullAthleteForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fullAthleteSchema) as any,
    defaultValues: {
      sukan: "MEMANAH",
      achievements: [],
      assessments: [],
      ...defaultValues,
    },
    mode: "onBlur",
  });

  async function validateStep() {
    const schema = STEP_SCHEMAS[currentStep];
    if (!schema) return true;
    const values = methods.getValues();
    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        methods.setError(path as keyof FullAthleteForm, {
          message: issue.message,
        });
      });
      return false;
    }
    return true;
  }

  async function handleNext() {
    const valid = await validateStep();
    if (valid) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function handleSubmit(data: FullAthleteForm) {
    setSubmitting(true);
    try {
      const supabase = createClient();

      let gambarUrl = data.gambar_url;

      if (mode === "create") {
        // Insert athlete first to get id
        const { achievements, assessments, gambar_url: _g, ...athleteData } = data;

        const { data: athlete, error } = await supabase
          .from("athletes")
          .insert({ ...athleteData, gambar_url: null })
          .select()
          .single();

        if (error) throw error;

        // Upload photo if pending
        if (pendingPhotoFile) {
          gambarUrl = await uploadAthletePhoto(athlete.id, pendingPhotoFile);
          await supabase
            .from("athletes")
            .update({ gambar_url: gambarUrl })
            .eq("id", athlete.id);
        }

        // Insert achievements
        if (achievements && achievements.length > 0) {
          await supabase.from("achievements").insert(
            achievements.map((a, i) => ({ ...a, urutan: i + 1, athlete_id: athlete.id }))
          );
        }

        // Insert assessments
        if (assessments && assessments.length > 0) {
          await supabase.from("assessments").insert(
            assessments.map((a, i) => ({ ...a, no: i + 1, athlete_id: athlete.id }))
          );
        }

        toast.success("Profil atlet berjaya didaftarkan!");
        router.push(`/athletes/${athlete.id}`);
      } else {
        // Edit mode
        const athleteId = defaultValues?.id;
        if (!athleteId) throw new Error("No athlete id");

        const { achievements, assessments, gambar_url: _g, ...athleteData } = data;

        // Upload new photo if pending
        if (pendingPhotoFile) {
          gambarUrl = await uploadAthletePhoto(athleteId, pendingPhotoFile);
        }

        const { error } = await supabase
          .from("athletes")
          .update({ ...athleteData, gambar_url: gambarUrl })
          .eq("id", athleteId);

        if (error) throw error;

        // Delete and re-insert related rows
        await supabase.from("achievements").delete().eq("athlete_id", athleteId);
        await supabase.from("assessments").delete().eq("athlete_id", athleteId);

        if (achievements && achievements.length > 0) {
          await supabase.from("achievements").insert(
            achievements.map((a, i) => ({ ...a, urutan: i + 1, athlete_id: athleteId }))
          );
        }

        if (assessments && assessments.length > 0) {
          await supabase.from("assessments").insert(
            assessments.map((a, i) => ({ ...a, no: i + 1, athlete_id: athleteId }))
          );
        }

        toast.success("Profil atlet berjaya dikemaskini!");
        router.push(`/athletes/${athleteId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Ralat berlaku. Sila cuba semula.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepComponents = [
    <Step1PersonalId
      key="step1"
      pendingPhotoFile={pendingPhotoFile}
      onPhotoChange={(file) => setPendingPhotoFile(file)}
    />,
    <Step2PersonalData key="step2" />,
    <Step3Achievements key="step3" />,
    <Step4Assessments key="step4" />,
    <Step5Review key="step5" />,
  ];

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => i < currentStep && setCurrentStep(i)}
                className="flex flex-col items-center gap-1 group"
                disabled={i > currentStep}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i < currentStep
                      ? "bg-green-500 text-white cursor-pointer"
                      : i === currentStep
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-[10px] hidden sm:block text-center leading-tight max-w-[80px] ${
                    i === currentStep ? "text-blue-700 font-medium" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-colors ${
                    i < currentStep ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-5">
            {t.steps[`step${currentStep + 1}` as keyof typeof t.steps]}
          </h2>
          {stepComponents[currentStep]}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t.common.back}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              {t.common.next}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={methods.handleSubmit(handleSubmit as Parameters<typeof methods.handleSubmit>[0])}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? t.common.loading : t.common.submit}
              {!submitting && <Check className="w-4 h-4 ml-1" />}
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
