import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Plan, Category } from "@shared/schema";
import { categoryConfig, getStats } from "@/lib/utils";
import { parseISO, format, startOfWeek, addDays, isWithinInterval } from "date-fns";

const CATEGORY_COLORS = {
  work: "#3b82f6",
  study: "#8b5cf6",
  health: "#22c55e",
  finance: "#10b981",
  personal: "#f97316",
};

export default function Analytics() {
  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const stats = useMemo(() => getStats(plans), [plans]);

  const categoryData = useMemo(() => {
    const counts: Record<Category, { total: number; completed: number }> = {
      work: { total: 0, completed: 0 },
      study: { total: 0, completed: 0 },
      health: { total: 0, completed: 0 },
      finance: { total: 0, completed: 0 },
      personal: { total: 0, completed: 0 },
    };

    plans.forEach((plan) => {
      counts[plan.category].total++;
      if (plan.status === "completed") {
        counts[plan.category].completed++;
      }
    });

    return Object.entries(counts).map(([category, data]) => ({
      name: categoryConfig[category as Category].label,
      category,
      total: data.total,
      completed: data.completed,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [plans]);

  const pieData = useMemo(() => {
    return categoryData
      .filter((d) => d.total > 0)
      .map((d) => ({
        name: d.name,
        value: d.total,
        color: CATEGORY_COLORS[d.category as Category],
      }));
  }, [categoryData]);

  const weeklyData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayStr = format(day, "yyyy-MM-dd");
      const dayPlans = plans.filter((plan) => {
        if (!plan.deadline) return false;
        try {
          return format(parseISO(plan.deadline), "yyyy-MM-dd") === dayStr;
        } catch {
          return false;
        }
      });

      days.push({
        name: format(day, "EEE"),
        total: dayPlans.length,
        completed: dayPlans.filter((p) => p.status === "completed").length,
      });
    }

    return days;
  }, [plans]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-analytics-title">
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your productivity and progress
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary" data-testid="text-completion-rate">
                {stats.completionRate}%
              </p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" data-testid="text-total-tasks">
                {stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500" data-testid="text-completed-tasks">
                {stats.completed}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-500" data-testid="text-overdue-tasks">
                {stats.overdue}
              </p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="hsl(var(--muted))"
                      name="Total"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="hsl(var(--primary))"
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Tasks by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: CATEGORY_COLORS[category.category as Category],
                        }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.completed}/{category.total} ({category.completionRate}%)
                    </span>
                  </div>
                  <Progress
                    value={category.completionRate}
                    className="h-2"
                    style={
                      {
                        "--progress-color": CATEGORY_COLORS[category.category as Category],
                      } as React.CSSProperties
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
