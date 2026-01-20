import { logoPartiPolitique } from '@/lib/logo/parti-politique';
import {Party} from "@/types/Party";

export const LogoParti = ({ party }: { party: Party }) => {
  const logoUrl = logoPartiPolitique[party.name as keyof typeof logoPartiPolitique];
  if (!logoUrl) return <span>Logo non disponible</span>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={logoUrl}
        alt={`Logo du parti ${party}`}
        width={96}
        height={96}
        className="mb-4 object-cover w-24 h-auto"
        style={{ width: "100px", height: "auto" }}
      />
      <span className="ml-2 font-semibold text-xs">{party.name}</span>
    </div>
  );
};
