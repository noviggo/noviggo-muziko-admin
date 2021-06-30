import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiRequest, Folder, QueryParams } from '../entities/apiEntities';

export const getUrl = () => {
  const port = location.port === '3000' ? '5000' : location.port;
  return `${location.protocol}//${location.hostname}:${port}`;
};

// Define a service using a base URL and expected endpoints
export const muzikoApi = createApi({
  reducerPath: 'muzikoApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${getUrl()}/muziko/api/` }),
  tagTypes: ['Folder'],
  endpoints: builder => ({
    getAllFolders: builder.query<Folder[], QueryParams>({
      query: (params: QueryParams) => buildQueryParams(`folders`, params),
      transformResponse: (response: { data: Folder[] }) => {
        return response.data ? response.data : new Array<Folder>();
      },
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ id }) => ({ type: 'Folder' as const, id })), 'Folder'] : ['Folder'],
    }),
    scanFolder: builder.mutation<Folder, string | undefined>({
      query: (id: string) => ({
        url: `folders/${id}/scan`,
        method: 'PUT',
      }),
      // invalidatesTags: (result, error, id) => [{ type: 'Folder', id }],
    }),
    addFolder: builder.mutation<Folder, string | undefined>({
      query: (path: string) => ({
        url: `folders`,
        method: 'POST',
        body: {
          data: { path: path },
        } as ApiRequest<Folder>,
      }),
      transformResponse: (response: { data: Folder }) => {
        return response.data;
      },
      invalidatesTags: ['Folder'],
    }),
    deleteFolder: builder.mutation<Folder, string | undefined>({
      query: (id: string) => ({
        url: `folders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Folder'],
    }),
  }),
});

export const { useGetAllFoldersQuery, useAddFolderMutation, useDeleteFolderMutation, useScanFolderMutation } =
  muzikoApi;

function buildQueryParams(query: string, params: QueryParams) {
  if (params.offset) {
    query += `?offset=${params.offset}`;
  } else {
    query += `?offset=0`;
  }
  if (params.take) query += `&take=${params.take}`;
  return query;
}
