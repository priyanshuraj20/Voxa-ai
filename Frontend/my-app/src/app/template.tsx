"use client";

import React from "react";
import { motion } from "framer-motion";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * Root Next.js template component.
 * Remounts on every client-side page navigation.
 * Manages page content fade-in transitions.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Premium cursor follow-ring dot */}
      <CustomCursor />

      {/* Page Content Fade-In Transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full min-h-screen flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </>
  );
}
