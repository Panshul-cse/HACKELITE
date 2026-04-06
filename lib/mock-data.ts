export interface Candidate {
  id: string
  name: string
  avatar: string
  title: string
  location: string
  matchScore: number
  matchReason: string
  skills: {
    frontend: number
    backend: number
    ai: number
    uiux: number
    devops: number
  }
  topLanguages: { name: string; percentage: number; color: string }[]
  commitActivity: number[]
  experience: "junior" | "mid" | "senior"
  availability: "available" | "busy" | "away"
  github: string
  bio: string
}

export interface Team {
  id: string
  name: string
  description: string
  hackathon: string
  members: {
    id: string
    name: string
    avatar: string
    role: string
  }[]
  openRoles: string[]
  filledRoles: string[]
  teamStrength: number
  skills: string[]
  lookingFor: string[]
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    title: "ML Engineer @ Scale AI",
    location: "San Francisco, CA",
    matchScore: 98,
    matchReason: "High Complement: They provide the ML expertise your team lacks.",
    skills: { frontend: 45, backend: 75, ai: 95, uiux: 30, devops: 60 },
    topLanguages: [
      { name: "Python", percentage: 65, color: "#3776AB" },
      { name: "TypeScript", percentage: 20, color: "#3178C6" },
      { name: "Go", percentage: 15, color: "#00ADD8" },
    ],
    commitActivity: [12, 18, 25, 30, 22, 35, 28],
    experience: "senior",
    availability: "available",
    github: "sarahchen",
    bio: "Building intelligent systems that scale. Previously at Google Brain. Stanford CS PhD candidate.",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    title: "Senior Frontend @ Vercel",
    location: "New York, NY",
    matchScore: 94,
    matchReason: "Strong UI skills complement your backend-heavy team.",
    skills: { frontend: 95, backend: 50, ai: 25, uiux: 85, devops: 40 },
    topLanguages: [
      { name: "TypeScript", percentage: 70, color: "#3178C6" },
      { name: "JavaScript", percentage: 20, color: "#F7DF1E" },
      { name: "CSS", percentage: 10, color: "#1572B6" },
    ],
    commitActivity: [20, 25, 18, 32, 28, 40, 35],
    experience: "senior",
    availability: "available",
    github: "marcusj",
    bio: "Crafting beautiful, performant web experiences. Open source maintainer. React core contributor.",
  },
  {
    id: "3",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    title: "Full Stack Developer",
    location: "Austin, TX",
    matchScore: 91,
    matchReason: "Versatile skill set fills multiple gaps in your team.",
    skills: { frontend: 80, backend: 85, ai: 45, uiux: 60, devops: 70 },
    topLanguages: [
      { name: "TypeScript", percentage: 45, color: "#3178C6" },
      { name: "Python", percentage: 30, color: "#3776AB" },
      { name: "Rust", percentage: 25, color: "#DEA584" },
    ],
    commitActivity: [15, 22, 30, 18, 25, 28, 32],
    experience: "mid",
    availability: "available",
    github: "aishap",
    bio: "Building products from 0 to 1. Y Combinator alum. Love tackling hard problems.",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    title: "DevOps Lead @ Stripe",
    location: "Seattle, WA",
    matchScore: 87,
    matchReason: "Infrastructure expertise critical for your scalability needs.",
    skills: { frontend: 30, backend: 70, ai: 35, uiux: 20, devops: 95 },
    topLanguages: [
      { name: "Go", percentage: 50, color: "#00ADD8" },
      { name: "Python", percentage: 30, color: "#3776AB" },
      { name: "Shell", percentage: 20, color: "#89E051" },
    ],
    commitActivity: [8, 12, 15, 20, 18, 22, 16],
    experience: "senior",
    availability: "busy",
    github: "davidk",
    bio: "Making systems reliable at scale. AWS certified. Kubernetes expert. 10x engineer (at breaking things).",
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    title: "UX Designer & Developer",
    location: "Miami, FL",
    matchScore: 85,
    matchReason: "Design thinking approach elevates product quality.",
    skills: { frontend: 75, backend: 35, ai: 20, uiux: 95, devops: 25 },
    topLanguages: [
      { name: "TypeScript", percentage: 55, color: "#3178C6" },
      { name: "CSS", percentage: 30, color: "#1572B6" },
      { name: "JavaScript", percentage: 15, color: "#F7DF1E" },
    ],
    commitActivity: [10, 15, 12, 18, 22, 20, 25],
    experience: "mid",
    availability: "available",
    github: "elenarodriguez",
    bio: "Where design meets code. Former IDEO. Figma advocate. Accessibility champion.",
  },
  {
    id: "6",
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    title: "Backend Engineer @ Meta",
    location: "Menlo Park, CA",
    matchScore: 82,
    matchReason: "System design skills perfect for complex architecture.",
    skills: { frontend: 40, backend: 95, ai: 55, uiux: 25, devops: 75 },
    topLanguages: [
      { name: "Java", percentage: 40, color: "#B07219" },
      { name: "Python", percentage: 35, color: "#3776AB" },
      { name: "C++", percentage: 25, color: "#00599C" },
    ],
    commitActivity: [18, 22, 28, 35, 30, 25, 32],
    experience: "senior",
    availability: "away",
    github: "alexthompson",
    bio: "Distributed systems enthusiast. Previously built infra serving billions. Coffee connoisseur.",
  },
]

