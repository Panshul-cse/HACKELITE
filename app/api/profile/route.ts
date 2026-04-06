import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      github_username,
      skills,
      total_repos,
      total_commits,
      total_stars,
      top_languages,
      analysis_data,
      matched_projects,
    } = body

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("github_username", github_username)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from("profiles")
        .update({
          skills,
          total_repos,
          total_commits,
          total_stars,
          top_languages,
          analysis_data,
          matched_projects,
        })
        .eq("github_username", github_username)
        .select()
        .single()

      if (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data, updated: true })
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          github_username,
          skills,
          total_repos,
          total_commits,
          total_stars,
          top_languages,
          analysis_data,
          matched_projects,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating profile:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data, created: true })
    }
  } catch (error) {
    console.error("Error in profile API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (username) {
      // Get specific profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("github_username", username)
        .single()

      if (error) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
      }

      return NextResponse.json({ data })
    } else {
      // Get all profiles for discovery
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching profiles:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }
  } catch (error) {
    console.error("Error in profile API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
