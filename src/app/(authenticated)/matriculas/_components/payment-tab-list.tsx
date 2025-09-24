import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentsColumns } from "../constants/payments-columns";
import { DataTable } from "@/components/ui/data-table";
import { Payment } from "@/interfaces/payment";

const PaymentTabList = ({ payments = [] }: { payments: Payment[] }) => {
  return (
    <section className="flex flex-col h-full">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <article className="flex flex-col gap-1">
            <CardTitle>Pagamentos</CardTitle>
            <CardDescription>
              Gerencie os pagamentos das matrículas
            </CardDescription>
          </article>
        </section>
      </CardHeader>

      <DataTable columns={paymentsColumns} data={payments} scrollableY />
    </section>
  );
};

export { PaymentTabList };
