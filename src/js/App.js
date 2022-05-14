import React from "react";



// for store
import { Provider } from "react-redux";


// data store. dont need to specify file bc file is named index.js
import configureStore from "./store";

const store = configureStore();



// import container
import Container from "./Container";
// container is necessary as provider must be the parent component of the component that fetches data


export default function App() {

     return(
          <Provider store={store}>
              <Container/>
          </Provider> 
     )
}