import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '../store/useAuthStore';

const endpoint = 'http://localhost:3000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  requestMiddleware: (request) => {
    const token = useAuthStore.getState().token;
    return {
      ...request,
      headers: {
        ...request.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  },
});
