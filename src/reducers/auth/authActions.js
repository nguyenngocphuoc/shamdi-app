import { AsyncStorage } from 'react-native';
import { BACKEND_API_URL, BASIC_AUTH } from '../../utils/Config';
import { timeoutPromise } from '../../utils/Tools';

export const AUTH_LOADING = 'AUTH_LOADING';
export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const EDIT_INFO = 'EDIT_INFO ';
export const UPLOAD_PROFILEPIC = 'UPLOAD_PROFILEPIC';
export const FORGET_PASSWORD = 'FORGET_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESET_ERROR = 'RESET_ERROR';

import AskingExpoToken from '../../components/Notification/AskingNotiPermission';
const axios = require('axios')
//Create dataStorage
const saveDataToStorage = (name, data) => {
  AsyncStorage.setItem(
    name,
    JSON.stringify({
      data,
    }),
  );
};

export const SignUp = (name, email, password) => {
  return async (dispatch) => {
    dispatch({
      type: AUTH_LOADING,
    });
    try {
      let userData = {
        email: email,
        first_name: "",
        last_name: name,
        username: name,
        password: password
      };
      let response = await axios.post(`${BACKEND_API_URL}/customers`, userData, {
        headers: { 'Authorization': BASIC_AUTH }
      })
      console.log(response);
      if (!response.data) {
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error("đã xảy ra lỗi !");
      }
      const resData = {
        "phone": "",
        "address": "",
        "pushTokens": [],
        "_id": user._id,
        "name": user.username,
        "email": user.email,
        "password": "1",
        "profilePicture": user.avatar_url,
        "__v": 0
      };
      response = { status: true, data: resData, message: "Thành công" }
      const user = response.data;
      if (!response.status) {
        const errorResData = response.data;
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error(errorResData.err);
      }
      dispatch({
        type: SIGN_UP,
      });
    } catch (err) {
      throw err;
    }
  };
};

//Login
export const Login = (email) => {
  return async (dispatch) => {
    dispatch({
      type: AUTH_LOADING,
    });
    try {
      let response = await axios.get(`${BACKEND_API_URL}/customers?role=all&email=${email}`, {
        headers: { 'Authorization': BASIC_AUTH }
      })
      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        let resData = {
          "userid": user.id,
          "name": user.first_name + user.last_name,
          "email": user.email,
          "password": "1111",
          "phone": user.billing?.phone,
          "address": user.billing?.address_1,
          "profilePicture": user.avatar_url,
          "token": "",
          "loginAt": Date.now(),
          "expireTime": Date.now() + 365 * 24 * 60 * 60 * 1000
        };
        response = { status: true, data: resData, message: "Đăng nhập thành công !" };
        saveDataToStorage('user', resData);
        dispatch(setLogoutTimer(60 * 60 * 1000));
        dispatch({
          type: LOGIN,
          user: resData,
        });
      }
      else {
        const errorResData = "Đăng nhập thất bại !";
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error(errorResData);
      }
    } catch (err) {
      throw err;
    }
  };
};

export const EditInfo = (phone, address) => {
  return async (dispatch, getState) => {
    const user = getState().auth.user;
    dispatch({
      type: AUTH_LOADING,
    });
    try {
      const userData = {
        billing: {
          address_1: address,
          phone
        }
      }
      let response = await axios.put(`${BACKEND_API_URL}/customers/${user.userid}`, userData, {
        headers: { 'Authorization': BASIC_AUTH }
      })
      if (!response.data || response.data.code) {
        dispatch({
          type: AUTH_FAILURE,
        });
        Error(response.data.message);
      }
      await AsyncStorage.removeItem("user");
      let resData = {
        "userid": user.userid,
        "name": user.name,
        "email": user.email,
        "password": "1111",
        "phone": phone,
        "address": address,
        "profilePicture": user.profilePicture,
        "token": "",
        "loginAt": Date.now(),
        "expireTime": Date.now() + 365 * 24 * 60 * 60 * 1000
      };
      saveDataToStorage('user', resData);
      dispatch({
        type: EDIT_INFO,
        phone,
        address,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const UploadProfilePic = (imageUri, filename, type) => {
  return async (dispatch, getState) => {
    dispatch({
      type: AUTH_LOADING,
    });
    const user = getState().auth.user;
    let formData = new FormData();
    // Infer the type of the image
    formData.append('profilePic', {
      uri: imageUri,
      name: filename,
      type,
    });
    try {
      const response = await timeoutPromise(
        fetch(`${API_URL}/user/photo/${user.userid}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'auth-token': user.token,
          },
          method: 'PATCH',
          body: formData,
        }),
      );
      if (!response.ok) {
        const errorResData = await response.json();
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error(errorResData.err);
      }

      dispatch({
        type: UPLOAD_PROFILEPIC,
        profilePic: imageUri,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const ForgetPassword = (email) => {
  return async (dispatch) => {
    dispatch({
      type: AUTH_LOADING,
    });
    try {
      const response = await timeoutPromise(
        fetch(`${API_URL}/user/reset_pw`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        }),
      );
      if (!response.ok) {
        const errorResData = await response.json();
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error(errorResData.err);
      }
      dispatch({
        type: FORGET_PASSWORD,
      });
    } catch (err) {
      throw err;
    }
  };
};
export const ResetPassword = (password, url) => {
  return async (dispatch) => {
    dispatch({
      type: AUTH_LOADING,
    });
    try {
      const response = await timeoutPromise(
        fetch(
          `${API_URL}/user/receive_new_password/${url.userid}/${url.token}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              password,
            }),
          },
        ),
      );
      if (!response.ok) {
        const errorResData = await response.json();
        dispatch({
          type: AUTH_FAILURE,
        });
        throw new Error(errorResData.err);
      }
      dispatch({
        type: RESET_PASSWORD,
      });
    } catch (err) {
      throw err;
    }
  };
};

//Logout
export const Logout = () => {
  return (dispatch) => {
    clearLogoutTimer(); //clear setTimeout when logout
    AsyncStorage.removeItem('user');
    dispatch({
      type: LOGOUT,
      user: {},
    });
  };
};

//Auto log out
let timer;
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};
const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(async () => {
      await dispatch(Logout());
      alert('Logout section expired');
    }, expirationTime);
  };
};
