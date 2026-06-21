"use client";

import { Toaster } from "react-hot-toast";

export default function GlobalToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3200,
        style: {
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.12)",
          padding: "14px 16px",
        },
        success: {
          iconTheme: {
            primary: "var(--accent)",
            secondary: "var(--bg-primary)",
          },
        },
        error: {
          iconTheme: {
            primary: "#B45309",
            secondary: "var(--bg-primary)",
          },
        },
      }}
    />
  );
}