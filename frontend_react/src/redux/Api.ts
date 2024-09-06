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
      getGetBitcoinHistory: build.query<
        GetGetBitcoinHistoryApiResponse,
        GetGetBitcoinHistoryApiArg
      >({
        query: (queryArg) => ({
          url: `/get-bitcoin-history`,
          params: { from: queryArg["from"], until: queryArg.until },
        }),
      }),
      getGetWalletData: build.query<
        GetGetWalletDataApiResponse,
        GetGetWalletDataApiArg
      >({
        query: () => ({ url: `/get-wallet-data` }),
      }),
      getGetPrediction: build.query<
        GetGetPredictionApiResponse,
        GetGetPredictionApiArg
      >({
        query: () => ({ url: `/get-prediction` }),
      }),
      postAddSubscriber: build.mutation<
        PostAddSubscriberApiResponse,
        PostAddSubscriberApiArg
      >({
        query: (queryArg) => ({
          url: `/add-subscriber`,
          method: "POST",
          body: queryArg.body,
        }),
      }),
      postRemoveSubscriber: build.mutation<
        PostRemoveSubscriberApiResponse,
        PostRemoveSubscriberApiArg
      >({
        query: (queryArg) => ({
          url: `/remove-subscriber`,
          method: "POST",
          params: { mail: queryArg.mail },
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
export type GetGetBitcoinHistoryApiResponse = any[];
export type GetGetBitcoinHistoryApiArg = {
  from?: string;
  until?: string;
};
export type GetGetWalletDataApiResponse = WalletData[];
export type GetGetWalletDataApiArg = void;
export type GetGetPredictionApiResponse = any;
export type GetGetPredictionApiArg = void;
export type PostAddSubscriberApiResponse = unknown;
export type PostAddSubscriberApiArg = {
  body: {
    name?: any;
    mail?: any;
  };
};
export type PostRemoveSubscriberApiResponse = unknown;
export type PostRemoveSubscriberApiArg = {
  mail?: string;
};
export const {
  useGetApiDocsQuery,
  use$getQuery,
  useGetGetBitcoinHistoryQuery,
  useGetGetWalletDataQuery,
  useGetGetPredictionQuery,
  usePostAddSubscriberMutation,
  usePostRemoveSubscriberMutation,
} = injectedRtkApi;
