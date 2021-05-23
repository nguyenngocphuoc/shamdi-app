import { btoa } from "../utils/Tools";
const CUSTOMER_KEY = 'ck_465e904eca4e0a68f694aed1face61f2770cc323';
const CUSTOMER_SECRECT = 'cs_79697755571942636023f02ca426719fbb6a34cc';
// API URL
//export const API_URL = "https://e-commerce-ct-backend.herokuapp.com/api/v1";
export const API_URL = "http://192.168.1.6:3000";
export const BACKEND_API_URL = "https://shamdi.vn/wp-json/wc/v3";
export const secretKey = "Drmhze6EPcv0fN_81Bj-nAq241aA1";
export const CURRENT_CATEGORY_ID = "currentCategoryId";
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51HLo2AD28q5Rme0eq3Q6J16dQEa0d38VoeY6ZJu8u3m1jzKcswvDmNkrNn6CqSCLv38tBNwdOOOKvLylPAPNYSpq00Vs0wQ3SV";
export const DEFAULT_CATEGORY_IMAGE = "https://firebasestorage.googleapis.com/v0/b/dmc2019-236614.appspot.com/o/bg3.jpg?alt=media&token=6595c8fd-f777-48d9-8fad-43fa9e8acad4"
export const BASIC_AUTH = 'Basic ' + btoa(CUSTOMER_KEY + ':' + CUSTOMER_SECRECT);
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCf-IoQHALeoQNTQmPmrBVDbJl5y1x3uI8",
  authDomain: "shamdi-34989.firebaseapp.com",
  databaseURL: "https://shamdi-34989-default-rtdb.firebaseio.com",
  projectId: "shamdi-34989",
  storageBucket: "shamdi-34989.appspot.com",
  messagingSenderId: "570189132651",
  appId: "1:570189132651:web:b72e92d58876be247e122e",
  measurementId: "G-NZ06LNRE4V"
};
