export const currencyToFloat = (value: string) => {
  if (!value) return 0;
  const cleaned = value.replace(/[R$\s.]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
};

export const floatToCurrency = (value: number) => {
  const cleaned = String(value).replace(/\D/g, "");

  const numericValue = parseFloat(cleaned) / 100;
  if (isNaN(numericValue)) return "";

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};
