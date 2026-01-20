export async function callLocalApi(url: string) {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error("Erreur fetch API");
  const formatted = await res.json();
  return formatted;
}

