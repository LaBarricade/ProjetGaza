export const toKebabCase = (str: string) =>
  str
    .normalize("NFD") // enlève les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .toLowerCase();
