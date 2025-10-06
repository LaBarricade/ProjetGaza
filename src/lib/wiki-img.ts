export async function getWikipediaImage(keyword: string) {
  const endpoint = "https://fr.wikipedia.org/w/api.php";

  const params = new URLSearchParams({
    action: "query",
    titles: keyword,
    prop: "pageimages",
    format: "json",
    origin: "*",        // nécessaire pour éviter les erreurs CORS
    pithumbsize: "600", // taille de l’image retournée
  });

  const url = `${endpoint}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const pages = data.query?.pages;
    if (!pages) return null;

    const firstPage = Object.values(pages)[0] as any;
    return firstPage?.thumbnail?.source || null;
  } catch (err) {
    console.error("Erreur Wikipédia:", err);
    return null;
  }
}