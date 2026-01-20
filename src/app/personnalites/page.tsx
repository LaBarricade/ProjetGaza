
//import { useCallback, useEffect, useState } from "react";
import { PersonalityList } from "@/components/list/personality-list";
import {Personality} from "@/types/Personality";
import {callLocalApi} from "@/lib/backend/api-client";
import {getDbService} from "@/lib/backend/db-service";

export default async function PersonalitiesPage() {
  /*const [data, setData] = useState<Personality[] | null>(null);
  const [filteredResults] = useState<Personality[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const apiResp = await callLocalApi(`/api/v2/personalities`);
      const personalities = apiResp.items;
      setData(personalities);
    } catch (err) {
      console.error("Fetch failed:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, []);*/

  const resp = await getDbService().findPersonalities({});
  const items = resp.items;


  return (
    <main className="flex flex-1 flex-col items-center w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      {/*loading && (
        <div className="flex flex-1 items-center h-full">
          <p>Chargement des données...</p>
        </div>
      )*/}

      {items && items.length > 0 && <PersonalityList personalities={items} />}

      {items && items.length === 0 && (
        <div className="flex flex-1 items-center h-full">
          <p>Aucun résultat trouvé.</p>
        </div>
      )}
    </main>
  );
}
