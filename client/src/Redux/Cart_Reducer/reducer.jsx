const InitialState = {
  items:[],
}

export const reducer = (currentState = InitialState, action) => {
  const {type, payload} = action

  switch(type){

    case "ADD_TO_CART": {
      const existingItemIndex = currentState.items.findIndex(
        (item) => item._id === payload._id
      );

      let updatedCart;

      if (existingItemIndex >= 0) {
        // Item already exists, increase quantity
        updatedCart = currentState.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + (payload.quantity || 1),
              item.stock
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        // New item, add to cart
        const newItem = {
          ...action.payload,
          quantity: payload.quantity || 1,
        };
        updatedCart = [...currentState.items, newItem];
      }

      return {
        ...currentState,
        items: updatedCart,
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...currentState,
        items: currentState.items.filter((el) => el._id !== payload),
      };

    case "INCREASE_QTY":{
      
      const updatedCart = currentState.items.map((item) => {
        if (item._id === payload) {
          // Check if quantity can be increased (not exceeding stock)
          if (item.quantity < item.stock) {
            return { ...item, quantity: item.quantity + 1 };
          }
        }
        return item;
      });
      return {
        ...currentState,
        items: updatedCart,
      };
    }

    case "DECREASE_QTY":{
      return {
        ...currentState,
        items: currentState.items
          .map((el) =>
            el._id === payload
              ? { ...el, quantity: el.quantity - 1 }
              : el
          )
          .filter((el) => el.quantity > 0), // remove if qty becomes 0
      };
    }
    
     case "UPDATE_CART_ITEM": {
      const updatedCart = currentState.items.map((item) => {
        if (item._id === payload.id) {
          return { ...item, ...payload.updates };
        }
        return item;
      });

      return {
        ...currentState,
        items: updatedCart,
      };
    }

     case "CLEAR_CART":
      return {
        ...InitialState
      }
    default:
      return currentState;
  }
}