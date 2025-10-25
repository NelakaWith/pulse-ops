"use client";

import React from "react";
import { useGithub } from "../../hooks/use-github";

function Dashboard() {
  const { data, loading, error, refetch } = useGithub(
    "repos/NelakaWith/gloire-road-map"
  );

  return (
    <main>
      <h1>Dashboard Content here</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {loading
          ? "Loading..."
          : error
          ? JSON.stringify({ error: String(error?.message ?? error) }, null, 2)
          : JSON.stringify(data, null, 2)}
      </pre>
      <button onClick={() => refetch()} style={{ marginTop: 8 }}>
        Refresh
      </button>
    </main>
  );
}

export default Dashboard;
