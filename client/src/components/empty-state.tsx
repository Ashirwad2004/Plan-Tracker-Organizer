import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddClick?: () => void;
}

export function EmptyState({
  title = "No tasks yet",
  description = "Get started by creating your first task",
  onAddClick,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="rounded-full bg-muted p-6 mb-6">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm" data-testid="text-empty-description">
        {description}
      </p>
      {onAddClick && (
        <Button onClick={onAddClick} data-testid="button-add-first-task">
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Task
        </Button>
      )}
    </motion.div>
  );
}
