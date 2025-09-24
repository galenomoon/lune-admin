export function dateToString(isoDate: string | Date): string {
  if (!isoDate) return "";

  let date: Date;
  if (typeof isoDate === "string") {
    date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
  } else {
    date = isoDate;
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const dateStringToDate = (dateString: string) => {
  if (!dateString) return null;

  const regex = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return null;

  const [_, day, month, year] = match;

  return new Date(`${year}-${month}-${day}T00:00:00Z`);
};
