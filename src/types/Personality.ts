import {Quote} from "@/types/Quote";
import {Party} from "@/types/Party";
import slugify from "slugify";
import {getWikipediaImage} from "@/lib/wiki-img";

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

export type PersonalityViewModel = Personality & {
    getSlug(): string,
    getFullName(): string,
    getImageUrl(): Promise<string|null>,
    getUrl(): string
}

export function createPersonalityViewModel(p: Personality): PersonalityViewModel {
    return {
        ...p,
        getFullName() {
            return `${this.firstname} ${this.lastname}`
        },
        getSlug() {
            return slugify(this.getFullName())
        },
        async getImageUrl() {
            return await getWikipediaImage(this.getFullName())
        },
        getUrl() {
            return `/personnalites/${this.id}-${this.getSlug()}`;
        }
    }
}