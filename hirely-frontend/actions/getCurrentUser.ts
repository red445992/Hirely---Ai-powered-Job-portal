import { cookies } from 'next/headers'

export interface User {
  id: number;
  username: string;
  email: string;
  user_type: "candidate" | "employer";
  first_name: string;
  last_name: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export default async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('access_token')?.value
    const userCookie = cookieStore.get('user')?.value

    if (!token || !userCookie) {
      return null
    }

    // Parse user from cookie
    const user = JSON.parse(userCookie) as User
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}