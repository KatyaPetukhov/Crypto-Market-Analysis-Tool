// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// Import { REACT_APP_BASE_URL } from "@env"
const url = "https://crypto-market-analysis-tool-f12d66bb7184.herokuapp.com/";
console.log(url);

// Initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: url, 
    
    }),
  endpoints: () => ({}),
})