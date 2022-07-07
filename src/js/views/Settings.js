import React, { useEffect } from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";
// import slices
import { setUserTheme } from "../Redux/features/SettingsSlice";

// import icons 
import { FaMoon, FaSun, FaLock } from "react-icons/fa";

// import components
import NewPasscodeModal from "../components/Modals/NewPasscodeModal";
import EditOrRemovePasscodeModal from "../components/Modals/EditOrRemovePasscodeModal";
import AddBudgetItemModal from "../components/Modals/AddBudgetItemModal";

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


     // function to return the proper modal file based on whether or not the end user currently has a pin
     function conditionalPasscodeModal() {
          // if the status is succeeded 
          if (settingsState.status == "succeeded") {
               // if userPIN is "NOPIN", internal string for no pin
               if (settingsState.settings[0].UserPIN === "NOPIN") {
                    // the user does not have a pin
                    return(
                         <NewPasscodeModal/>
                    );
               } else {
                    // the user does have a pin
                    return(
                         <EditOrRemovePasscodeModal/>
                    );
               }
          }
     }

     // function to return to different looking buttons based on the opposite of the current user theme
     function conditionalThemeButton() {
          // if the status is succeeded 
          if (currentTheme === 'dark') {
               return(
                    <Button onClick={()=> toggleTheme(currentTheme)} size="lg" variant="light">
                         <FaSun className="themeButtonIcon"/>Switch to Light Theme
                    </Button>
               )
          } else {
               return(
                    <Button onClick={()=> toggleTheme(currentTheme)} size="lg" variant="dark">
                         <FaMoon className="themeButtonIcon"/>Switch to Dark Theme
                    </Button>
               )
          }

     }

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Settings</h1>

               {conditionalThemeButton()}

               <br></br>
               <br></br>

               {/* conditionally hide these if based on whether or not a passcode exists */}
               {conditionalPasscodeModal()}

          </div>
     )
}