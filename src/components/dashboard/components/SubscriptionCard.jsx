"use client";
import React, { useState } from "react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const SubscriptionCard = ({ title, text, money, button, isFirstButton }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const numericAmount = parseFloat(money.replace(/[^0-9.]/g, "")) || 0;

    if (numericAmount === 0) {
      alert("Free plan selected successfully!");
      return;
    }

    setLoading(true);
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to create order");

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MyMoney App",
        description: `${title} Subscription`,
        order_id: order.id,
        handler: function (response) {
          alert(
            `Payment Successful! Payment ID: ${response.razorpay_payment_id}`,
          );
          // Yahan aap payment success hone ke baad database update ya verification kar sakte hain
        },
        prefill: {
          name: "Shubh Mishra",
          email: "shubh@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#059669",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl w-90 px-5 py-3 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-2xl">{title}</h2>
      <span className="font-normal text-xs text-gray-500">{text}</span>

      <div className="flex my-5 items-baseline space-x-1">
        <span className="text-4xl font-extrabold text-gray-900">{money}</span>
        <span className="text-sm font-medium text-gray-500">/month</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`px-5 py-2 w-full rounded-xl cursor-pointer transition-all disabled:opacity-50 ${
            isFirstButton
              ? "m-3 text-green-600 border border-green-600 hover:bg-green-50"
              : "m-3 text-white bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : button}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
