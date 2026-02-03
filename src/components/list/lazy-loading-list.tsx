import {ReactNode, useCallback, useRef, useState} from "react";
import {useEndReached} from "@/lib/use-reached-end";

export function LazyLoadingList({initialItems, loadItems, createNode, totalCount}:
{
    initialItems: any[],
    loadItems: (pageToLoad: number, options?: {}) => Promise<any[]>,
    createNode: (item: any) => ReactNode,
    totalCount: number
}) {
    const [items, setItems] = useState<any[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const pageRef = useRef(1);


    const fetchNewData = useCallback(async (pageToLoad: number) => {
        const newItems = await loadItems(pageToLoad, {})

        if (pageToLoad === 1) {
            setItems(newItems);
        } else {
            setItems((prev) => [...prev, ...newItems]);
        }

        setLoading(false);
    }, [loadItems]);

    const loadMore = async () => {
        if (!totalCount || totalCount <= items.length) return;
        if (loading) return;

        setLoading(true);
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        fetchNewData(nextPage);
    };

    const loaderRef = useEndReached(loadMore);

    return (
        <>
            {items.map((item) => createNode(item))}
            <div ref={loaderRef} className="h-6" aria-hidden/>
        </>
    );
}