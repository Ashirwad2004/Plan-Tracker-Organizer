import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@shared/schema";
import { categoryConfig } from "@/lib/utils";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
];

export function FilterBar({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${categoryConfig[cat].dotColor}`} />
                  {categoryConfig[cat].label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            data-testid={`button-filter-${filter.id}`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
