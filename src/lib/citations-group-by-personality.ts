import { Quote } from "@/components/card";

export type Personality = {
  prénom: string;
  nom: string;
  fullName: string;
  fullNameKebabLink: string;
  partiPolitique?: string;
  fonction?: string;
  citations: Quote[];
};

export const citationsByPersonality = (results: Quote[] | null): Personality[] | null => {
  if (!results) {
    return null;
  }

  const map = new Map<string, Personality>();

  for (const quote of results) {
    if (!quote.nom || !quote.prénom) continue

    const fullNameKebabLink = `${quote.prénom}-${quote.nom}`;

    if (!fullNameKebabLink) continue

    if (!map.has(fullNameKebabLink)) {
      map.set(fullNameKebabLink, {
        nom: quote.nom,
        prénom: quote.prénom,
        fullName: `${quote.prénom} ${quote.nom}`,
        fullNameKebabLink,
        partiPolitique: quote["Parti politique"].value,
        fonction: quote["Fonction"],
        citations: [quote],
      });
    } else {
      map.get(fullNameKebabLink)!.citations.push(quote);
    }
  }

  return Array.from(map.values());
}