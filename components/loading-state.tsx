import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * LoadingState component displays a centered spinner with optional message.
 * Use this for loading states instead of skeleton components.
 *
 * @param message - Optional loading message to display below spinner
 * @param className - Optional className for the container
 * @param spinnerClassName - Optional className for the spinner icon
 */
export function LoadingState({
  message = "Loading...",
  className,
  spinnerClassName,
}: {
  message?: string;
  className?: string;
  spinnerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8",
        className
      )}
    >
      <Spinner className={cn("size-8", spinnerClassName)} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
