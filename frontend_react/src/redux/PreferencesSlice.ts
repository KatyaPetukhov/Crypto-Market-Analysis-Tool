// We save which theme we use here. The dark or light mode.
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface PreferencesInitialState {
    isDarkMode: boolean;
}
const initialState: PreferencesInitialState = {
    isDarkMode: false,
}

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        }
    },
    selectors:{
        getSelectedTheme: (state) =>{
            return state.isDarkMode;
        }
    },
})

export const { setTheme } = preferencesSlice.actions;
export const { getSelectedTheme } = preferencesSlice.selectors;
export default preferencesSlice.reducer;
