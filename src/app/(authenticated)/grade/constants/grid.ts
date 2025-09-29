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
  { value: "Baby", label: "Baby" },
  { value: "Infantil", label: "Infantil" },
  { value: "Juvenil", label: "Juvenil" },
  { value: "Adulto", label: "Adulto" },
];

export const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 33; i++) {
    const hours = Math.floor(i / 2) + 7;
    const minutes = i % 2 === 0 ? "00" : "30";
    const timeLabel = `${hours < 10 ? "0" : ""}${hours}:${minutes}`;
    options.push({ value: timeLabel, label: timeLabel });
  }
  return options;
};
