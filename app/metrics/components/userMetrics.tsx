import Image from "next/image";
import type { UserMetricsProps } from "../types";

function UserMetrics({ user, loading, error, data }: UserMetricsProps) {
  return (
    <div>
      {loading && <p>Loading metrics...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {user ? (
        <div className="flex items-start gap-6">
          <Image
            src={user.avatarUrl ?? ""}
            alt={user.name ?? "avatar"}
            className="h-24 w-24 rounded-full"
            width={96}
            height={96}
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name ?? "—"}</h2>
            {user.bio && (
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            )}

            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <div className="font-medium">Public repos</div>
                <div>{user.repositories?.totalCount ?? 0}</div>
              </div>
            </div>

            <div className="mt-4 text-sm">
              <div>
                Total commit contributions:{" "}
                {user.contributionsCollection?.totalCommitContributions ?? 0}
              </div>
              <div>
                Restricted contributions:{" "}
                {user.contributionsCollection?.restrictedContributionsCount ??
                  0}
              </div>
              <div>
                Contribution calendar total:{" "}
                {user.contributionsCollection?.contributionCalendar
                  ?.totalContributions ?? 0}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto">
          {data ? JSON.stringify(data, null, 2) : "No data"}
        </pre>
      )}
    </div>
  );
}

export default UserMetrics;
