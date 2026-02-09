import { Tag as TagType } from '@/types/Tag';
import Link from 'next/link';
import { HTMLProps } from 'react';
import {twMerge} from "tailwind-merge";


export default function TagLabel({ tag, linkHtmlProps, textClassName, withCount = false }: {
  tag: TagType;
    linkHtmlProps?: HTMLProps<HTMLAnchorElement>;
    textClassName?: string;
    withCount?: boolean;
}) {
  return (
    <Link href={`/citations?tag=${tag.id}`} {...linkHtmlProps}>
      <span
        key={tag.id}
        className={twMerge("bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs inline-block ", textClassName)}
      >
        {tag.name}{withCount && tag.quotes_count && ` (${tag.quotes_count})`}
      </span>
    </Link>
  );
}
