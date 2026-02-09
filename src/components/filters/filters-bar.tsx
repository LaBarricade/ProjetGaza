'use client';

import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {
    Briefcase,
    Building2,
    LucideProps,
    MapPin,
    Search,
    Tag as TagIcon,
    UserRound
} from 'lucide-react';
import {Personality} from '@/types/Personality';
import {Tag as TagType} from '@/types/Tag';
import {Party} from '@/types/Party';
import {ForwardRefExoticComponent, RefAttributes} from 'react';
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

type FiltersBarProps = {
    personalitiesList: Personality[];
    tagsList?: TagType[];
    mandateTypesList?: MandateType[];
    departmentsList?: Territory[];
    partiesList?: Party[];
    pageName: string;
    config?: FiltersBarConfig;
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
    config: userConfig,
}: FiltersBarProps) {
    const config = {...DEFAULT_CONFIG, ...userConfig};

    const {filters, setFilter, clearAllFilters, hasActiveFilters} = useSearchFilters({
        basePath: `/${pageName}`,
    });

    return (
        <div className="max-w-screen-lg mx-auto">
            {/* Clear Filters Header - only shown when filters are active */}
            {hasActiveFilters && (
                <div className="bg-background z-10 p-6 border-b">
                    <div className="flex justify-between items-center">
                        <span></span>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Filters Section */}
            <div
                className="py-6 grid transition-[grid-template-rows,opacity] duration-300 ease-out grid-rows-[1fr] opacity-100">
                <div className="min-h-0 min-w-0">
                    {/* Top Row: Personalities, Parties, Mandates, Departments */}
                    <div className="flex min-w-0 w-full items-start gap-4 overflow-visible py-4 px-6">
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
                                {config.showPersonalities && (
                                    <Separator orientation="vertical" className="h-16 opacity-50"/>
                                )}
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
                                <Separator orientation="vertical" className="h-16 opacity-50"/>
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
                                <Separator orientation="vertical" className="h-16 opacity-50"/>
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

                    {/* Separator between rows */}
                    {(config.showTags || config.showText) && <Separator className="opacity-50"/>}

                    {/* Bottom Row: Tags and Text Search */}
                    <div className="flex w-full items-start min-w-0 overflow-visible">
                        {config.showTags && tagsList && (
                            <>
                                <div className="flex-1 min-w-0 overflow-y-visible">
                                    <div className="py-4 px-6">
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
                                </div>
                                <Separator orientation="vertical" className="h-16 my-4 opacity-50"/>
                            </>
                        )}

                        {config.showText && (
                            <div className="flex-1 overflow-y-visible min-w-0">
                                <div className="py-4 px-6">
                                    <TextFilter
                                        selected={filters.text}
                                        onChange={(text: string) => setFilter('text', text)}
                                        config={config.textFilterConfig}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
