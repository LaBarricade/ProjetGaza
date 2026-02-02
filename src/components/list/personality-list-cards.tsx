'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {useRouter} from 'next/navigation';
import {Personality} from '@/types/Personality';
import {QuoteCard} from "@/components/quote-card";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import TagLabel from "@/components/tag";
import {Button} from "@/components/ui/button";
import {ExternalLink} from "lucide-react";
import CountUp from "react-countup";
import {useEndReached} from "@/lib/use-reached-end";
import {PersonalityCard} from "@/components/personality-card";

export function PersonalityListCards({items}: { items: Personality[] }) {


    const loadMore = async () => {
        /*if (!totalCount || totalCount <= items.length) return;
        if (loading) return;

        setLoading(true);
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchData(nextPage, apiFilters);*/
    };
    const totalCount = items.length;
    const loaderRef = useEndReached(loadMore);

    return (
        <div className="w-full max-w-screen-lg p-4 mx-auto mt-0 space-y-6">
            {totalCount &&
                <h2 className="w-full text-3xl font-bold text-gray-800 mt-0">
                    <CountUp end={totalCount} duration={1.2}/> personnalités
                </h2>
            }
            <div className="w-screen max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {items.map((item) => (
                    <PersonalityCard key={item.id} p={item}/>
                ))}
            </div>

            <div ref={loaderRef} className="h-6" aria-hidden/>
        </div>
    );
}
