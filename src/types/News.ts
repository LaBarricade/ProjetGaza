import {Source} from "@/types/Source";

export type News = {
    id: number;
    text: string;
    link: string;
    source: Source | null;
    date: string;
};