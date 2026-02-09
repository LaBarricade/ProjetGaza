import { Tag as TagType } from '@/types/Tag';
import Link from 'next/link';
import { HTMLProps } from 'react';
import {twMerge} from "tailwind-merge";


export default function TagLabel({ tag, linkHtmlProps, textClassName }: {
  tag: TagType;
    linkHtmlProps?: HTMLProps<HTMLAnchorElement>;
    textClassName?: string;
}) {
  return (
    <Link href={`/citations?tag=${tag.id}`} {...linkHtmlProps}>
      <span
        key={tag.id}
        className={twMerge("bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs inline-block ", textClassName)}
      >
        {tag.name}
      </span>
    </Link>
  );
}
