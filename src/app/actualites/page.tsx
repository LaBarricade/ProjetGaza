
import { NewsList } from "@/components/list/news-list";
import {News} from "@/types/News";

import {getDbService} from "@/lib/api/db-service";

export default async function NewsPage() {
  const data = await getDbService().findNews()
  const items = data.items;

  return (
      <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {!items && (
          <div className="flex flex-1 items-center h-full">
            <p>Chargement des données...</p>
          </div>
        )}

        {items && items.length > 0 && <NewsList news={items} />}
        {items && items.length === 0 && (
          <div className="flex flex-1 items-center h-full">
            <p>Aucun résultat trouvé.</p>
          </div>
        )}
      </main>
  );
}
