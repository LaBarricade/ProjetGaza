"use client"

import {ReactNode} from "react";
import {ObfuscatedEmail, unobfuscateEmail} from "@/lib/safe-mailto-server";

export function SafeMailto({children, obfuscatedEmail, ...props }: {children: ReactNode, obfuscatedEmail: ObfuscatedEmail} & React.AnchorHTMLAttributes<HTMLAnchorElement>){
    return <a
        onClick={(e) => {window.open('mailto:' + unobfuscateEmail(obfuscatedEmail), '_blank'); e.preventDefault()}}
      href="#"
        {...props }
    >
        {children}
    </a>;

}
