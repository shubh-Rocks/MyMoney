import { Home, BrainCircuit, Clock, HelpCircle, Sparkle } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "AI Dashboard", href: "/aiInsights", icon: BrainCircuit },
  { label: "Recent Payments", href: "/recentPayments", icon: Clock },
  {
    label: "Subscriptions",
    href: "/subscription",
    strokeWidth: 2.25,
    icon: Sparkle,
  },
  { label: "Help", href: "/help", icon: HelpCircle },
];
