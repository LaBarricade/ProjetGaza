import { logoPartiPolitique } from '@/lib/logo/parti-politique';
import Image from 'next/image';

export const LogoParti = ({ parti }: { parti: string }) => {
  const logoUrl = logoPartiPolitique[parti as keyof typeof logoPartiPolitique];
  if (!logoUrl) return <span>Logo non disponible</span>;

  return (
    <div className="flex flex-col items-center">
      <Image
        src={logoUrl}
        alt={`Logo du parti ${parti}`}
        width={96}
        height={96}
        className="mb-4 object-cover w-24 h-auto"
        style={{ width: "100px", height: "auto" }}
      />
      <span className="ml-2 font-semibold">{parti}</span>
    </div>
  );
};
