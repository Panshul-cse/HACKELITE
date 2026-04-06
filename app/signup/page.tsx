"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)
    setSuccessMessage(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    setIsLoading(false)

    if (error) {
      setAuthError(error.message)
      return
    }

    if (data?.user) {
      setSuccessMessage("Account created successfully. Redirecting...")
      router.push("/discover")
      return
    }

    setAuthError("Unable to create account. Please try again.")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="flex min-h-dvh bg-black text-white">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-12 sm:px-8">
        <div className="rounded-2xl border border-white/20 bg-black/50 p-8 shadow-[0_0_60px_-15px_rgba(168,85,247,0.4)] backdrop-blur-sm">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Register with email and password to access the site.
          </p>

          {authError ? (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {authError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="h-11 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-white focus:ring-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password"
                required
                className="h-11 border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-white focus:ring-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/" className="text-white hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
