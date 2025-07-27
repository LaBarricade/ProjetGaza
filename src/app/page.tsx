import { SearchBar } from "@/app/search-bar";

const fetchData = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/baserow`);
  const data = await res.json();
  console.log(data);
};

export default async function Home() {
  await fetchData()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SearchBar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <h1>🍉 Girouettes</h1>
        </div>
      </main>
    </div>
  );
}
