import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { usePaymentTab } from "@/contexts/payment-tab-context";
import { FormInput } from "@/components/forms/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentSchema, paymentSchema } from "../schemas/payment";
import { Form } from "@/components/ui/form";

import { currencyToFloat, floatToCurrency } from "@/utils/parse-currency";
import { dateStringToDate, dateToString } from "@/utils/parse-date";

const PaymentTabEdit = () => {
  const {
    currentPayment,
    closeEditPaymentForm,
    updatePaymentMutation,
    deletePaymentMutation,
  } = usePaymentTab();
  const form = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    values: {
      dueDate: dateToString(currentPayment?.dueDate || new Date()),
      amount: floatToCurrency((currentPayment?.amount || 0) * 100),
    },
  });

  const onSubmit = (data: PaymentSchema) => {
    const parsedDate = dateStringToDate(data.dueDate);
    if (!parsedDate || !currentPayment) return;

    updatePaymentMutation.mutate({
      ...currentPayment,
      amount: currencyToFloat(data.amount),
      dueDate: parsedDate,
    });
  };

  return (
    <section className="flex flex-col h-full">
      <CardHeader className="mb-6 gap-1 w-full px-0">
        <section className="flex flex-row gap-1">
          <Button variant="ghost" onClick={() => closeEditPaymentForm()}>
            <ChevronLeft size={18} />
          </Button>
          <article className="flex flex-col gap-1">
            <CardTitle>Editar Pagamento</CardTitle>
            <CardDescription>
              Edite o pagamento: (Plano: {currentPayment?.planName} -
              Modalidade: {currentPayment?.modality})
            </CardDescription>
          </article>
        </section>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-full"
        >
          <section className="grid grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="dueDate"
              label="Data de vencimento"
              mask="99/99/2099"
              maskOptions={{
                placeholder: "__/__/____",
                showMaskOnHover: true,
              }}
            />
            <FormInput control={form.control} name="amount" label="Valor" />
          </section>

          <section className="flex gap-2 justify-end items-end h-full">
            <Button
              disabled={
                updatePaymentMutation.isPending ||
                deletePaymentMutation.isPending
              }
              className="w-30"
              variant="destructive"
              type="button"
              onClick={() => deletePaymentMutation.mutate(currentPayment!)}
            >
              {deletePaymentMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Deletar"
              )}
            </Button>
            <Button
              disabled={updatePaymentMutation.isPending}
              className="w-30"
              type="submit"
            >
              {updatePaymentMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </section>
        </form>
      </Form>
    </section>
  );
};

export { PaymentTabEdit };
