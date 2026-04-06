"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  Github,
  ExternalLink,
  Calendar,
  Code2,
  GitCommit,
  GitPullRequest,
  Star,
  UserPlus,
  MessageSquare,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkillRadarChart } from "@/components/skill-radar-chart"
import { candidates } from "@/lib/mock-data"

// Extended mock data for profile analytics
const contributionData = [
  { month: "Jan", commits: 45, prs: 12 },
  { month: "Feb", commits: 62, prs: 18 },
  { month: "Mar", commits: 78, prs: 22 },
  { month: "Apr", commits: 95, prs: 28 },
  { month: "May", commits: 110, prs: 32 },
  { month: "Jun", commits: 88, prs: 25 },
]

const repoStats = [
  { name: "ml-pipeline", stars: 234, language: "Python", color: "#3776AB" },
  { name: "react-components", stars: 189, language: "TypeScript", color: "#3178C6" },
  { name: "infra-tools", stars: 156, language: "Go", color: "#00ADD8" },
  { name: "data-viz", stars: 98, language: "JavaScript", color: "#F7DF1E" },
]

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params)
  const candidate = candidates.find((c) => c.id === id) || candidates[0]

  const availabilityColors = {
    available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    busy: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    away: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link href="/discover">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Discover
            </Button>
          </Link>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl glass-card p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-lg opacity-60" />
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-background"
                />
                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-background ${
                  candidate.availability === "available" ? "bg-emerald-500" :
                  candidate.availability === "busy" ? "bg-amber-500" : "bg-red-500"
                }`} />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{candidate.name}</h1>
                  <Badge className={availabilityColors[candidate.availability]}>
                    {candidate.availability}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-2">{candidate.title}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidate.location}
                  </span>
                  <a
                    href={`https://github.com/${candidate.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    {candidate.github}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Match Score & Actions */}
            <div className="lg:ml-auto flex flex-col items-center lg:items-end gap-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient">{candidate.matchScore}%</div>
                  <div className="text-sm text-muted-foreground">Match Score</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-border hover:bg-secondary">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button className="gap-2 glow-primary bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="h-4 w-4" />
                  Invite to Team
                </Button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-foreground/90">{candidate.bio}</p>
          </div>

          {/* Match Reason */}
          <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent-foreground/90">{candidate.matchReason}</p>
          </div>
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Skill Analysis
            </h2>
            <SkillRadarChart skills={candidate.skills} size="lg" />
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {Object.entries(candidate.skills).map(([skill, value]) => (
                <div key={skill} className="p-2 rounded-lg bg-secondary/50">
                  <div className="text-lg font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground capitalize">{skill === "uiux" ? "UI/UX" : skill === "ai" ? "AI/ML" : skill}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contribution Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-primary" />
              Contribution Activity
            </h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={contributionData}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="oklch(0.5 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="oklch(0.5 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.1 0.02 280)",
                      border: "1px solid oklch(0.3 0.05 280 / 0.3)",
                      borderRadius: "8px",
                      color: "oklch(0.98 0 0)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    stroke="oklch(0.65 0.25 280)"
                    fillOpacity={1}
                    fill="url(#colorCommits)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <GitCommit className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-lg font-bold text-foreground">478</div>
                  <div className="text-xs text-muted-foreground">Commits</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <GitPullRequest className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-lg font-bold text-foreground">137</div>
                  <div className="text-xs text-muted-foreground">PRs Merged</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Calendar className="h-4 w-4 text-chart-3" />
                <div>
                  <div className="text-lg font-bold text-foreground">98</div>
                  <div className="text-xs text-muted-foreground">Active Days</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Language & Repos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Top Languages
            </h2>
            <div className="space-y-4">
              {candidate.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{lang.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Top Repositories
            </h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repoStats} layout="vertical">
                  <XAxis type="number" stroke="oklch(0.5 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="oklch(0.5 0 0)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.1 0.02 280)",
                      border: "1px solid oklch(0.3 0.05 280 / 0.3)",
                      borderRadius: "8px",
                      color: "oklch(0.98 0 0)",
                    }}
                    formatter={(value: number) => [`${value} stars`, "Stars"]}
                  />
                  <Bar dataKey="stars" radius={[0, 4, 4, 0]}>
                    {repoStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {repoStats.map((repo) => (
                <Badge
                  key={repo.name}
                  variant="outline"
                  className="gap-1"
                  style={{
                    borderColor: `${repo.color}50`,
                    backgroundColor: `${repo.color}10`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.color }} />
                  {repo.language}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
