const InitialState = {
  item: [],
  IsError: null,
  IsLoading: false,
  selectedProduct:null
};

export const reducer = (currentState = InitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_REQUEST":
    case "GET_REQUEST_BY_ID":
      return {
        ...currentState,
        IsError: null,
        IsLoading: true,
      };
    case "GET_SUCCESS":  
      return {
        ...currentState,
        item: payload,
        IsError: null,
        IsLoading: false,
      };
    case "GET_SUCCESS_BY_ID":
      return {
        ...currentState,
        selectedProduct: {
          ...payload,
          quantity: payload.quantity || 1, // Initialize quantity for cart
        },
      };
    case "GET_FAILURE":
    case "GET_FAILURE_BY_ID":  
      return {
        ...currentState,
        IsError: true,
        IsLoading: false,
      };

    case "UPDATE_PRODUCT_STOCK":
      return {
        ...currentState,
        item: currentState.item.map((product) =>
          product._id === payload
            ? { ...product, stock: payload.stock }
            : product
        ),
        selectedProduct:
          currentState.selectedProduct?._id === payload
            ? { ...currentState.selectedProduct, stock: payload.stock }
            : currentState.selectedProduct,
      };

    default:
      return currentState;
  }
};
