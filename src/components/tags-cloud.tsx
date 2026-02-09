import TagLabel from "@/components/tag";
import {Tag} from "@/types/Tag";

export default function TagsCloud({tagsList}: {tagsList: Tag[]}) {
    return <ul className="">
    {tagsList.map(tag =>
        <li className="inline-block">
            <TagLabel tag={tag} key={`quote-filter-tag-${tag.id}`} textClassName="text-sm mt-1"/>
        </li>
    )}
    </ul>
}