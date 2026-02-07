"use client";

import { ImageOff } from "lucide-react";
import { cn } from "@/config/utils";

type ImageFallbackProps = {
  className?: string;
  variant?: "poster" | "avatar";
  label?: string;
};

export default function ImageFallback({
  className,
  variant = "poster",
  label = "No Image"
}: ImageFallbackProps) {
  const base =
    variant === "avatar"
      ? "rounded-full"
      : "rounded-lg";

  return (
    <div
      className={cn(
        "flex items-center justify-center text-center border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-500",
        base,
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <ImageOff className="h-6 w-6" />
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}
