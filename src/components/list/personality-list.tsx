'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Personality } from '@/types/Personality';

export function PersonalityList({ personalities }: { personalities: Personality[] }) {
  const router = useRouter();

  return (
    <div className="w-full max-w-screen p-4 mx-auto mt-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Personalité</TableHead>
            <TableHead>Parti politique</TableHead>
            <TableHead>Fonction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalities.map((p, index) => {
            return (
              <TableRow
                key={p.firstname + ' ' + p.lastname}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/personnalites/${p.id}`)}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{p.firstname + ' ' + p.lastname}</TableCell>
                <TableCell>{p.party?.name || '-'}</TableCell>
                <TableCell>{p.role || '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {<div className="h-6" aria-hidden />}
    </div>
  );
}
