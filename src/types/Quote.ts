import {Personality} from "@/types/Personality";
import {Tag} from "@/types/Tag";
import {Source} from "@/types/Source";

export type Quote = {
  id: number;
  text: string;
  date: string;
  source?: Source;
  link: string;
  tags: Tag[];
  personality?: Personality;
};
