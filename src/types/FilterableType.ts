import {Organization} from "@/types/Organization";
import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {MandateType} from "@/types/MandateType";
import {Territory} from "@/types/Territory";
import {Personality} from "@/types/Personality";

export type FilterableType = (MandateType | Organization | Party | Tag | Territory | Personality) & {
    quotes_count?: number
} ;