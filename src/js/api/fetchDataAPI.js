import { ipcRenderer } from "electron";

export const fetchData = () => {

     const dataReturn = async function() {
          
          const data = await ipcRenderer.invoke('dataRequest')
               .then(
                    dataReturn => {
                         return dataReturn 
                    }
               );
          return data;
     }



     const getData = dataReturn();

     return getData;
}
