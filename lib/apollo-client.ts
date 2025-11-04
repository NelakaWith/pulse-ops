import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

// Prefer NEXT_PUBLIC for client-side usage; fallback to server-side token if present.
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GITHUB_GRAPHQL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }),
  cache: new InMemoryCache(),
});

export default apolloClient;
