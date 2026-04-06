"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"

interface SkillRadarChartProps {
  skills: {
    frontend: number
    backend: number
    ai: number
    uiux: number
    devops: number
  }
  size?: "sm" | "md" | "lg"
}

export function SkillRadarChart({ skills, size = "md" }: SkillRadarChartProps) {
  const data = [
    { skill: "Frontend", value: skills.frontend },
    { skill: "Backend", value: skills.backend },
    { skill: "AI/ML", value: skills.ai },
    { skill: "UI/UX", value: skills.uiux },
    { skill: "DevOps", value: skills.devops },
  ]

  const heights = {
    sm: 120,
    md: 180,
    lg: 250,
  }

  return (
    <div style={{ height: heights[size] }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="oklch(0.3 0.05 280 / 0.3)"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "oklch(0.65 0 0)", fontSize: size === "sm" ? 9 : 11 }}
            tickLine={false}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="oklch(0.65 0.25 280)"
            fill="oklch(0.65 0.25 280)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
