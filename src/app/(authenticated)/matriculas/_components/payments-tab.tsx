import React from "react";
import { Payment } from "@/interfaces/payment";
import { PaymentTabProvider } from "@/contexts/payment-tab-context";
import { PaymentsTabContent } from "./payments-tab-content";

export function PaymentsTab({ payments = [] }: { payments: Payment[] }) {
  return (
    <PaymentTabProvider>
      <PaymentsTabContent payments={payments} />
    </PaymentTabProvider>
  );
}
