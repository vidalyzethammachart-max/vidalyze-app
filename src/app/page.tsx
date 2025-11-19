"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthLandingPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  // Login
  const handleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // สำเร็จ → ไปหน้า dashboard / profile (พีปรับ path ทีหลังได้)
    router.push("/profile");
  };

  // Register
  const handleRegister = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Password และ Confirm password ไม่ตรงกัน");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // แล้วแต่ setting ของ Supabase:
    // - ถ้าเปิด Email Confirmation ต้องให้ไปเช็คเมล
    // - ถ้า auto confirm ก็ login ได้เลย
    setSuccessMsg("สมัครสำเร็จ! โปรดตรวจสอบอีเมลของคุณหรือลอง Login อีกครั้ง");
    setMode("login");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500" />
          <h1 className="text-xl font-semibold text-slate-50">Vidalyze</h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "login"
              ? "Sign in to continue to your dashboard"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/40 backdrop-blur">
          {/* Tabs */}
          <div className="mb-6 flex rounded-full bg-slate-900/80 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                mode === "login"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                mode === "register"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Create account
            </button>
          </div>

          {/* Error / Success message */}
          {errorMsg && (
            <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {mode === "register" && (
                <p className="text-[11px] text-slate-500">
                  ใช้อย่างน้อย 8 ตัวอักษร มีทั้งตัวเลขและสัญลักษณ์
                </p>
              )}
            </div>

            {/* Confirm password เฉพาะตอนสมัคร */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-200">
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* แถวลิงก์เล็ก ๆ */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-blue-500"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Login"
                : "Create account"}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          By continuing, you agree to our{" "}
          <span className="cursor-pointer text-slate-300 hover:underline">
            Terms
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-slate-300 hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}
