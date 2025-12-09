import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards({ total, completed, pending, overdue }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: ClipboardList,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "In Progress",
      value: pending,
      icon: Clock,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <Card className="hover-elevate">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
