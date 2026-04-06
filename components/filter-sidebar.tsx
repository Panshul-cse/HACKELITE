"use client"

import { motion } from "framer-motion"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps {
  filters: {
    roles: string[]
    experience: string[]
    availability: string[]
    minMatch: number
  }
  onFiltersChange: (filters: FilterSidebarProps["filters"]) => void
}

const roleOptions = ["Frontend", "Backend", "Full Stack", "AI/ML", "DevOps", "UI/UX"]
const experienceOptions = ["Junior", "Mid", "Senior"]
const availabilityOptions = ["Available", "Busy", "Away"]

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const toggleFilter = (category: "roles" | "experience" | "availability", value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [category]: updated })
  }

  const clearFilters = () => {
    onFiltersChange({
      roles: [],
      experience: [],
      availability: [],
      minMatch: 0,
    })
  }

  const hasActiveFilters = 
    filters.roles.length > 0 || 
    filters.experience.length > 0 || 
    filters.availability.length > 0 || 
    filters.minMatch > 0

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-72 shrink-0 rounded-2xl glass-card p-6 h-fit sticky top-24"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Match Score */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">
          Minimum Match Score: {filters.minMatch}%
        </Label>
        <Slider
          value={[filters.minMatch]}
          onValueChange={([value]) => onFiltersChange({ ...filters, minMatch: value })}
          max={100}
          step={5}
          className="mt-2"
        />
      </div>

      {/* Roles */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">Role</Label>
        <div className="space-y-2">
          {roleOptions.map((role) => (
            <label
              key={role}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.roles.includes(role.toLowerCase())}
                onCheckedChange={() => toggleFilter("roles", role.toLowerCase())}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {role}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-foreground mb-3 block">Experience</Label>
        <div className="space-y-2">
          {experienceOptions.map((exp) => (
            <label
              key={exp}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.experience.includes(exp.toLowerCase())}
                onCheckedChange={() => toggleFilter("experience", exp.toLowerCase())}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {exp}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-3 block">Availability</Label>
        <div className="space-y-2">
          {availabilityOptions.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.availability.includes(status.toLowerCase())}
                onCheckedChange={() => toggleFilter("availability", status.toLowerCase())}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