export const teams: Team[] = [
  {
    id: "1",
    name: "NeuralPay",
    description: "Building an AI-powered fraud detection system for real-time payments",
    hackathon: "Fintech Disrupt 2024",
    members: [
      { id: "1", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face", role: "ML Lead" },
      { id: "6", name: "Alex Thompson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", role: "Backend" },
    ],
    openRoles: ["Frontend Developer", "DevOps Engineer"],
    filledRoles: ["ML Lead", "Backend Engineer"],
    teamStrength: 80,
    skills: ["Python", "TensorFlow", "React", "AWS"],
    lookingFor: ["React expertise", "Infrastructure scaling", "Real-time systems"],
  },
  {
    id: "2",
    name: "HealthSync",
    description: "Decentralized health records platform with privacy-preserving AI",
    hackathon: "HealthTech Summit",
    members: [
      { id: "3", name: "Aisha Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", role: "Tech Lead" },
      { id: "5", name: "Elena Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", role: "UX Lead" },
      { id: "4", name: "David Kim", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", role: "DevOps" },
    ],
    openRoles: ["AI/ML Engineer"],
    filledRoles: ["Tech Lead", "UX Lead", "DevOps Engineer"],
    teamStrength: 75,
    skills: ["Blockchain", "HIPAA", "React Native", "Go"],
    lookingFor: ["Privacy-preserving ML", "Healthcare domain expertise"],
  },
  {
    id: "3",
    name: "CodeMentor AI",
    description: "Personalized coding education platform with AI tutoring",
    hackathon: "EdTech Innovation",
    members: [
      { id: "2", name: "Marcus Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", role: "Frontend Lead" },
    ],
    openRoles: ["Backend Developer", "AI Engineer", "Content Creator"],
    filledRoles: ["Frontend Lead"],
    teamStrength: 40,
    skills: ["Next.js", "OpenAI API", "PostgreSQL"],
    lookingFor: ["Backend systems", "LLM fine-tuning", "Educational content"],
  },
  {
    id: "4",
    name: "GreenRoute",
    description: "Carbon-neutral logistics optimization using real-time data",
    hackathon: "Climate Tech Challenge",
    members: [
      { id: "4", name: "David Kim", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", role: "Infrastructure" },
      { id: "6", name: "Alex Thompson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", role: "Backend" },
    ],
    openRoles: ["Frontend Developer", "Data Scientist"],
    filledRoles: ["Infrastructure Lead", "Backend Developer"],
    teamStrength: 65,
    skills: ["Kubernetes", "Python", "GraphQL", "GIS"],
    lookingFor: ["Data visualization", "Route optimization", "Green tech passion"],
  },
]

// Match score calculation utility
export function calculateMatchScore(
  candidateSkills: Candidate["skills"],
  teamNeeds: string[]
): number {
  const skillMap: Record<string, keyof Candidate["skills"]> = {
    frontend: "frontend",
    react: "frontend",
    "ui/ux": "uiux",
    design: "uiux",
    backend: "backend",
    api: "backend",
    ml: "ai",
    ai: "ai",
    "machine learning": "ai",
    devops: "devops",
    infrastructure: "devops",
  }

  let totalScore = 0
  let matchedNeeds = 0

  teamNeeds.forEach((need) => {
    const normalizedNeed = need.toLowerCase()
    for (const [keyword, skillKey] of Object.entries(skillMap)) {
      if (normalizedNeed.includes(keyword)) {
        totalScore += candidateSkills[skillKey]
        matchedNeeds++
        break
      }
    }
  })

  if (matchedNeeds === 0) return 50
  return Math.min(100, Math.round(totalScore / matchedNeeds))
}
