'use client'
import TagLabel from "@/components/tag-label";
import {Tag} from "@/types/Tag";
import {useSearchFilters} from "@/components/filters/useSearchFilters";

export default function TagsCloud({tagsList}: {tagsList: Tag[]}) {
    const {filters: currentFilters} = useSearchFilters({basePath: "citations"});
    const currentFilteredTags = currentFilters.tags;

    return <ul className="">
    {tagsList.map(tag =>
        <li className="inline-block">
            <TagLabel tag={tag} key={`quote-filter-tag-${tag.id}`} withCount={true} textClassName={"text-sm mt-1 "
                + (currentFilteredTags.includes(tag.id.toString()) && ' bg-black text-white')}/>
        </li>
    )}
    </ul>
}