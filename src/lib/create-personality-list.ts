import { Personality } from "@/app/personnalites/page";
import { Quote } from "@/components/card";

export const createPersonalityList = (results: Quote[] | null) => {
  if (!results) {
    return null;
  }

  const map = new Map<string, Personality>();

  for (const r of results) {
    const nom = r["Personnalité politique"];

    if (!nom) continue

    if (!map.has(nom)) {
      map.set(nom, {
        nom,
        partiPolitique: r["Parti politique"],
        fonction: r["Fonction"],
        citations: [r],
      });
    } else {
      map.get(nom)!.citations.push(r);
    }
  }

  return Array.from(map.values());
}