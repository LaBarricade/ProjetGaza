
import {Mail} from "lucide-react"
import {FacebookIcon, InstagramIcon, TwitterIcon} from "@/components/logo/socials";
import {SafeMailto} from "@/components/safe-mailto";

export function Footer() {
   const siteEmail = "la-boussole-gaza@" + "proton.me";
  return (
    <footer className="w-full max-w-xl mx-auto flex flex-col items-center py-8 space-y-6">
      <div className="w-24 h-1 bg-black rounded-full opacity-70" />

      <a
        href="/mentions-legales"
        className="text-sm hover:underline text-gray-700"
      >
        Mentions légales
      </a>

      <div className="grid grid-cols-4 gap-6 text-gray-700">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/laboussolegaza/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center hover:opacity-75"
        >
          <InstagramIcon />
          <span className="text-xs mt-1">Instagram</span>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/profile.php?id=61586053893164"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center hover:opacity-75"
        >
            <FacebookIcon />

          <span className="text-xs mt-1">Facebook</span>
        </a>

        {/* X / Twitter */}
        <a
          href="https://x.com/BoussoleGaza"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center hover:opacity-75"
        >
            <TwitterIcon />

          <span className="text-xs mt-1">X</span>
        </a>

        {/* Email */}
        <SafeMailto email={siteEmail} className="flex flex-col items-center hover:opacity-75">
          <Mail />
          <span className="text-xs mt-1">Email</span>
        </SafeMailto>

      </div>

      <p className="text-xs text-gray-500 pt-2">
        © {new Date().getFullYear()} La Boussole Gaza — Tous droits réservés.
      </p>
    </footer>
  );
}
