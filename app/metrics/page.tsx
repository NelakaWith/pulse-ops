"use client";
import { useGithub } from "@/hooks/use-github";
function MetricsPage() {
  const { data, loading, error } = useGithub("stats/commit_activity");
  // data is `unknown` from the hook; stringify it to a string before rendering
  const pretty = data ? JSON.stringify(data as unknown, null, 2) : null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Metrics</h1>
      <p className="mt-4">
        Here you can view various metrics related to your repositories.
      </p>
      {loading && <p>Loading metrics...</p>}
      {error && (
        <p className="text-red-500">Error loading metrics: {error.message}</p>
      )}
      {pretty && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Commit Activity</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
            {pretty}
          </pre>
        </div>
      )}
    </main>
  );
}

export default MetricsPage;
