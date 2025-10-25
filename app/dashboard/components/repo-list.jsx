"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGithub } from "@/hooks/use-github";
function RepoList() {
  const { data, loading, error } = useGithub("users/NelakaWith/repos");
  return (
    <section>
      {loading && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-[250px] rounded-xl" />
          ))}
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.isArray(data) &&
            data.map((repo) => (
              <Card key={repo.id} className="p-4">
                <h3 className="font-bold text-lg">{repo.name}</h3>
                <p>{repo.description}</p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on GitHub
                </a>
              </Card>
            ))}
        </div>
      )}
    </section>
  );
}

export default RepoList;
