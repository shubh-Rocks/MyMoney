"use client";

import React, { useState } from "react";
import {
  Users,
  CreditCard,
  MessageCircle,
  Mic,
  Brain,
  Rocket,
} from "lucide-react";

import HelpHeader from "@/components/dashboard/components/HelpHeader";
import HelpCategoriesGrid from "@/components/dashboard/components/HelpCategoriesGrid";
import HelpModals from "@/components/dashboard/components/HelpModals";

// Mock Data & Lists
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the basics and get your loan management workspace ready.",
    icon: Rocket,
    count: 4,
    articles: [
      {
        id: 101,
        title: "Setting up your account",
        description: "Configure your business profile and preferences.",
        readTime: "3 min read",
      },
      {
        id: 102,
        title: "Understanding the dashboard",
        description: "Navigate your financial metrics and summaries.",
        readTime: "4 min read",
      },
      {
        id: 103,
        title: "Adding your first borrower",
        description: "Step-by-step guide to onboarding new clients.",
        readTime: "3 min read",
      },
      {
        id: 104,
        title: "Creating your first loan",
        description: "Issue loans and set up repayment schedules.",
        readTime: "5 min read",
      },
    ],
  },
  {
    id: "borrowers",
    title: "Borrowers",
    description: "Manage borrower information and history.",
    icon: Users,
    count: 5,
    articles: [
      {
        id: 201,
        title: "Adding a borrower",
        description: "Quickly register new borrowers into the ledger.",
        readTime: "3 min read",
      },
      {
        id: 202,
        title: "Editing borrower information",
        description: "Update contact details and identification records.",
        readTime: "2 min read",
      },
      {
        id: 203,
        title: "Viewing borrower history",
        description: "Inspect past transactions, repayments, and notes.",
        readTime: "4 min read",
      },
      {
        id: 204,
        title: "Searching borrowers",
        description: "Use advanced filters to find specific clients instantly.",
        readTime: "2 min read",
      },
      {
        id: 205,
        title: "Managing borrower details",
        description: "Keep your client logs clean and organized.",
        readTime: "3 min read",
      },
    ],
  },
  {
    id: "loans",
    title: "Loans",
    description:
      "Learn how to create loans, record payments and track outstanding balances.",
    icon: CreditCard,
    count: 6,
    articles: [
      {
        id: 301,
        title: "Creating a loan",
        description: "Set principal amounts, interest, and terms.",
        readTime: "4 min read",
      },
      {
        id: 302,
        title: "Understanding loan status",
        description: "Active, overdue, settled, and pending states.",
        readTime: "3 min read",
      },
      {
        id: 303,
        title: "Tracking outstanding amounts",
        description: "Monitor what is due and what has been collected.",
        readTime: "3 min read",
      },
      {
        id: 304,
        title: "Setting due dates",
        description: "Automate calendar schedules and deadlines.",
        readTime: "2 min read",
      },
      {
        id: 305,
        title: "Marking a loan as overdue",
        description: "Handle delayed payments efficiently.",
        readTime: "3 min read",
      },
      {
        id: 306,
        title: "Settling a loan",
        description: "Close fully paid loan accounts securely.",
        readTime: "3 min read",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Record payments, track history, and manage settlements.",
    icon: CreditCard,
    count: 5,
    articles: [
      {
        id: 401,
        title: "Recording a payment",
        description: "Log cash, UPI, or bank transfers against active loans.",
        readTime: "3 min read",
      },
      {
        id: 402,
        title: "Understanding payment history",
        description: "Review ledger logs and transaction receipts.",
        readTime: "3 min read",
      },
      {
        id: 403,
        title: "Partial payments",
        description: "Accept and track installments safely.",
        readTime: "3 min read",
      },
      {
        id: 404,
        title: "Full settlement",
        description: "Complete account closure upon final payment.",
        readTime: "2 min read",
      },
      {
        id: 405,
        title: "Payment methods",
        description: "Support for cash, bank transfer, and digital channels.",
        readTime: "3 min read",
      },
    ],
  },
  {
    id: "ai-business",
    title: "AI Business",
    description:
      "Learn how AI helps you understand your portfolio and make decisions.",
    icon: Brain,
    count: 6,
    articles: [
      {
        id: 501,
        title: "AI Business Dashboard",
        description: "Real-time automated insights into cash flow.",
        readTime: "6 min read",
      },
      {
        id: 502,
        title: "Cash flow prediction",
        description: "Forecast upcoming collections and risks.",
        readTime: "5 min read",
      },
      {
        id: 503,
        title: "AI business insights",
        description: "Actionable tips to improve recovery rates.",
        readTime: "4 min read",
      },
      {
        id: 504,
        title: "Asking questions about your business",
        description: "Query your data in natural language.",
        readTime: "3 min read",
      },
      {
        id: 505,
        title: "AI repayment plans",
        description: "Smart restructuring options for borrowers.",
        readTime: "4 min read",
      },
      {
        id: 506,
        title: "AI communication analysis",
        description: "Analyze customer intent from replies.",
        readTime: "4 min read",
      },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp & Communication",
    description: "Automate reminders and analyze borrower chats.",
    icon: MessageCircle,
    count: 6,
    articles: [
      {
        id: 601,
        title: "Connecting WhatsApp",
        description: "Link your business WhatsApp account.",
        readTime: "3 min read",
      },
      {
        id: 602,
        title: "Receiving borrower messages",
        description: "Centralized inbox for inbound chats.",
        readTime: "3 min read",
      },
      {
        id: 603,
        title: "AI message analysis",
        description: "Detect sentiment and payment intent automatically.",
        readTime: "4 min read",
      },
      {
        id: 604,
        title: "Payment promises",
        description: "Track when borrowers commit to paying.",
        readTime: "3 min read",
      },
      {
        id: 605,
        title: "Delay requests",
        description: "Manage extension asks smoothly.",
        readTime: "3 min read",
      },
      {
        id: 606,
        title: "Risk signals",
        description: "Identify high-risk customer behavior early.",
        readTime: "4 min read",
      },
    ],
  },
  {
    id: "voice",
    title: "Voice Assistant",
    description: "Create borrowers and loans hands-free using voice.",
    icon: Mic,
    count: 5,
    articles: [
      {
        id: 701,
        title: "Using voice input",
        description: "Activate speech recognition in the app.",
        readTime: "2 min read",
      },
      {
        id: 702,
        title: "Creating borrowers with voice",
        description: "Dictate names and numbers instantly.",
        readTime: "3 min read",
      },
      {
        id: 703,
        title: "Creating loans with voice",
        description: "Speak loan amounts and terms naturally.",
        readTime: "3 min read",
      },
      {
        id: 704,
        title: "Supported languages",
        description: "English, Hindi, and Hinglish voice processing.",
        readTime: "2 min read",
      },
      {
        id: 705,
        title: "Reviewing AI extracted information",
        description: "Verify parsed voice data before saving.",
        readTime: "3 min read",
      },
    ],
  },
];

const faqList = [
  {
    q: "What is a partially paid loan?",
    a: "A partially paid loan is an active credit account where the borrower has made one or more installments...",
  },
  {
    q: "How is remaining amount calculated?",
    a: "The remaining balance is automatically calculated by subtracting all successful payments...",
  },
  {
    q: "What happens when a loan becomes overdue?",
    a: "When a due date passes without full payment, the system flags the loan status as 'Overdue'...",
  },
  {
    q: "How do I settle a loan?",
    a: "Open the specific loan record, click 'Record Payment', enter the final remaining balance...",
  },
  {
    q: "Can I edit borrower information?",
    a: "Yes, you can easily update a borrower's phone number, address, and profile notes...",
  },
  {
    q: "How does the AI Business Dashboard work?",
    a: "The AI Business Dashboard analyzes your historical transaction patterns...",
  },
  {
    q: "How does cash flow prediction work?",
    a: "Our machine learning models evaluate past borrower payment punctuality...",
  },
  {
    q: "How does voice-based loan creation work?",
    a: "By tapping the microphone icon, you can speak naturally in English, Hindi, or Hinglish...",
  },
  {
    q: "How does WhatsApp AI analysis work?",
    a: "Incoming borrower messages on WhatsApp are scanned by our NLP models...",
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. All sensitive ledger and borrower data is encrypted in transit and at rest...",
  },
];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportType, setSupportType] = useState("contact");
  const [supportFormSubmitted, setSupportFormSubmitted] = useState(false);

  const handleAiAsk = (questionText) => {
    const q = questionText || aiQuestion;
    if (!q.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setToastMessage(`AI Answer generated for: "${q}"`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSupportFormSubmitted(true);
    setTimeout(() => {
      setSupportFormSubmitted(false);
      setSupportModalOpen(false);
      setToastMessage("Your request has been submitted successfully.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-gray-900 flex flex-col font-sans antialiased selection:bg-[#10B981]/20 selection:text-[#10B981]">
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        <HelpHeader
          aiQuestion={aiQuestion}
          setAiQuestion={setAiQuestion}
          handleAiAsk={handleAiAsk}
          aiLoading={aiLoading}
        />

        <HelpCategoriesGrid
          helpCategories={helpCategories}
          faqList={faqList}
          setSelectedCategory={setSelectedCategory}
          setSupportType={setSupportType}
          setSupportModalOpen={setSupportModalOpen}
        />
      </main>

      <HelpModals
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        supportModalOpen={supportModalOpen}
        setSupportModalOpen={setSupportModalOpen}
        supportType={supportType}
        supportFormSubmitted={supportFormSubmitted}
        handleSupportSubmit={handleSupportSubmit}
        toastMessage={toastMessage}
      />
    </div>
  );
}
