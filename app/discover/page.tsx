"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterSidebar } from "@/components/filter-sidebar"
import { CandidateCard } from "@/components/candidate-card"
import { candidates } from "@/lib/mock-data"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    roles: [] as string[],
    experience: [] as string[],
    availability: [] as string[],
    minMatch: 0,
  })

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          candidate.name.toLowerCase().includes(query) ||
          candidate.title.toLowerCase().includes(query) ||
          candidate.location.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Match score filter
      if (candidate.matchScore < filters.minMatch) return false

      // Experience filter
      if (filters.experience.length > 0) {
        if (!filters.experience.includes(candidate.experience)) return false
      }

      // Availability filter
      if (filters.availability.length > 0) {
        if (!filters.availability.includes(candidate.availability)) return false
      }

      // Role filter (based on highest skill)
      if (filters.roles.length > 0) {
        const skillMapping: Record<string, keyof typeof candidate.skills> = {
          frontend: "frontend",
          backend: "backend",
          "full stack": "frontend",
          "ai/ml": "ai",
          devops: "devops",
          "ui/ux": "uiux",
        }
        const hasRole = filters.roles.some((role) => {
          const skillKey = skillMapping[role]
          return skillKey && candidate.skills[skillKey] >= 70
        })
        if (!hasRole) return false
      }

      return true
    })
  }, [searchQuery, filters])

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Discover Teammates</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Find developers whose skills complement yours perfectly.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary/50 border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Candidates Grid */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredCandidates.length}</span> candidates
              </p>
            </motion.div>

            {filteredCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate, index) => (
                  <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl glass-card"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No candidates found</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Try adjusting your filters or search query to find more matches.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
