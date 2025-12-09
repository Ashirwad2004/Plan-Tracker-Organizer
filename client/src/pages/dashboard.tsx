import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";
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
