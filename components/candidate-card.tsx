"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Github, Eye, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkillRadarChart } from "@/components/skill-radar-chart"
import type { Candidate } from "@/lib/mock-data"

interface CandidateCardProps {
  candidate: Candidate
  index: number
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
  const availabilityColors = {
    available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    busy: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    away: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl glass-card overflow-hidden"
    >
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
          <span className="text-xs font-medium text-primary-foreground/70">Match</span>
          <span className="text-sm font-bold text-primary">{candidate.matchScore}%</span>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary/40 to-accent/40 blur-sm opacity-60" />
            <Image
              src={candidate.avatar}
              alt={candidate.name}
              width={56}
              height={56}
              className="relative rounded-full border-2 border-background"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
              candidate.availability === "available" ? "bg-emerald-500" :
              candidate.availability === "busy" ? "bg-amber-500" : "bg-red-500"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{candidate.location}</span>
            </div>
          </div>
        </div>

        {/* GitHub Pulse Section */}
        <div className="mb-4 p-3 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">GitHub Pulse</span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {candidate.commitActivity.map((commits, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(commits / 40) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className="flex-1 rounded-sm bg-primary/60"
                title={`${commits} commits`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {candidate.topLanguages.slice(0, 3).map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{ 
                  backgroundColor: `${lang.color}15`,
                  border: `1px solid ${lang.color}30`
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-foreground/80">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Radar */}
        <div className="mb-4">
          <SkillRadarChart skills={candidate.skills} size="sm" />
        </div>

        {/* Match Reason */}
        <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-xs text-accent-foreground/80">{candidate.matchReason}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/profile/${candidate.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2 border-border hover:bg-secondary">
              <Eye className="h-4 w-4" />
              View Analysis
            </Button>
          </Link>
          <Button size="sm" className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
