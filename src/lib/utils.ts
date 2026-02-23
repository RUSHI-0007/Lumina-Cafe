import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx for conditional class names.
 * @param inputs - Class values to merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
