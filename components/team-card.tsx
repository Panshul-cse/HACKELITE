"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Users, CheckCircle2, Circle, Trophy, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Team } from "@/lib/mock-data"

interface TeamCardProps {
  team: Team
  index: number
}

export function TeamCard({ team, index }: TeamCardProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [pitchMessage, setPitchMessage] = useState("")

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className="group relative rounded-2xl glass-card overflow-hidden"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {team.hackathon}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
            </div>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {team.members.map((member) => (
                <div key={member.id} className="relative">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-background"
                    title={`${member.name} - ${member.role}`}
                  />
                </div>
              ))}
              {team.openRoles.length > 0 && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-secondary/50">
                  <span className="text-xs font-medium text-muted-foreground">+{team.openRoles.length}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {team.members.length} member{team.members.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Role Slots */}
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Team Roles</div>
            <div className="flex flex-wrap gap-2">
              {team.filledRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">{role}</span>
                </div>
              ))}
              {team.openRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20"
                >
                  <Circle className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary">OPEN: {role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Strength */}
          <div className="mb-4 p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-chart-4" />
                <span className="text-xs font-medium text-muted-foreground">Team Readiness</span>
              </div>
              <span className="text-sm font-bold text-foreground">{team.teamStrength}%</span>
            </div>
            <Progress value={team.teamStrength} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Ready for {team.hackathon}
            </p>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {team.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs bg-secondary/80 text-secondary-foreground">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action */}
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowJoinModal(true)}
          >
            <Users className="h-4 w-4" />
            Request to Join
          </Button>
        </div>
      </motion.div>

      {/* Join Request Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
            <DialogContent className="sm:max-w-lg glass-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Join {team.name}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Tell the team why you would be a great addition.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Team Looking For */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">They&apos;re looking for:</p>
                  <ul className="space-y-1">
                    {team.lookingFor.map((item) => (
                      <li key={item} className="text-sm text-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What You Bring */}
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">What you bring to this team:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">React Expert</Badge>
                    <Badge className="bg-primary/20 text-primary border-primary/30">TypeScript</Badge>
                    <Badge className="bg-primary/20 text-primary border-primary/30">3 Hackathon Wins</Badge>
                  </div>
                </div>

                {/* Pitch Message */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Your Pitch Message
                  </label>
                  <Textarea
                    placeholder="Tell them why you'd be a great fit..."
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    rows={4}
                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-secondary"
                    onClick={() => setShowJoinModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setShowJoinModal(false)}
                  >
                    <Send className="h-4 w-4" />
                    Send Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
