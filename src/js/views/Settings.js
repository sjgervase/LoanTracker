import React, { useEffect } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";
// import slices
import { setUserTheme } from "../Redux/features/SettingsSlice";

// import components
import LoginPIN from "../components/Modals/LoginPIN";

import { Button } from "react-bootstrap";

export default function Settings() {

     const dispatch = useDispatch();

     // get all settings from redux store
     const settingsState = useSelector((state) => state.settings);




     // THEME FUNCTIONS

     // get the current theme from the redux store
     const currentTheme = (settingsState.settings[0] ? settingsState.settings[0].UserSelectedTheme : null)

     // function for toggling theme
     function toggleTheme(currentTheme) {
          // dispatch action to change theme with param of current theme
          dispatch(setUserTheme(currentTheme));    
     }

     


     

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Settings</h1>

               <Button onClick={()=> toggleTheme(currentTheme)}>
                    Switch to {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
               </Button>

               <br></br>
               <br></br>
               <br></br>
               <br></br>

               {/* <LoginPIN/> */}


          </div>
     )
}