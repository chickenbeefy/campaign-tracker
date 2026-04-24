"use server"

import { redirect } from "next/navigation"

import { db } from "@/lib/db"

export async function deleteCampaign(id: string) {
  await db.query("DELETE FROM campaigns WHERE id = $1", [id])
  redirect("/campaigns")
}
