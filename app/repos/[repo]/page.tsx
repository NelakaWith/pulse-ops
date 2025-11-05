import ClientRepoDetails from "./client-repo-details";

type Props = {
  params: Promise<{ repo: string }>;
};

async function RepoPage({ params }: Props) {
  const { repo } = await params;
  const repoName = repo ?? "";

  return (
    <main className="p-8">
      <ClientRepoDetails name={repoName} />
    </main>
  );
}

export default RepoPage;
