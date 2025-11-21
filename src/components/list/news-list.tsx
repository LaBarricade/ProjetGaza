import { News } from "@/app/actualites/page";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export function NewsList({ news }: { news: News[] }) {
  return (
    <div className="w-full max-w-screen-lg p-4 mx-auto mt-6 space-y-6">
      {news.map((item, index) => (
        <Card 
          key={index} 
          className="border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 leading-relaxed">{item.text}</p>
          </CardContent>
          <CardFooter className="text-right">
            <span className="text-xs text-gray-400">Actualité #{index + 1}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
