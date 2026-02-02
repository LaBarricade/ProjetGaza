import { logoPartiPolitique } from '@/lib/logo/parti-politique';
import {Party} from "@/types/Party";

export function LogoParti ({ party, shortName = false, size = {} }:
                           { party: Party, shortName?: boolean, size?: {} })
{
  const logoUrl = logoPartiPolitique[party.name as keyof typeof logoPartiPolitique];

  return (
    <div className="flex flex-col items-center">
        {logoUrl &&
      <img
        src={logoUrl}
        alt={`Logo du parti ${party}`}
        width={96}
        height={96}
        className=" object-cover w-24 h-auto"
        style={{...{ width: "100px", height: "auto" }, ...size}}
      />
        }
      <span className="font-semibold text-xs">{shortName ? party.short_name : party.name}</span>
    </div>
  );
};
