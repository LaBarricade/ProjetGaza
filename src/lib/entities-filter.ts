import {Tag} from "@/types/Tag";
import {Party} from "@/types/Party";
import {MandateType} from "@/types/MandateType";
import {Personality} from "@/types/Personality";
import {Filters} from "@/types/Filters";
import {Territory} from "@/types/Territory";
import {useMemo} from "react";
import {getDbService} from "@/lib/backend/db-service";

export type FiltersList = {
    tags?: Tag[];
    text?: string;
    parties?: Party[];
    roles?: MandateType[];
    personalities?: Personality[];
    departments?: Territory[];
}

export type FiltersDto = {
    [key in keyof FiltersList]?: FiltersList[key] extends string | undefined ? string : string[];
}

export type FiltersUrlParams = {
    [key in keyof FiltersList]?: string
}

export class EntitiesFilter {
    filtersPopulated: FiltersList = {};
    filtersDto: FiltersDto = {};

    constructor() {
    }

    setFilterValue(name: keyof FiltersDto, value: any) {
        this.filtersDto[name] = value;
    }

    toDto(): FiltersDto {
        return this.filtersDto;
    }

    toUrlParams() {

    }

    fromUrlParams(urlParams: FiltersUrlParams) {

        // Handle text search
        if (urlParams.text) {
            this.filtersDto.text = urlParams.text;
        }

        (['tags', 'parties', 'roles', 'personalities', 'departments'] as const).forEach((key) => {
            if (urlParams[key] as FiltersUrlParams[typeof key]) {
                const ids = this.parseUrlIdParam(urlParams[key]);
                this.filtersDto[key] = ids;
            }
        })
    }

    async populateFilterEntities() {
        // Handle tags (multiple)
        if (this.filtersDto.tags) {
            if (this.filtersDto.tags.length > 0) {
                const apiResp = await getDbService().findTags({
                    ids: this.filtersDto.tags.map((id) => parseInt(id, 10)),
                });
                this.filtersPopulated.tags = apiResp.items;
            }
        }

        // Handle parties (multiple)
        if (this.filtersDto.parties) {
            const partyIds = this.filtersDto.parties;
            if (partyIds.length > 0) {
                const parties: Party[] = [];
                for (const id of partyIds) {
                    const apiResp = await getDbService().findParty(id);
                    if (apiResp.item) {
                        parties.push(apiResp.item);
                    }
                }
                this.filtersPopulated.parties = parties;
            }
        }

        // Handle text search
        if (this.filtersDto.text) {
            this.filtersPopulated.text = this.filtersDto.text;
        }

        // Handle roles (multiple)
        if (this.filtersDto.roles) {
            const roleIds = this.filtersDto.roles;
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
                this.filtersPopulated.roles = roles;
            }
        }

        // Handle personalities (multiple)
        if (this.filtersDto.personalities) {
            const personalityIds = this.filtersDto.personalities;
            if (personalityIds.length > 0) {
                const apiResp = await getDbService().findPersonalities({
                    ids: personalityIds,
                });
                this.filtersPopulated.personalities = apiResp.items || [];
            }
        }

        // Departments are plain strings — no DB resolution needed, just parse from URL
        if (this.filtersDto.departments) {
            const departmentIds = this.filtersDto.departments;
            if (departmentIds.length > 0) {
                const apiResp = await getDbService().findTerritories({
                    type: 'departement',
                    ids: departmentIds,
                });
                this.filtersPopulated.departments = apiResp.items || [];
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

    countActiveFilters() {
        return Object.values(this.filtersDto).reduce(
            (prev, curr) => prev + (Array.isArray(curr) ? curr.length : (curr ? 1 : 0))
            , 0);
    }

    hasActiveFilters() {
        return this.countActiveFilters() > 0;
    }

    static fromUrlParams(urlParams: FiltersUrlParams): EntitiesFilter {
        const inst = new EntitiesFilter();
        inst.fromUrlParams(urlParams);
        return inst;
    }
}

