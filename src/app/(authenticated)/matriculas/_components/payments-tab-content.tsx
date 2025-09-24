import { Payment } from "@/interfaces/payment";
import { usePaymentTab } from "@/contexts/payment-tab-context";
import { PaymentTabEdit } from "./payment-tab-edit";
import { PaymentTabList } from "./payment-tab-list";

export const PaymentsTabContent = ({
  payments = [],
}: {
  payments: Payment[];
}) => {
  const { isEditingPayment } = usePaymentTab();
  const View = isEditingPayment ? PaymentTabEdit : PaymentTabList;

  return (
    <section className="flex flex-col h-[480px]">
      <View payments={payments} />
    </section>
  );
};
