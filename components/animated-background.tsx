"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
}

interface Connection {
  from: number
  to: number
  opacity: number
}

export function AnimatedBackground() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])

  useEffect(() => {
    // Initialize nodes
    const initialNodes: Node[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }))
    setNodes(initialNodes)

    // Animation loop
    const interval = setInterval(() => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) => {
          let newX = node.x + node.vx
          let newY = node.y + node.vy
          let newVx = node.vx
          let newVy = node.vy

          // Bounce off edges
          if (newX <= 0 || newX >= 100) newVx = -newVx
          if (newY <= 0 || newY >= 100) newVy = -newVy

          return {
            ...node,
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(100, newY)),
            vx: newVx,
            vy: newVy,
          }
        })

        // Calculate connections
        const newConnections: Connection[] = []
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const dx = newNodes[i].x - newNodes[j].x
            const dy = newNodes[i].y - newNodes[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 25) {
              newConnections.push({
                from: i,
                to: j,
                opacity: 1 - distance / 25,
              })
            }
          }
        }
        setConnections(newConnections)

        return newNodes
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.28 265 / 0.15) 0%, transparent 70%)",
          top: "10%",
          right: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.25 280 / 0.12) 0%, transparent 70%)",
          bottom: "20%",
          left: "5%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Network visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        {/* Connections */}
        {connections.map((conn, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={`${nodes[conn.from]?.x}%`}
            y1={`${nodes[conn.from]?.y}%`}
            x2={`${nodes[conn.to]?.x}%`}
            y2={`${nodes[conn.to]?.y}%`}
            stroke="oklch(0.65 0.25 280)"
            strokeWidth="1"
            strokeOpacity={conn.opacity * 0.5}
          />
        ))}
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="oklch(0.65 0.25 280)"
            fillOpacity="0.6"
          />
        ))}
      </svg>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.65 0.25 280 / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.65 0.25 280 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}
