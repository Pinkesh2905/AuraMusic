"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const theme = "dark";

  useEffect(() => {
    try {
      document.documentElement.className = "dark";
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    // Pure Dark Mode lock
  };

  return {
    theme: "dark" as const,
    toggleTheme,
    isDark: true,
  };
}
