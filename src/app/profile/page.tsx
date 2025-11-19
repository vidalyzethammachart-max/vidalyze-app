import { createClient } from "@/lib/supabaseServer"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>คุณยังไม่ได้ล็อกอิน</div>
  }

  return (
    <div>
      <h1>โปรไฟล์</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
