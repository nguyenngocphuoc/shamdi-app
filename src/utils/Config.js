import { btoa } from "../utils/Tools";
const CUSTOMER_KEY = 'ck_465e904eca4e0a68f694aed1face61f2770cc323';
const CUSTOMER_SECRECT = 'cs_79697755571942636023f02ca426719fbb6a34cc';
// API URL
export const API_URL = "https://e-commerce-ct-backend.herokuapp.com/api/v1";
export const BACKEND_API_URL = "https://shamdi.vn/wp-json/wc/v3";
export const secretKey = "Drmhze6EPcv0fN_81Bj-nAq241aA1";
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51HLo2AD28q5Rme0eq3Q6J16dQEa0d38VoeY6ZJu8u3m1jzKcswvDmNkrNn6CqSCLv38tBNwdOOOKvLylPAPNYSpq00Vs0wQ3SV";
export const BASIC_AUTH = 'Basic ' + btoa(CUSTOMER_KEY + ':' + CUSTOMER_SECRECT);