export async function getPoliticalPortrait(fullName: string) {
  const endpoint = "https://query.wikidata.org/sparql";

  // Requête SPARQL : on cherche une personne (Q5) avec un label FR égal au nom complet
  const query = `
    SELECT ?image WHERE {
      ?person wdt:P31 wd:Q5;        # instance of human
              rdfs:label "${fullName.split(',').reverse().join(' ').trim()}"@fr;
              wdt:P18 ?image.        # propriété image
    } LIMIT 1
  `;

  const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/sparql-results+json" }
    });
    const data = await res.json();
    
    if (
      data.results.bindings.length > 0 &&
      data.results.bindings[0].image
    ) {
      return data.results.bindings[0].image.value;
    } else {
      return null; // pas trouvé
    }
  } catch (err) {
    console.error("Erreur Wikidata:", err);
    return null;
  }
}

// // Exemple d'utilisation :
// getPoliticalPortrait("Emmanuel Macron").then(url => {
//   console.log("Image URL:", url);
// });
