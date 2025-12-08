import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Tag } from 'lucide-react';
import { Politician } from '../app/search/search';
import Link from 'next/link';

interface PoliticianCardProps {
  politician: Politician;
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  return (
    <Link href={`/politician/${politician.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg truncate">{politician.name}</h3>
              {politician.function && (
                <p className="text-sm text-muted-foreground">{politician.function}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {politician.party && (
            <div>
              <Badge variant="secondary">{politician.party}</Badge>
            </div>
          )}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{politician.quotesCount} quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{politician.tagsCount} tags</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
