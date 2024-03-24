import { WalletData } from "../screens/Wallet";
import { emptySplitApi as api } from "./EmptyApi";
export const addTagTypes = [] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getApiDocs: build.query<GetApiDocsApiResponse, GetApiDocsApiArg>({
        query: () => ({ url: `/api-docs` }),
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
      postAddSubscriber: build.mutation<
        PostAddSubscriberApiResponse,
        PostAddSubscriberApiArg
      >({
        query: (queryArg) => ({
          url: `/add-subscriber`,
          method: "POST",
          body: queryArg.body,
          params: { until: queryArg.until },
        }),
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type GetApiDocsApiResponse = unknown;
export type GetApiDocsApiArg = void;
export type $getApiResponse = unknown;
export type $getApiArg = void;
export type GetGetWalletDataApiResponse = WalletData[];
export type GetGetWalletDataApiArg = void;
export type GetGetBitcoinHistoryApiResponse = any[];
export type GetGetBitcoinHistoryApiArg = {
  from?: string;
  until?: string;
};
export type PostAddSubscriberApiResponse = unknown;
export type PostAddSubscriberApiArg = {
  until?: string;
  body: {
    name?: any;
  };
};
export const {
  useGetApiDocsQuery,
  use$getQuery,
  useGetGetWalletDataQuery,
  useGetGetBitcoinHistoryQuery,
  usePostAddSubscriberMutation,
} = injectedRtkApi;
