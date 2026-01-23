import {Tag as TagType} from "@/types/Tag";
import Link from "next/link";

export default function TagLabel({tag}: {tag: TagType}) {
  return (
    <Link href={`/citations?tag=${tag.id}`}>
      <span
        key={tag.id}
        className="bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs inline-block"
      >
        {tag.name}
      </span>
    </Link>
  );
}