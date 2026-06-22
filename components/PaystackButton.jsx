"use client";

import { usePaystackPayment } from "react-paystack";

export default function PaystackButton({
  publicKey,
  config,
  onSuccess,
  onClose,
  disabled,
  label,
  onBeforePay,
}) {
  const initializePayment = usePaystackPayment({
    publicKey: publicKey || "",
  });

  const handleClick = () => {
    if (typeof onBeforePay === "function" && !onBeforePay()) {
      return;
    }
    initializePayment({
      config,
      onSuccess,
      onClose,
    });
  };

  return (
    <button
      className="pay-button"
      type="button"
      onClick={handleClick}
      disabled={disabled}
    >
      <span>{label}</span>
    </button>
  );
}