"use client"

import {ReactNode} from "react";

export function SafeMailto({children, email, ...props }: {children: ReactNode, email: string} & React.AnchorHTMLAttributes<HTMLAnchorElement>){
    return <a
        onClick={(e) => {window.open('mailto:' + email, '_blank'); e.preventDefault()}}
      href="#"
        {...props }
    >
        {children}
    </a>;

}