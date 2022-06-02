// We are going to import the constant in the reducer. A reducer is a pure function that takes an action and the initial state of the application and returns the new state.
// The action describes what happened and it is the reducer's job to return to the new state based on that action.

const initialState = {
     data: [],
     isLoading: false,
     isError: false,
};

const DataReducer = (state = initialState, action) => {
     switch (action.type) {

          case 'REQUEST_DATA':
          return {
               ...state,
               isLoading: true,
               isError: false,
          };
          

          case 'RECIEVE_DATA':
          return {
               ...state,
               data: action.data,
               isLoading: false,
          };

          case 'SET_USER_THEME':
               let test = state;
               console.log(test);

          return {
               ...state,
               data: action.data,
               isLoading: false,
          };


          default:
          return state;
     }
}

export default DataReducer;