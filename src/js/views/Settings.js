import React from "react";

// import from react-redux
import { useDispatch, useSelector } from "react-redux";

// import actions
import {
     setUserTheme
} from '../reduxStore/actions';



import { ipcRenderer } from "electron";
import { Button } from "react-bootstrap";

export default function Settings() {

     // get dispatch
     const dispatch = useDispatch();

     // // get data from store
     const data = useSelector((state) => state.data);
     // console.log(data);

     const UserSelectedTheme = data[3]?.settings[0].UserSelectedTheme;
     console.log(UserSelectedTheme);

     

     // function for toggling theme
     function toggleTheme() {

          // dispatch action to change theme with param of current theme
          dispatch(setUserTheme(UserSelectedTheme));
     }

     


     

     return(
          <div className="componentContainer">
               <h1 className="componentTitle">Settings</h1>



               <Button onClick={()=> toggleTheme()}>
                    Dark Mode
               </Button>


          </div>
     )
}