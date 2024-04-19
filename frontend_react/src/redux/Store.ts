import { configureStore } from '@reduxjs/toolkit'
import {api} from './Api'
import PreferencesReducer from "./PreferencesSlice";

export const Store = configureStore({
  reducer: {
    preferences: PreferencesReducer,

    [api.reducerPath]: api.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch