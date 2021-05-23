import { API_URL, FIREBASE_CONFIG } from "../../utils/Config";
import { timeoutPromise } from "../../utils/Tools";
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
export const FAVORITE_LOADING = "FAVORITE_LOADING";
export const FAVORITE_FAILURE = "FAVORITE_FAILURE";
export const FETCH_FAVORITE = "FETCH_FAVORITE";
export const ADD_FAVORITE = "ADD_FAVORITE";
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";


// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
const favoriteRef = firebase.database().ref("favorite")
//Fetch Favorite
export const fetchFavorite = () => {
  return async (dispatch, getState) => {
    const user = getState().auth.user;
    if (user.userid != undefined) {
      dispatch({
        type: FAVORITE_LOADING,
      });
      try {
        let favoriteData = await favoriteRef.child(user.userid).once('value')
        favoriteData = favoriteData.val();
        let result = [];
        if (favoriteData) {
          Object.keys(favoriteData).forEach(function (k) {
            result.push(favoriteData[k])
          });
        }
        /*if (!response.ok) {
                dispatch({
                  type: FAVORITE_FAILURE,
                });
                throw new Error("Something went wrong!, can't get favorite list");
              } */
        dispatch({
          type: FETCH_FAVORITE,
          favoriteList: result,
        });
      } catch (err) {
        throw err;
      }
    }
    return;
  };
};
//Add Favorite
export const addFavorite = (item) => {
  return async (dispatch, getState) => {
    dispatch({
      type: FAVORITE_LOADING,
    });
    const user = getState().auth.user;
    try {
      favoriteRef.child(user.userid).child(item._id).set({
        item: item,
        quantity: 1
      })
      /* if (!response.ok) {
        dispatch({
          type: FAVORITE_FAILURE,
        });
        throw new Error("Something went wrong!");
      } */
      dispatch({
        type: ADD_FAVORITE,
        addItem: {
          item: item,
          quantity: 1
        },
      });
    } catch (err) {
      throw err;
    }
  };
};
export const removeFavorite = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: FAVORITE_LOADING,
    });
    const user = getState().auth.user;
    try {
      favoriteRef.child(user.userid).child(id).remove();
      /* if (!response.ok) {
        dispatch({
          type: FAVORITE_FAILURE,
        });
        throw new Error("Something went wrong!");
      } */
      dispatch({
        type: REMOVE_FAVORITE,
        itemId: id,
      });
    } catch (err) {
      throw err;
    }
  };
};
