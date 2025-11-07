import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoDataCardProps {
  title?: string;
  message?: string;
  className?: string;
}

export function NoDataCard({
  title = "No Data Available",
  message = "Unable to load data at this time. Please try again later.",
  className = "",
}: NoDataCardProps) {
  return (
    <div className={`mt-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
