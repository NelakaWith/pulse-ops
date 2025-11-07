import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleX, TriangleAlert, CircleCheck, BadgeInfo } from "lucide-react";

export type StatusType = "error" | "warning" | "success" | "info";

interface StatusCardProps {
  status: StatusType;
  title: string;
  message: string;
  className?: string;
}

const statusIcons: Record<StatusType, React.ReactNode> = {
  error: <CircleX className="w-5 h-5" />,
  warning: <TriangleAlert className="w-5 h-5" />,
  success: <CircleCheck className="w-5 h-5" />,
  info: <BadgeInfo className="w-5 h-5" />,
};

const statusStyles: Record<
  StatusType,
  {
    container: string;
    title: string;
    message: string;
    icon: string;
  }
> = {
  error: {
    container:
      "border-red-200 bg-red-100/50 dark:border-red-900/40 dark:bg-red-950/30",
    title: "text-red-700 dark:text-red-400",
    message: "text-red-600 dark:text-red-300",
    icon: "text-red-700 dark:text-red-400",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-100/50 dark:border-amber-900/40 dark:bg-amber-950/30",
    title: "text-amber-700 dark:text-amber-400",
    message: "text-amber-600 dark:text-amber-300",
    icon: "text-amber-700 dark:text-amber-400",
  },
  success: {
    container:
      "border-green-200 bg-green-100/50 dark:border-green-900/40 dark:bg-green-950/30",
    title: "text-green-700 dark:text-green-400",
    message: "text-green-600 dark:text-green-300",
    icon: "text-green-700 dark:text-green-400",
  },
  info: {
    container:
      "border-blue-200 bg-blue-100/50 dark:border-blue-900/40 dark:bg-blue-950/30",
    title: "text-blue-700 dark:text-blue-400",
    message: "text-blue-600 dark:text-blue-300",
    icon: "text-blue-700 dark:text-blue-400",
  },
};

export function StatusCard({
  status,
  title,
  message,
  className = "",
}: StatusCardProps) {
  const styles = statusStyles[status];
  const icon = statusIcons[status];

  return (
    <div className={`mt-4 ${className}`}>
      <Card className={styles.container}>
        <CardHeader>
          <CardTitle className={styles.title}>
            <div className="flex items-center gap-2">
              <span className={styles.icon}>{icon}</span>
              <h1 className="text-lg">{title}</h1>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.message}>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
