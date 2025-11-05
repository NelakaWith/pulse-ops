import { RepoPageClient } from "./repo-page-client";

type Props = {
  params: Promise<{ repo: string }>;
};

async function RepoPage({ params }: Props) {
  const { repo } = await params;
  const repoName = repo ?? "";

  return (
    <main className="p-8">
      <RepoPageClient repoName={repoName} />
    </main>
  );
}

export default RepoPage;
