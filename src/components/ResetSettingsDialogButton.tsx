import { useLingui } from "@lingui/react/macro";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSettingsContext } from "@/contexts/SettingsContext";

function ResetSettingsDialogButton() {
  const { t } = useLingui();
  const { dispatch } = useSettingsContext();

  function handleResetSettings() {
    dispatch({ type: "state/reset" });
    location.reload();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label={t`Reset all settings`}
          title={t`Reset all settings`}
        >
          <span aria-hidden className="font-emoji">
            💾
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t`Do you want to reset all settings?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t`This action cannot be undone. This will permanently delete all of your local storage data and totally refresh the experience.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResetSettings}
          >{t`Reset all`}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ResetSettingsDialogButton;
