import { API_URL, FIREBASE_CONFIG } from "../../utils/Config";
import { timeoutPromise } from "../../utils/Tools";
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import axios from 'axios';
export const CART_LOADING = "CART_LOADING";
export const CART_FAILURE = "CART_FAILURE";
export const FETCH_CART = "FETCH_CART";
export const ADD_CART = "ADD_CART";
export const RESET_CART = "RESET_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const DES_CART_QUANTITY = "DES_CART_QUANTITY";
export const INS_CART_QUANTITY = "INS_CART_QUANTITY";
// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
const cart = firebase.database().ref("cart")


//Fetch Cart
export const fetchCart = () => {
  return async (dispatch, getState) => {
    const user = getState().auth.user;
    if (user.userid != undefined) {
      dispatch({
        type: CART_LOADING,
      });
      try {
        let cartData = await cart.child(user.userid).once('value')
        cartData = cartData.val();
        let result = [];
        if (cartData) {
          Object.keys(cartData).forEach(function (k) {
            result.push(cartData[k])
          });
        }
        /*
        if (!response.data.status) {
          dispatch({
            type: CART_FAILURE,
          });
          throw new Error("Something went wrong!, can't get your carts");
        }
        */
        const carts = {
          items: result
        }

        dispatch({
          type: FETCH_CART,
          carts,
        });
      } catch (err) {
        throw err;
      }
    }
    return;
  };
};
//Add Add to Cart
export const addToCart = (item, variations) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const cloneItem = { ...item };
      if (cloneItem?.variationsData[variations]) {
        cloneItem.selectedVariation = variations
        cloneItem.variationOrder = cloneItem.variationsData[variations]
      }
      cart.child(user.userid).child(cloneItem._id).set({
        item: cloneItem,
        quantity: 1
      })
      /* if (!response.data.status) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      } */
      dispatch({
        type: "ADD_CART",
        cartItem: cloneItem,
      });
    } catch (err) {
      throw err;
    }
  };
};


//Remove from Cart
export const removeFromCart = (itemId) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      const id = user.userid;
      cart.child(id).child(itemId).remove();
      /* if (!response.data.status) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      } */
      dispatch({
        type: "REMOVE_FROM_CART",
        itemId,
      });
    } catch (err) {
      throw err;
    }
  };
};
//Decrease cart quantity
export const updateCartQuantity = (itemId, updateType, quantity) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      if (updateType === "INS_CART_QUANTITY") {
        cart.child(user.userid).child(itemId).child("quantity").set(quantity + 1)
      } else if (updateType === "DES_CART_QUANTITY") {
        let qua = quantity - 1
        if (quantity <= 1)
          cart.child(user.userid).child(itemId).remove();
        else
          cart.child(user.userid).child(itemId).child("quantity").set(qua <= 1 ? quantity : qua)
      }
      else {
        if (!response.data.status) {
          dispatch({
            type: CART_FAILURE,
          });
          throw new Error("Something went wrong!");
        }
      }
      dispatch({
        type: updateType,
        cartItemId: itemId,
      });
    } catch (err) {
      throw err;
    }
  };
};

//Reset Cart
export const resetCart = (cartId) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CART_LOADING,
    });
    const user = getState().auth.user;
    try {
      cart.child(user.userid).remove();
      /* if (!response.data.status) {
        dispatch({
          type: CART_FAILURE,
        });
        throw new Error("Something went wrong!");
      } */
      dispatch({
        type: "RESET_CART",
      });
    } catch (err) {
      throw err;
    }
  };
};
