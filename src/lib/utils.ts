import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard utility for merging tailwind classes efficiently in large projects
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
