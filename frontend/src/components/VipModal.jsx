import React, { useState } from "react";

// This is a demo for integrating Flutterwave payment (supports M-Pesa, card, mobile money, etc.)
// In production, use environment variables for your public key and verify payments on the backend!

export default function VipModal({ open, onClose, onUpgrade, isVip }) {
  // Replace with your real Flutterwave public key
  const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyPayment = async (transaction_id, tx_ref) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id, tx_ref })
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        onUpgrade();
        alert("Payment verified! You are now a VIP member.");
        onClose();
      } else {
        setError(data.message || "Payment verification failed. Please contact support.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlutterwavePay = () => {
    if (!window.FlutterwaveCheckout) {
      alert("Flutterwave script not loaded. Please check your internet connection.");
      return;
    }
    window.FlutterwaveCheckout({
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: "RGFlingVIP-" + Date.now(),
      amount: 1.19,
      currency: "USD",
      payment_options: "card,mpesa,banktransfer,ussd,barter,account,credit",
      customer: {
        email: "user@example.com",
        phonenumber: "",
        name: "RG Fling User"
      },
      customizations: {
        title: "RG Fling VIP Membership",
        description: "Unlock premium features for $1.19/month",
        logo: "/rg_fling_logo.svg"
      },
      callback: function (response) {
        if (response.status === "successful") {
          // Call backend to verify payment
          verifyPayment(response.transaction_id, response.tx_ref);
        } else {
          alert("Payment not completed.");
        }
      },
      onclose: function () {
        // User closed payment modal
      }
    });
  };

  React.useEffect(() => {
    if (!window.FlutterwaveCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gradient-primary">VIP Membership</h2>
        {loading && <div className="text-center text-blue-500 mb-2">Verifying payment...</div>}
        {error && <div className="text-center text-red-500 mb-2">{error}</div>}
        {isVip ? (
          <div className="text-green-600 text-center font-semibold mb-4">You are already a VIP member! 🎉</div>
        ) : (
          <>
            <p className="mb-4 text-center">Unlock premium features, exclusive content, and priority support for just <b>$1.19/month</b>!</p>
            <button onClick={handleFlutterwavePay} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded transition-colors" disabled={loading}>
              Pay with Card, M-Pesa, or Mobile Money
            </button>
          </>
        )}
      </div>
    </div>
  );
}
