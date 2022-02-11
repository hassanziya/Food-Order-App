import { useReducer } from "react";
import CartContext from "./cart-context";
const defaultCartState = {
  items: [],
  totalAmount: 0,
};
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.item.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.id === action.item.id) {
              return {
                ...item,
                amount: item.amount + action.item.amount,
              };
            }
            return item;
          }),
          totalAmount:
            state.totalAmount + action.item.price * action.item.amount,
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.item],
          totalAmount:
            state.totalAmount + action.item.price * action.item.amount,
        };
      }
    case "REMOVE_ITEM":
      const existingItemToRemove = state.items.find(
        (item) => item.id === action.id
      );
      if (existingItemToRemove) {
        if (existingItemToRemove.amount === 1) {
          return {
            ...state,
            items: state.items.filter((item) => item.id !== action.id),
            totalAmount:
              state.totalAmount -
              existingItemToRemove.price * existingItemToRemove.amount,
          };
        } else {
          return {
            ...state,
            items: state.items.map((item) => {
              if (item.id === action.id) {
                return {
                  ...item,
                  amount: item.amount - 1,
                };
              }
              return item;
            }),
            totalAmount: state.totalAmount - existingItemToRemove.price,
          };
        }
      } else {
        return state;
      }

    default:
      return state;
  }
};
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  };
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartProvider;
