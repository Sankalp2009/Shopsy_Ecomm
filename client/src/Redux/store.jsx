import { combineReducers, legacy_createStore } from "redux";
import { reducer as Auth_Reducer } from "./Auth_Reducer/reducer.jsx";
import { reducer as Cart_Reducer } from "./Cart_Reducer/reducer.jsx";
import { reducer as Order_Reducer } from "./Order_Reducer/reducer.jsx";
import { reducer as Product_Reducer } from "./Product_Reducer/reducer.jsx";

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

// ✅ Save state to localStorage (throttled)
const saveState = (state) => {
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

// ✅ Throttle function to limit save frequency
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
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

// ✅ Configure Redux DevTools (only in development)
const composeEnhancers =
  typeof window !== "undefined" &&
  import.meta.env.MODE !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

const store = legacy_createStore(rootReducer, persistedState, composeEnhancers);

// ✅ Subscribe to store changes with throttling (save max once per second)
const throttledSave = throttle((state) => {
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
}, 1000);

store.subscribe(() => {
  throttledSave(store.getState());
});

export default store;
