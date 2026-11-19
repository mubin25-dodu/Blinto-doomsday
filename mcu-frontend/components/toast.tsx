"use client";
import { useEffect } from "react";

export type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, onClose, duration }: ToastProps) {
  useEffect(() => {
    if (!duration) return;

    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 16,
        maxWidth: 360,
        padding: "12px 14px",
        borderRadius: 8,
        background: "#1f2937",
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        style={{
          border: 0,
          background: "transparent",
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          lineHeight: 1,
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
