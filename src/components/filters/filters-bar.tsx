'use client';

import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {
    Briefcase,
    Building2, ChevronDown, Funnel,
    LucideProps,
    MapPin,
    Search,
    Tag as TagIcon,
    UserRound
} from 'lucide-react';
import {Personality} from '@/types/Personality';
import {Tag as TagType} from '@/types/Tag';
import {Party} from '@/types/Party';
import {ForwardRefExoticComponent, RefAttributes, useState} from 'react';
import {MandateType} from '@/types/MandateType';
import {Territory} from '@/types/Territory';
import {TextFilter} from './text-filter';
import {OptionsFilter} from '@/components/filters/options-filter';
import {useSearchFilters} from './useSearchFilters';

type FiltersBarConfig = {
    showPersonalities?: boolean;
    showMandates?: boolean;
    showText?: boolean;
    showTags?: boolean;
    showParties?: boolean;
    showDepartments?: boolean;
    layout?: 'horizontal' | 'vertical';
    textFilterConfig?: {
        headerTitle?: string | false;
        icon?: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;
        inputPlaceholder?: string;
    };
};

const DEFAULT_CONFIG: Required<FiltersBarConfig> = {
    showPersonalities: true,
    showMandates: true,
    showText: true,
    showTags: true,
    showParties: true,
    showDepartments: true,
    layout: 'horizontal',
    textFilterConfig: {
        headerTitle: 'Rechercher',
        icon: Search,
        inputPlaceholder: 'Rechercher...',
    },
};

export function FiltersBar({
    personalitiesList,
    tagsList,
    mandateTypesList,
    departmentsList,
    partiesList,
    pageName,
    alwaysVisible = true,
    config: userConfig,
}: {
    personalitiesList: Personality[];
    tagsList?: TagType[];
    mandateTypesList?: MandateType[];
    departmentsList?: Territory[];
    partiesList?: Party[];
    pageName: string;
    alwaysVisible?: boolean;
    config?: FiltersBarConfig;
}) {
    const config = {...DEFAULT_CONFIG, ...userConfig};
    const [filtersOpen, setFiltersOpen] = useState(false);

    const {filters, setFilter, clearAllFilters, hasActiveFilters} = useSearchFilters({
        basePath: `/${pageName}`,
    });

    console.log('filters', filters);
    const activeFilterCount = Object.values(filters).reduce(
        (prev, curr) => prev + (Array.isArray(curr) ? curr.length : (curr ? 1 : 0)), 0);

    const vertSeparatorElement = <Separator orientation="vertical" className="hidden lg:block h-16 opacity-50 "/>;
    return (
        <div className="max-w-screen-lg mx-auto">
            {/* Clear Filters Header - only shown when filters are active */}
            <div className="bg-background z-10 p-6">
                <div className={`flex ${hasActiveFilters ? "justify-between  items-center" : "justify-center"}`}>
                    {!alwaysVisible &&
                        <button
                            onClick={() => setFiltersOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-xl font-semibold"
                        >
                            <Funnel size={20}/>
                            Filtres
                            {/* Badge: visible only when collapsed and filters are active */}
                            <div className="h-6 w-6 flex items-center justify-center">
                                {hasActiveFilters && (
                                    <span
                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-semibold">
                            {activeFilterCount}
                          </span>
                                )}
                            </div>
                            {/* Chevron rotates based on open/closed state */}
                            <span
                                className="hover:bg-accent ml-6 px-2 py-1 transition-all rounded-md hover:text-accent-foreground dark:hover:bg-accent/50">
                        <ChevronDown
                            size={18}
                            className={`text-muted-foreground transition-transform duration-200 ${filtersOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                      </span>
                        </button>
                    }
                    <span></span>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Réinitialiser les filtres
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Filters Section */}
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out  border-t
                ${filtersOpen || alwaysVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`
                }>
                <div className="min-h-0 min-w-0 ">
                    {/* Top Row: Personalities, Parties, Mandates, Departments */}
                    <div className="flex flex-col sm:flex-row min-w-0 w-full items-start gap-4 overflow-visible py-4 px-6">
                        {config.showPersonalities && (
                            <OptionsFilter
                                selected={filters.personalities}
                                onChange={(selected: string[]) => setFilter('personalities', selected)}
                                items={personalitiesList}
                                headingNode={
                                    <>
                                        <UserRound size={18}/> Politicien
                                    </>
                                }
                            />
                        )}

                        {config.showParties && partiesList && (
                            <>
                                {config.showPersonalities && vertSeparatorElement}
                                <OptionsFilter
                                    selected={filters.parties}
                                    onChange={(selected: string[]) => setFilter('parties', selected)}
                                    items={partiesList}
                                    headingNode={
                                        <>
                                            <Building2 size={18}/> Parti politique
                                        </>
                                    }
                                />
                            </>
                        )}

                        {config.showMandates && mandateTypesList && (
                            <>
                                {vertSeparatorElement}
                                <OptionsFilter
                                    selected={filters.roles}
                                    onChange={(selected: string[]) => setFilter('roles', selected)}
                                    items={mandateTypesList}
                                    headingNode={
                                        <>
                                            <Briefcase size={18}/> Mandat
                                        </>
                                    }
                                />
                            </>
                        )}

                        {config.showDepartments && departmentsList && (
                            <>
                                {vertSeparatorElement}
                                <OptionsFilter
                                    selected={filters.departments}
                                    onChange={(selected: string[]) => setFilter('departments', selected)}
                                    items={departmentsList}
                                    headingNode={
                                        <>
                                            <MapPin size={18}/> Département
                                        </>
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* Bottom Row: Tags and Text Search */}
                    <div className="flex flex-col sm:flex-row w-full items-start min-w-0 gap-4 overflow-visible py-4 px-6">
                        {config.showTags && tagsList && (
                            <>
                                <div className="flex-1 min-w-0 overflow-y-visible">
                                        <OptionsFilter
                                            selected={filters.tags}
                                            onChange={(selected: string[]) => setFilter('tags', selected)}
                                            items={tagsList}
                                            headingNode={
                                                <>
                                                    <TagIcon size={18}/> Tags
                                                </>
                                            }
                                        />
                                </div>
                                {vertSeparatorElement}
                            </>
                        )}

                        {config.showText && (
                            <div className="flex-1 overflow-y-visible min-w-0">
                                    <TextFilter
                                        selected={filters.text}
                                        onChange={(text: string) => setFilter('text', text)}
                                        config={config.textFilterConfig}
                                    />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
