import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { Personality } from '@/app/personnalites/page';

interface PoliticianCardProps {
  politician: Personality;
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  return (
    <Link href={`/politician/${politician.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg truncate">{politician.prénom} {politician.nom}</h3>
              {politician.fonction && (
                <p className="text-sm text-muted-foreground">{politician.fonction}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {politician.partiPolitique && (
            <div>
              <Badge variant="secondary">{politician.partiPolitique}</Badge>
            </div>
          )}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{politician.citations.length ?? 0} quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{politician?.tag?.length} tags</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
