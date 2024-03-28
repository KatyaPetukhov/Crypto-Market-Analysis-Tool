// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { REACT_APP_BASE_URL } from "@env"
const url = "http://localhost:3001";
console.log(url);

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: url, 
    
    }),
  endpoints: () => ({}),
})