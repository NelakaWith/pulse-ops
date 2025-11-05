import ClientRepoDetails from "./client-repo-details";

type Props = {
  params: { repo: string };
};

async function RepoPage({ params }: Props) {
  const repoName = params.repo ?? "";

  return (
    <main className="p-8">
      <ClientRepoDetails name={repoName} />
    </main>
  );
}

export default RepoPage;
