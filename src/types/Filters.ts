import { MandateType } from '@/types/MandateType';
import { Party } from '@/types/Party';
import { Personality } from '@/types/Personality';
import { Tag } from '@/types/Tag';
import { Territory } from './Territory';

export type Filters = {
  tags?: Tag[];
  text?: string;
  parties?: Party[];
  roles?: MandateType[];
  personalities?: Personality[];
  //   cities?: string[];
  departments?: string[];
};
