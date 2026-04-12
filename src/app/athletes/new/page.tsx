import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { NewAthleteHeader } from "@/components/athletes/NewAthleteHeader";

export default function NewAthletePage() {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <NewAthleteHeader />
      <MultiStepForm mode="create" />
    </div>
  );
}
