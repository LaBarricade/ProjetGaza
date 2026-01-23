import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import {Tag as TagType} from '@/types/Tag';
import { Personality } from '@/types/Personality';
import { Quote } from '@/types/Quote';
interface PoliticianCardProps {
  politician: Personality;
  quotes?: Quote[]
}

export function PoliticianCard({ politician, quotes }: PoliticianCardProps) {



  return (
    <Link href={`/politician/${politician.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg truncate">{politician.firstname} {politician.lastname}</h3>
              {politician.role && (
                <p className="text-sm text-muted-foreground">{politician.role}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {politician.party && (
            <div>
              <Badge variant="secondary">{politician?.party?.name}</Badge>
            </div>
          )}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{politician.quotes_count ?? 0} quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {/* testerror:  <span className="text-muted-foreground">{politician?.quotes.flatMap(q => q.tags).length ?? 0} tags</span> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
