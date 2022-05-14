const DEFAULT_STATE = {
     data: []
}

export default function dataReducer(state = DEFAULT_STATE, action) {
     switch(action.type) {

          case "DATA_FETCH_SUCCESS":
               return { items: action.data };

          default: {
               return state;
          }

     }
}