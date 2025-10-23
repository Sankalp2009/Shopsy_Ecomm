const InitialState = {
  access_token: null,
  user: null,
  IsAuth: false,
  IsLoading: false,
};

export const reducer = (currentState = InitialState, action) => {
  const { type,  payload } = action;
  switch (type) {
    case "SIGNUP_REQUEST":
      return {
        ...currentState,
        IsLoading: true,
      };
    case "SIGNUP_SUCCESS":
      return {
        ...currentState,
        access_token: payload.token,
        user: payload.User,
        IsAuth: true,
        IsLoading: false,
      };
    case "SIGNUP_FAILURE":
      return {
        ...currentState,
        IsAuth:false,
        IsLoading:false,
      };
    case "LOGIN_REQUEST":
      return {
        ...currentState,
        IsLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
         ...currentState,
        access_token: payload.token,
        user: payload.User,
        IsAuth: true,
        IsLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...currentState,
        IsAuth:false,
        IsLoading:false,
      };
    case "LOGOUT":
      localStorage.removeItem("reduxState");
      return {
        ...InitialState,
      };
    default:
      return currentState;
  }
};