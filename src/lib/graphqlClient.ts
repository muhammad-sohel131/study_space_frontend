import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '../store/useAuthStore';

const endpoint = 'http://localhost:5000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
 requestMiddleware: (request) => {
 const token = useAuthStore.getState().token;
 const newHeaders = new Headers(request.headers);
 newHeaders.set('apollo-require-preflight', 'true');
 if (token) {
 newHeaders.set('Authorization', `Bearer ${token}`);
 }
 return {
 ...request,
 headers: newHeaders,
 };
 },
});
