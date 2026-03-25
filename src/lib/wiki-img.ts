export async function getWikipediaImage(keyword: string, throwErrors = false) {
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
        const res: Response = await fetch(url);
        if (res.status === 429)
            throw new Error('Too many requests');
        if (!res.ok)
            throw new Error(`Status ${res.status} : ${res.statusText}`);

        const data = await res.json();

        const pages = data.query?.pages;
        if (!pages) return null;

        const firstPage = Object.values(pages)[0] as { thumbnail: { source: string } };
        return firstPage?.thumbnail?.source || null;
    } catch (err) {
        if (!throwErrors) {
            console.error("Erreur Wikipédia:", err);
            return null;
        }
        else
            throw err;
    }
}