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
    mandates?: any[];
    social1_url: string;
    social2_url: string;
    photo_url: string;
    public_contact: string;
};