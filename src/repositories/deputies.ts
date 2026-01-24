import { BaserowPersonalityData } from "@/app/page";

async function getDeputies() : Promise<BaserowPersonalityData> {

    //const url = process.env.BASEROW_URL;
    try {
        const result = await fetch(`/api/deputies`);
        if (!result.ok) throw new Error("Erreur fetch API deputés");
        const personalities = await result.json();
        return personalities;


    } catch(err) {
        console.error("Erreur lors de la récupération des personnalités. Erreur : ", err);
        return {results: [], count: 0};
    }
}
