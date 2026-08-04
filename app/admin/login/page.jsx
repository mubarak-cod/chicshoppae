"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader } from "react-icons/fi";
import styles from "./AdminLogin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message || "Unable to sign in.");
      setLoading(false);
      return;
    }

    router.replace("/admin/products");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Admin access</p>
          <h1 className={styles.title}>Sign in to your account</h1>
          <p className={styles.subtitle}>
            Only the store owner account can access this area.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <div className={styles.inputWrap}>
              <FiMail className={styles.iconLeft} size={18} />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <FiLock className={styles.iconLeft} size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${styles.input} ${styles.inputWithEye}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {message && (
            <div className={styles.errorBox}>
              <FiAlertCircle size={16} className={styles.errorIcon} />
              <p>{message}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <FiLoader className={styles.spin} size={18} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}