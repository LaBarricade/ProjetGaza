
export type ObfuscatedEmail = string[];

export function obfuscateEmail(email: string): ObfuscatedEmail {
    return email.split('@')
}

export function unobfuscateEmail(email: ObfuscatedEmail){
    return email.join('@');
}