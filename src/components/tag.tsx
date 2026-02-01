import { Tag as TagType } from '@/types/Tag';
import Link from 'next/link';
import { HTMLProps } from 'react';

type TagLabelProps = {
  tag: TagType;
  htmlProps?: HTMLProps<HTMLAnchorElement>;
};
export default function TagLabel({ tag, htmlProps }: TagLabelProps) {
  return (
    <Link href={`/citations?tag=${tag.id}`} {...htmlProps}>
      <span
        key={tag.id}
        className="bg-primary/10 text-primary font-bold px-2 py-0.5 mr-1 rounded-full text-xs inline-block"
      >
        {tag.name}
      </span>
    </Link>
  );
}
