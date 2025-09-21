import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Personality } from "@/lib/citations-group-by-personality";
import { useRouter } from "next/navigation";

export function PersonalityList({
  personalities,
}: {
  personalities: Personality[];
}) {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
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
          {personalities.map((p, index) => (
            <TableRow
              key={p.fullNameKebabLink}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/personnalites/${p.fullNameKebabLink}`)}
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{p.fullName}</TableCell>
              <TableCell>{p.partiPolitique ?? "-"}</TableCell>
              <TableCell>{p.fonction ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {<div className="h-6" aria-hidden />}
    </div>
  );
}