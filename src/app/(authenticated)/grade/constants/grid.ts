export const DAY_NAMES = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
export const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const DAY_LABELS: Record<string, string> = {
  sunday: "Domingo",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
};

export const AGE_RANGE_OPTIONS = [
  { value: "Pré-Baby", label: "Pré-Baby" },
  { value: "Baby", label: "Baby" },
  { value: "Infantil", label: "Infantil" },
  { value: "Infanto-Juvenil", label: "Infanto-Juvenil" },
  { value: "Juvenil", label: "Juvenil" },
  { value: "Adulto", label: "Adulto" },
];

export const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 68; i++) {
    const hours = Math.floor(i / 4) + 7;
    const minutesValue = (i % 4) * 15;
    const minutes = minutesValue === 0 ? "00" : minutesValue.toString();
    const timeLabel = `${hours < 10 ? "0" : ""}${hours}:${minutes}`;
    options.push({ value: timeLabel, label: timeLabel });
  }
  return options;
};
