import { legacy_createStore, combineReducers } from "redux";
import { reducer as Auth_Reducer } from "./Auth_Reducer/reducer.jsx";
import { reducer as Product_Reducer } from "./Product_Reducer/reducer.jsx";
import { reducer as Cart_Reducer } from "./Cart_Reducer/reducer.jsx";
import { reducer as Order_Reducer } from "./Order_Reducer/reducer.jsx";

// ✅ Load state from localStorage (with error safety)
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state:", err);
    return undefined;
  }
};

// ✅ Save state to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth: Auth_Reducer,
  product: Product_Reducer,
  cart: Cart_Reducer,
  order: Order_Reducer,
});

// ✅ Load persisted state
const persistedState = loadState();

// ✅ Create store with persisted state
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = legacy_createStore(rootReducer, persistedState, composeEnhancers);

// ✅ Subscribe to store changes (save only if logged in)
store.subscribe(() => {
  const state = store.getState();

  if (state.auth && state.auth.IsAuth) {
    const stateToPersist = {
      auth: {
        access_token: state.auth.access_token,
        user: state.auth.user,
        IsAuth: true,
      },
      cart: state.cart,
      order: state.order,
    };
    saveState(stateToPersist);
  } else {
    // 🚀 Clear state when logged out
    localStorage.removeItem("reduxState");
  }
});

export default store;