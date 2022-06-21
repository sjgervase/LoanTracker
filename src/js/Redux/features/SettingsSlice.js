import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ipcRenderer } from "electron";

import { current } from "@reduxjs/toolkit";

// to fetch the settings 
export const fetchSettings = createAsyncThunk('fetchSettings', async () => {
     // get response from main process
     const response = await ipcRenderer.invoke('dataRequest');

     // return response, data[3] is the internal array for settings
     return response.data[3].settings;
})


// slice of store to hold all settings
export const SettingsSlice = createSlice({
     // name of slice
     name: 'settings',
     
     // initial state
     initialState: {
          settings:[],
          status: 'idle',
          error: null
     },

     // reducers list
     reducers: {
          // reducer to set the user theme
          setUserTheme: (state, action) => {
               // get the opposite theme of whatever was recieved
               let newTheme = (action.payload === 'light' ? 'dark' : 'light')

               // set the new theme
               state.settings[0].UserSelectedTheme = newTheme;

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeSettings', (["setUserTheme", newTheme]));
          },

          // reducer to set the user font size
          setUserFontSize: (state, action) => {
               // TBD
          },

          // reducer to set the user pin
          setUserPIN: (state, action) => {
               // set the user pin
               state.settings[0].UserPIN = action.payload;

               // finally, send data to main process to write to file
               ipcRenderer.invoke('writeSettings', (["setUserPIN", action.payload]));
          }
     },

     // extra reducers for fetching data
     extraReducers(builder) {
          builder
               .addCase(fetchSettings.pending, (state, action) => {
                    state.status = 'loading'
               })

               .addCase(fetchSettings.fulfilled, (state, action) => {
                    state.status = 'succeeded'
                    // add settins to the array
                    state.settings = state.settings.concat(action.payload)
               })

               .addCase(fetchSettings.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.error.message
               })
     }
})

// export all actions
export const { 
     setUserTheme,
     userFontSize,
     setUserPIN
} = SettingsSlice.actions;

// export slice
export default SettingsSlice.reducer;

// NOTES:
// https://redux.js.org/tutorials/quick-start
// https://redux.js.org/tutorials/essentials/part-5-async-logic