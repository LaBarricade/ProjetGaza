export const toKebabCase = (str: string) =>
  str
    .replace(/\s+/g, "-")
    .replace(/,/g, "")
    .toLowerCase();
