import { BaserowData } from "@/app/citations/page";

async function getQuotes(): Promise<BaserowData> {

    //const url = process.env.BASEROW_URL;
    try {
      const result = await fetch(`/api/baserow`);
        if (!result.ok) throw new Error("Erreur fetch API");
        const quotes = await result.json();
        return quotes;


    } catch(err) {
        console.error("Erreur lors de la récupération des citations. Erreur : ", err);
        return {results: [], count: 0, next: null, previous: null};
    }
}

async function getQuoteById(id: number) {

    //const url = process.env.BASEROW_URL;
    try {
        const result = await fetch(`/api/baserow?size=1`);
        if (!result.ok) throw new Error("Erreur fetch API");
        const quote = await result.json();
        return quote;
    } catch(err) {
        console.error(`Erreur lors de la récupération de la citation #${id}. Erreur : `, err);
        return {count: 0, results: null, next: null, previous: null};
    }
}

export { getQuotes, getQuoteById };