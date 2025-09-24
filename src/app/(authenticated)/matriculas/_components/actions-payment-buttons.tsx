import { Button } from "@/components/ui/button";
import { usePaymentTab } from "@/contexts/payment-tab-context";
import { Payment } from "@/interfaces/payment";
import { DollarSignIcon, Loader2, Pencil, Undo } from "lucide-react";
import React from "react";

export default function ActionsPaymentButtons({
  payment,
  hideEditButton = false,
}: {
  payment: Payment;
  hideEditButton?: boolean;
}) {
  const { openEditPaymentForm, togglePaymentStatusMutation } = usePaymentTab();
  const isPaid = payment.status === "PAID";
  const isPending = payment.status === "PENDING";
  const isOverdue = payment.status === "OVERDUE";

  return (
    <section className="flex gap-2">
      {!hideEditButton && (
        <Button
          onClick={() => openEditPaymentForm(payment)}
          variant="outline"
          size="icon"
          className="border-blue-500 text-blue-500 bg-blue-50"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
      {isPending ||
        (isOverdue && (
          <Button
            onClick={() => togglePaymentStatusMutation.mutate(payment)}
            variant="outline"
            disabled={togglePaymentStatusMutation.isPending}
            size="icon"
            className="border-green-500 text-green-500 bg-green-50"
          >
            {togglePaymentStatusMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <DollarSignIcon className="w-4 h-4" />
            )}
          </Button>
        ))}
      {isPaid && (
        <Button
          onClick={() => togglePaymentStatusMutation.mutate(payment)}
          variant="outline"
          disabled={togglePaymentStatusMutation.isPending}
          size="icon"
          className="border-yellow-500 text-yellow-500 bg-yellow-50"
        >
          {togglePaymentStatusMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Undo className="w-4 h-4" />
          )}
        </Button>
      )}
    </section>
  );
}
