import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-semibold"
          data-testid="text-progress-percentage"
        >
          {value}%
        </motion.span>
      </div>
      <Progress value={value} className="h-2" data-testid="progress-bar" />
    </div>
  );
}
