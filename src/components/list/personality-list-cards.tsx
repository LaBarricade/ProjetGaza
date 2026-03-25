'use client'
import {Personality} from '@/types/Personality';
import CountUp from "react-countup";
import {PersonalityCard} from "@/components/personality-card";
import {LazyLoadingList} from "@/components/list/lazy-loading-list";
import {Filters} from "@/types/Filters";
import {callLocalApi} from "@/lib/backend/api-client";
import {objectToQueryString} from "@/lib/utils";
import {ApiParams} from "@/lib/backend/db-service";

export function PersonalityListCards({initialItems, totalCount, apiParams}:
{
    initialItems: Personality[],
    totalCount: number,
    apiParams: ApiParams
}) {

    async function loadNewItems(pageToLoad: number) {
        const qs = objectToQueryString(Object.assign(apiParams, {
            page: pageToLoad.toString(),
            size: 20
        }));

        const apiResp = await callLocalApi(`/api/v2/personalities?${qs}`);
        return apiResp.items;
    }

    return (
        <div className="w-full max-w-screen-lg p-4 mx-auto mt-0 space-y-6">
            {totalCount &&
                <h2 className="w-full text-3xl font-bold text-gray-800 mt-0">
                    <CountUp end={totalCount} duration={1.2}/> personnalités
                </h2>
            }
            <div className="w-screen max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <LazyLoadingList initialItems={initialItems}
                     key={JSON.stringify(apiParams)}
                     createNode={(item) => <PersonalityCard key={item.id} item={item}/>}
                     totalCount={totalCount}
                     loadItems={loadNewItems}
                />
            </div>

        </div>
    );
}
