import { emptySplitApi as api } from "./EmptyApi";
export const addTagTypes = [] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getApiDoc: build.query<GetApiDocApiResponse, GetApiDocApiArg>({
        query: () => ({ url: `/api-doc` }),
      }),
      $get: build.query<$getApiResponse, $getApiArg>({
        query: () => ({ url: `/` }),
      }),
      getGetWalletData: build.query<
        GetGetWalletDataApiResponse,
        GetGetWalletDataApiArg
      >({
        query: () => ({ url: `/get-wallet-data` }),
      }),
      getGetBitcoinHistory: build.query<
        GetGetBitcoinHistoryApiResponse,
        GetGetBitcoinHistoryApiArg
      >({
        query: (queryArg) => ({
          url: `/get-bitcoin-history`,
          params: { from: queryArg["from"], until: queryArg.until },
        }),
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type GetApiDocApiResponse = unknown;
export type GetApiDocApiArg = void;
export type $getApiResponse = unknown;
export type $getApiArg = void;
export type GetGetWalletDataApiResponse = any[];
export type GetGetWalletDataApiArg = void;
export type GetGetBitcoinHistoryApiResponse = any[];
export type GetGetBitcoinHistoryApiArg = {
  from?: string;
  until?: string;
};
export const {
  useGetApiDocQuery,
  use$getQuery,
  useGetGetWalletDataQuery,
  useGetGetBitcoinHistoryQuery,
} = injectedRtkApi;
