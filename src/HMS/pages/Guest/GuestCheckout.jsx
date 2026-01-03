import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const quotes = [
  "Good food = Good mood 🍴",
  "Eat well, live long.",
  "Food is the ingredient that binds us together.",
  "One cannot think well if one has not dined well.",
  "Life is short, eat dessert first 🍩",
  "Happiness is homemade.",
  "Where there is good food, there is happiness.",
  "Eat, laugh, love ❤️",
  "Nothing brings people together like food.",
  "A full stomach makes for a happy heart.",
];

const GuestCheckout = () => {
  const [orders, setOrders] = useState([]);
  const [billDate, setBillDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("guestOrders")) || [];
    setOrders(data);
    setBillDate(new Date().toLocaleString());
  }, []);

  const subtotal = orders.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleRequestBill = () => {
    try {
      const params = new URLSearchParams(location.search);
      const table =
        localStorage.getItem("guest_table_number") ||
        params.get("table") ||
        "Unknown";
      const tableId =
        localStorage.getItem("guest_table_id") || params.get("id") || null;

      const entry = {
        table,
        tableId,
        total,
        timestamp: new Date().toISOString(),
      };

      const existing = JSON.parse(
        localStorage.getItem("guest_bill_requests") || "[]"
      );
      existing.push(entry);
      localStorage.setItem("guest_bill_requests", JSON.stringify(existing));

      // Clear guest session
      localStorage.removeItem("guestOrders");
      localStorage.removeItem("guest_table_number");
      localStorage.removeItem("guest_table_id");
      localStorage.removeItem("guest_last_otp");

      navigate("/GuestLogin");

      toast.success("📢 Bill request sent to admin! Redirecting...");

      setTimeout(() => {
        // navigate("/guest-login");
        navigate("/GuestLogin");
      }, 800);
    } catch (e) {
      toast.error("Failed to request bill. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-xl font-bold text-center mb-2">🏨 Hotel Xtown</h1>
        <p className="text-sm text-center text-gray-600 mb-4">{billDate}</p>
        <hr />

        {/* Bill Items */}
        {orders.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between text-sm py-2 border-b border-gray-200"
          >
            <span>
              {item.name} x {item.qty}
            </span>
            <span>₹ {(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        {/* Totals */}
        <div className="mt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Quote */}
        <p className="text-center text-gray-600 italic mt-6">"{randomQuote}"</p>

        {/* Request Bill Button */}
        <button
          onClick={handleRequestBill}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-6"
        >
          Request Physical Bill
        </button>
      </div>
    </div>
  );
};

export default GuestCheckout;
