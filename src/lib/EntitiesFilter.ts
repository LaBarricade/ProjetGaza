import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {MandateType} from "@/types/MandateType";
import {Personality} from "@/types/Personality";
import {getDbService} from "@/lib/backend/db-service";
import {Filters} from "@/types/Filters";
import {Territory} from "@/types/Territory";

type FiltersList = {
    tags?: Tag[];
    text?: string;
    parties?: Party[];
    roles?: MandateType[];
    personalities?: Personality[];
    departments?: Territory[];
}

export type FiltersDto = {
    tag?: string[];
    text?: string;
    personality?: string[];
    party?: string[];
    role?: string[];
    department?: string[];
};


export type FiltersUrlParams = {
    tag?: string;
    text?: string;
    personality?: string;
    party?: string;
    role?: string;
    department?: string;
    //page?: string;
    //size?: string;
}

export class EntitiesFilter {
    filters: FiltersList;

    constructor(filters: FiltersList = {}) {
        this.filters = filters;
    }

    setFilterValue(name: keyof FiltersList, value: any) {
        this.filters[name] = value;
    }

    toDto(): FiltersDto {
        const dto: FiltersDto = {}

        // Handle tags (multiple)
        if (this.filters.tags && this.filters.tags.length > 0) {
            dto.tag = this.filters.tags.map((t) => t.id.toString());
        }

        // Handle text search
        if (this.filters.text) {
            dto.text = this.filters.text;
        }

        // Handle parties (multiple)
        if (this.filters.parties && this.filters.parties.length > 0) {
            dto.party = this.filters.parties.map((p) => p.id.toString());
        }

        // Handle roles (multiple)
        if (this.filters.roles && this.filters.roles.length > 0) {
            dto.role = this.filters.roles.map((r) => r.id.toString());
        }

        // Handle personalities (multiple)
        if (this.filters.personalities && this.filters.personalities.length > 0) {
            dto.personality = this.filters.personalities.map((p) => p.id.toString());
        }

        return dto;
    }

    toUrlParams() {

    }

    async fromUrlParams(urlParams: FiltersUrlParams) {
        // Handle tags (multiple)
        if (urlParams.tag) {
            const tagIds = this.parseUrlIdParam(urlParams.tag);
            if (tagIds.length > 0) {
                const apiResp = await getDbService().findTags({
                    ids: tagIds.map((id) => parseInt(id, 10)),
                });
                this.filters.tags = apiResp.items;
            }
        }

        // Handle parties (multiple)
        if (urlParams.party) {
            const partyIds = this.parseUrlIdParam(urlParams.party);
            if (partyIds.length > 0) {
                const parties: Party[] = [];
                for (const id of partyIds) {
                    const apiResp = await getDbService().findParty(id);
                    if (apiResp.item) {
                        parties.push(apiResp.item);
                    }
                }
                this.filters.parties = parties;
            }
        }

        // Handle text search
        if (urlParams.text) {
            this.filters.text = urlParams.text;
        }

        // Handle roles (multiple)
        if (urlParams.role) {
            const roleIds = this.parseUrlIdParam(urlParams.role);
            if (roleIds.length > 0) {
                const roles: MandateType[] = [];
                for (const id of roleIds) {
                    const roleId = parseInt(id, 10);
                    if (!isNaN(roleId)) {
                        const apiResp = await getDbService().findMandateType(roleId);
                        if (apiResp.item) {
                            roles.push(apiResp.item);
                        }
                    }
                }
                this.filters.roles = roles;
            }
        }

        // Handle personalities (multiple)
        if (urlParams.personality) {
            const personalityIds = this.parseUrlIdParam(urlParams.personality);
            if (personalityIds.length > 0) {
                const apiResp = await getDbService().findPersonalities({
                    ids: personalityIds,
                });
                this.filters.personalities = apiResp.items || [];
            }
        }

        // Departments are plain strings — no DB resolution needed, just parse from URL
        if (urlParams.department) {
            const departmentIds = this.parseUrlIdParam(urlParams.department);
            if (departmentIds.length > 0) {
                const apiResp = await getDbService().findTerritories({
                    type: 'departement',
                    ids: departmentIds,
                });
                this.filters.departments = apiResp.items || [];
            }
        }
    }

    parseUrlIdParam(param: string | undefined): string[] {
        if (!param) return [];
        return param
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);
    }

}


