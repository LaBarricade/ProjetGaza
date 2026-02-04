"use client"

import {ReactNode} from "react";

export function SafeMailto({children, email, ...props }: {children: ReactNode, email: string} & React.AnchorHTMLAttributes<HTMLAnchorElement>){
    return <a
        onClick={() => {window.open('mailto:' + email, '_blank'); return false}}
      href="#"
        {...props }
    >
        {children}
    </a>;

}