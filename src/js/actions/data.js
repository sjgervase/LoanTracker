// import all functions from /api/fetchDataAPI and call it api
import * as api from "../api/fetchDataAPI";



// function to get data from api/fetchDataAPI.js
export function fetchData() {
     
     return async function(dispatch) {
          // returns data as object
          const data = await api.fetchData();
          
          dispatch({
               type: "DATA_FETCH_SUCCESS",
               data
          })

          return data;
     }
}