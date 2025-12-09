import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Sparkles, Wand2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { StatsCards } from "@/components/stats-cards";
import { FilterBar } from "@/components/filter-bar";
import { TaskCard } from "@/components/task-card";
import { PlanDialog } from "@/components/plan-dialog";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Plan, InsertPlan } from "@shared/schema";
import { filterPlans, getStats } from "@/lib/utils";

export default function Dashboard() {
  const { toast } = useToast();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const urlFilter = searchParams.get("filter") || "all";
  const urlCategory = searchParams.get("category") || "all";

  const [activeFilter, setActiveFilter] = useState(urlFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(urlCategory);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [plannerPrompt, setPlannerPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [aiPrioritized, setAiPrioritized] = useState<
    { id?: string; title?: string; priority?: string; reason?: string }[]
  >([]);
  const [aiDailyPlan, setAiDailyPlan] = useState<string | null>(null);

  useEffect(() => {
    setActiveFilter(urlFilter);
    setCategoryFilter(urlCategory);
  }, [urlFilter, urlCategory]);

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPlan) => {
      const response = await apiRequest("POST", "/api/plans", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setDialogOpen(false);
      setEditingPlan(null);
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPlan> }) => {
      const response = await apiRequest("PATCH", `/api/plans/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setDialogOpen(false);
      setEditingPlan(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setDeleteDialogOpen(false);
      setDeletingPlanId(null);
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const aiSuggestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/suggest");
      return res.json() as Promise<{ suggestions: string }>;
    },
    onSuccess: (data) => {
      setAiSuggestions(data.suggestions);
      toast({
        title: "AI suggestions ready",
        description: "Review the recommendations below.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI error",
        description: error.message || "Failed to get suggestions.",
        variant: "destructive",
      });
    },
  });

  const aiSortMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/sort");
      return res.json() as Promise<{ prioritized: any[] }>;
    },
    onSuccess: (data) => {
      setAiPrioritized(data.prioritized || []);
      toast({
        title: "Tasks prioritized",
        description: "AI prioritized your tasks.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI error",
        description: error.message || "Failed to prioritize tasks.",
        variant: "destructive",
      });
    },
  });

  const aiPlanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/plan", { prompt: plannerPrompt });
      return res.json() as Promise<{ plan: string }>;
    },
    onSuccess: (data) => {
      setAiDailyPlan(data.plan);
      toast({
        title: "Daily plan created",
        description: "AI generated a schedule for you.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI error",
        description: error.message || "Failed to create plan.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertPlan) => {
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleToggleStatus = (id: string, status: "pending" | "completed") => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingPlanId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingPlanId) {
      deleteMutation.mutate(deletingPlanId);
    }
  };

  const filteredPlans = useMemo(
    () => filterPlans(plans, activeFilter, searchQuery, categoryFilter),
    [plans, activeFilter, searchQuery, categoryFilter]
  );

  const stats = useMemo(() => getStats(plans), [plans]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your tasks
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setDialogOpen(true);
          }}
          data-testid="button-add-task"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <StatsCards
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
        overdue={stats.overdue}
      />

      {stats.total > 0 && (
        <ProgressBar
          value={stats.completionRate}
          label="Overall completion"
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => aiSuggestMutation.mutate()}
              disabled={aiSuggestMutation.isPending}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {aiSuggestMutation.isPending ? "Thinking..." : "AI Suggestions"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => aiSortMutation.mutate()}
              disabled={aiSortMutation.isPending}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {aiSortMutation.isPending ? "Sorting..." : "Auto-Prioritize"}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Daily planner prompt
            </label>
            <Textarea
              placeholder="e.g., I have 4 hours today, need to finish report and exercise."
              value={plannerPrompt}
              onChange={(e) => setPlannerPrompt(e.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => aiPlanMutation.mutate()}
              disabled={aiPlanMutation.isPending || !plannerPrompt.trim()}
            >
              {aiPlanMutation.isPending ? "Creating plan..." : "Create Daily Plan"}
            </Button>
          </div>

          {aiSuggestions && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">AI Suggestions</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap rounded border p-3 bg-muted/40">
                {aiSuggestions}
              </div>
            </div>
          )}

          {aiPrioritized.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">AI Prioritized Tasks</h4>
              <div className="space-y-2">
                {aiPrioritized.map((item, idx) => (
                  <div key={`${item.id ?? idx}`} className="rounded border p-3 bg-muted/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.title ?? "Task"}</span>
                      <span className="text-xs uppercase tracking-wide text-primary">
                        {item.priority || "Priority"}
                      </span>
                    </div>
                    {item.reason && (
                      <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiDailyPlan && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">AI Daily Plan</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap rounded border p-3 bg-muted/40">
                {aiDailyPlan}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {filteredPlans.length === 0 ? (
        <EmptyState
          title={
            searchQuery || categoryFilter !== "all" || activeFilter !== "all"
              ? "No tasks match your filters"
              : "No tasks yet"
          }
          description={
            searchQuery || categoryFilter !== "all" || activeFilter !== "all"
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first task"
          }
          onAddClick={
            !searchQuery && categoryFilter === "all" && activeFilter === "all"
              ? () => setDialogOpen(true)
              : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan) => (
              <TaskCard
                key={plan.id}
                plan={plan}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
