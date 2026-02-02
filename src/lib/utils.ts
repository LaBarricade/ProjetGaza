import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function objectToQueryString(obj: Record<string, any>) {
  const params = new URLSearchParams();

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.set(key, value.join(','));
            }
        } else if (value != null && value !== '') {
            params.set(key, value);
        }
    });

    return params.toString();
}