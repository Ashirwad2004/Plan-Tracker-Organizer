import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Plan } from "@shared/schema";
import { priorityConfig, categoryConfig, formatDeadline, isOverdue, cn } from "@/lib/utils";

interface TaskCardProps {
  plan: Plan;
  onToggleStatus: (id: string, status: "pending" | "completed") => void;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ plan, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = plan.status === "completed";
  const overdue = isOverdue(plan.deadline) && !isCompleted;
  const deadline = formatDeadline(plan.deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group hover-elevate transition-all duration-200",
          isCompleted && "opacity-60"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-task-${plan.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={(checked) =>
                onToggleStatus(plan.id, checked ? "completed" : "pending")
              }
              className="mt-1"
              data-testid={`checkbox-task-${plan.id}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-medium text-base truncate",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                    data-testid={`text-task-title-${plan.id}`}
                  >
                    {plan.title}
                  </h3>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs font-semibold uppercase",
                    priorityConfig[plan.priority].className
                  )}
                  data-testid={`badge-priority-${plan.id}`}
                >
                  {priorityConfig[plan.priority].label}
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 mt-3">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    categoryConfig[plan.category].color
                  )}
                  data-testid={`badge-category-${plan.id}`}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", categoryConfig[plan.category].dotColor)} />
                  {categoryConfig[plan.category].label}
                </Badge>
                {deadline && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      overdue ? "text-red-500" : "text-muted-foreground"
                    )}
                    data-testid={`text-deadline-${plan.id}`}
                  >
                    <Calendar className="h-3 w-3" />
                    {deadline}
                    {overdue && <span className="font-medium">(Overdue)</span>}
                  </span>
                )}
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-150",
                isHovered ? "opacity-100" : "opacity-0 invisible"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(plan)}
                data-testid={`button-edit-${plan.id}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(plan.id)}
                className="text-destructive hover:text-destructive"
                data-testid={`button-delete-${plan.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
