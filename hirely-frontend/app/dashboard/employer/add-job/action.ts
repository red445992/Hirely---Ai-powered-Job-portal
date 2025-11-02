// ========================================
// OPTIONAL: Server Action Approach (Alternative)
// FILE 3: app/dashboard/employer/add-job/actions.ts
// ========================================

"use server";

import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const location = formData.get("location") as string;
  const level = formData.get("level") as string;
  const salary = formData.get("salary") as string;

  try {
    // Call your backend API
    const response = await fetch(`http://localhost:8000/jobs/addjobs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers here
      },
      body: JSON.stringify({
        title,
        description,
        category,
        location,
        level,
        salary,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to create job" };
    }

    const data = await response.json();

    // Revalidate the jobs page
    revalidatePath("/dashboard/employer/manage-jobs");

    return { success: true, data };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error: "Something went wrong" };
  }
}