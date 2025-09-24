export const normalizePhoneNumber = (phone: string) => {
  return phone.replace(/\D/g, "");
};

export const phoneNumberFormatter = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export const phoneNumberToWhatsApp = (phone: string) => {
  return `https://wa.me/${phone}`;
};