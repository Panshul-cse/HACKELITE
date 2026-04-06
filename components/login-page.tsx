"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-white/50" />
    </div>
  ),
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    setIsLoading(false)

    if (error) {
      const message = error.message || "Unable to sign in."
      if (
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("not found") ||
        message.toLowerCase().includes("user not found")
      ) {
        setAuthError("No account found for that email. Please create one first.")
      } else {
        setAuthError(message)
      }
      return
    }

    if (data?.user) {
      router.push("/discover")
      return
    }

    setAuthError("Unexpected login response. Please try again.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="flex min-h-dvh bg-black">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-8 md:w-1/2 lg:w-2/5 md:px-12 lg:px-16 xl:px-24 relative">
        {/* Glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-40 h-96 bg-linear-to-b from-purple-600 via-pink-500 to-blue-600 opacity-30 blur-3xl" />
        </div>
        <div className="mx-auto w-full max-w-sm sm:max-w-md relative z-10 border border-white/20 rounded-2xl p-6 sm:p-8 bg-black/50 backdrop-blur-sm shadow-[0_0_60px_-15px_rgba(168,85,247,0.4)]">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400">
              Sign in to your account to continue
            </p>
          </div>

          {authError ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 mb-4">
              {authError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 sm:h-10 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-white focus:ring-white"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11 sm:h-10 border-zinc-800 bg-zinc-900/50 pr-10 text-white placeholder:text-zinc-500 focus:border-white focus:ring-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" />
                  ) : (
                    <Eye className="h-5 w-5 sm:h-4 sm:w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  className="rounded border-zinc-700 bg-zinc-900"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-semibold h-12 sm:h-11 text-base sm:text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 sm:mt-8 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - 3D Model */}
      <div 
        ref={containerRef}
        className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 3D Model underneath */}
        <div className="w-full h-full">
          <Spline scene="https://prod.spline.design/Uu4YbQcbWDAuUlJR/scene.splinecode" />
        </div>
        
        {/* Black circle that follows mouse on hover */}
        {isHovering && (
          <div 
            className="absolute pointer-events-none z-10 rounded-full bg-black"
            style={{
              width: '200px',
              height: '200px',
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              boxShadow: '0 0 60px 30px black',
            }}
          />
        )}
      </div>
    </div>
  )
}
