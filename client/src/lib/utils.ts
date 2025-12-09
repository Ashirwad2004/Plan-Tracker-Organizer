import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isThisWeek, isPast, parseISO } from "date-fns";
import type { Category, Priority, Plan } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  low: {
    label: "Low",
    className: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  },
};

export const categoryConfig: Record<Category, { label: string; color: string; dotColor: string }> = {
  work: {
    label: "Work",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  study: {
    label: "Study",
    color: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    dotColor: "bg-purple-500",
  },
  health: {
    label: "Health",
    color: "bg-green-500/15 text-green-600 dark:text-green-400",
    dotColor: "bg-green-500",
  },
  finance: {
    label: "Finance",
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  personal: {
    label: "Personal",
    color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    dotColor: "bg-orange-500",
  },
};

export function formatDeadline(deadline: string | null | undefined): string {
  if (!deadline) return "";
  try {
    const date = parseISO(deadline);
    if (isToday(date)) return "Today";
    return format(date, "MMM d, yyyy");
  } catch {
    return deadline;
  }
}

export function isOverdue(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  try {
    const date = parseISO(deadline);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export function filterPlans(
  plans: Plan[],
  filter: string,
  searchQuery: string,
  categoryFilter: string
): Plan[] {
  let filtered = [...plans];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (plan) =>
        plan.title.toLowerCase().includes(query) ||
        (plan.description && plan.description.toLowerCase().includes(query))
    );
  }

  if (categoryFilter && categoryFilter !== "all") {
    filtered = filtered.filter((plan) => plan.category === categoryFilter);
  }

  switch (filter) {
    case "pending":
      filtered = filtered.filter((plan) => plan.status === "pending");
      break;
    case "completed":
      filtered = filtered.filter((plan) => plan.status === "completed");
      break;
    case "today":
      filtered = filtered.filter((plan) => {
        if (!plan.deadline) return false;
        try {
          return isToday(parseISO(plan.deadline));
        } catch {
          return false;
        }
      });
      break;
    case "week":
      filtered = filtered.filter((plan) => {
        if (!plan.deadline) return false;
        try {
          return isThisWeek(parseISO(plan.deadline));
        } catch {
          return false;
        }
      });
      break;
  }

  return filtered.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getStats(plans: Plan[]) {
  const total = plans.length;
  const completed = plans.filter((p) => p.status === "completed").length;
  const pending = plans.filter((p) => p.status === "pending").length;
  const overdue = plans.filter(
    (p) => p.status === "pending" && isOverdue(p.deadline)
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, pending, overdue, completionRate };
}
