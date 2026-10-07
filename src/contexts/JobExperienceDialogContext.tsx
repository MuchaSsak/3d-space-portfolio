import { createContext, useCallback, useContext, useState } from "react";

import JobExperienceItemDialog from "@/components/JobExperienceItemDialog";
import { JOB_EXPERIENCE_LIST, type JobExperienceId } from "@/lib/constants";

type JobExperienceDialogContext = {
  openJobExperienceDialog: (jobExperienceId: JobExperienceId) => void;
};

const JobExperienceDialogContext = createContext<JobExperienceDialogContext>({
  openJobExperienceDialog: () => {},
});

/**
 * The dialog lives in the regular DOM tree (not inside the 3D canvas), the asteroids only open it
 */
export function JobExperienceDialogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobExperienceId, setJobExperienceId] =
    useState<JobExperienceId | null>(null);

  const openJobExperienceDialog = useCallback(
    (newJobExperienceId: JobExperienceId) => {
      setJobExperienceId(newJobExperienceId);
      setIsOpen(true);
    },
    []
  );

  return (
    <JobExperienceDialogContext.Provider value={{ openJobExperienceDialog }}>
      {children}

      <JobExperienceItemDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        jobExperienceData={
          jobExperienceId ? JOB_EXPERIENCE_LIST[jobExperienceId] : undefined
        }
      />
    </JobExperienceDialogContext.Provider>
  );
}

export function useJobExperienceDialog() {
  return useContext(JobExperienceDialogContext);
}
