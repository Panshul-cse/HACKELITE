"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Layers, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TeamCard } from "@/components/team-card"
import { teams } from "@/lib/mock-data"

const hackathonFilters = ["All", "Fintech Disrupt 2024", "HealthTech Summit", "EdTech Innovation", "Climate Tech Challenge"]

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState("All")

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          team.name.toLowerCase().includes(query) ||
          team.description.toLowerCase().includes(query) ||
          team.skills.some((skill) => skill.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Hackathon filter
      if (selectedHackathon !== "All" && team.hackathon !== selectedHackathon) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedHackathon])

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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Find a Team</h1>
              </div>
              <p className="text-muted-foreground mt-2">
                Browse teams looking for talented developers like you.
              </p>
            </div>
            <Button className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search teams by name, skills, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary/50 border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Hackathon Filters */}
          <div className="flex flex-wrap gap-2">
            {hackathonFilters.map((filter) => (
              <Badge
                key={filter}
                variant={selectedHackathon === filter ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedHackathon === filter
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
                onClick={() => setSelectedHackathon(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredTeams.length}</span> teams
          </p>
        </motion.div>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-8 rounded-2xl glass-card"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No teams found</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Try adjusting your filters or search query to find more teams.
            </p>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" />
              Create Your Own Team
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
