import { BaserowPersonalityData } from "@/app/page";
import { Personality } from "@/app/personnalites/page";

async function getPersonalities() : Promise<BaserowPersonalityData> {

    //const url = process.env.BASEROW_URL;
    try {
        const result = await fetch(`/api/personalities`);
        if (!result.ok) throw new Error("Erreur fetch API");
        const personalities = await result.json();
        return personalities;


    } catch(err) {
        console.error("Erreur lors de la récupération des personnalités. Erreur : ", err);
        return {results: [], count: 0};
    }
}

async function getPersonalityById(id: number) : Promise<{count: number, results: Personality | null}> {

    //const url = process.env.BASEROW_URL;
    try {
        const result = await fetch(`/api/personalities/${id}`);
        if (!result.ok) throw new Error("Erreur fetch API");
        const personality = await result.json();
        return personality;
    } catch(err) {
        console.error(`Erreur lors de la récupération de la personnalité #${id}. Erreur : `, err);
        return {count: 0, results: null};
    }
}

export { getPersonalities, getPersonalityById };