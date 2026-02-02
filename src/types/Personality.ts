import {Quote} from "@/types/Quote";
import {Party} from "@/types/Party";

export type Personality = {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    city: string;
    department: string;
    region: string;
    party?: Party;
    role?: string;
    quotes_count: number;
    quotes: Quote[];
};