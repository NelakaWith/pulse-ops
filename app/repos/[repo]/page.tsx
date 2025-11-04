import ClientRepoDetails from "./client-repo-details";

type Props = {
  params: { repo: string };
};

const OWNER = "NelakaWith";

export default async function RepoPage({ params }: Props) {
  return (
    <main className="p-8">
      <ClientRepoDetails owner={OWNER} name={params.repo ?? ""} />
    </main>
  );
}
