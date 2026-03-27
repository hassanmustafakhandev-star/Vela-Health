import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, locale) {
  if (!date) return "";
  const d = new Date(date);
  return format(d, "dd MMM yyyy");
}

export function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return format(d, "h:mm a");
}

export function formatCurrency(amount) {
  if (amount == null) return "Rs. 0";
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatPhone(phone) {
  if (!phone) return "";
  // Formats to +92 3XX XXX XXXX if it starts with +92
  let s = phone.toString().replace(/[^0-9+]/g, "");
  if (s.startsWith("+92") && s.length === 13) {
    return `+92 ${s.slice(3, 6)} ${s.slice(6, 9)} ${s.slice(9, 13)}`;
  }
  return phone;
}

export function getUrgencyColor(level) {
  const norm = level?.toLowerCase();
  if (norm === "green") return "text-vela-safe-green";
  if (norm === "yellow") return "text-vela-warn-amber";
  if (norm === "red") return "text-vela-urgent-red";
  return "text-vela-primary";
}

export function getInitials(name) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
