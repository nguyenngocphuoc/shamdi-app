import { BACKEND_API_URL } from "../../utils/Config";
import { timeoutPromise } from "../../utils/Tools";
const axios = require('axios')

export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const PRODUCT_LOADING = "PRODUCT_LOADING";
export const PRODUCT_FAILURE = "PRODUCT_FAILURE";
export const FETCH_PRODUCTS_DEFAULT = "FETCH_PRODUCTS_DEFAULT";
export const PRODUCT_DETAIL_LOADING = "PRODUCT_DETAIL_LOADING";
export const PRODUCT_DETAIL_FAILURE = "PRODUCT_DETAIL_FAILURE";
export const FETCH_PRODUCT_DETAIL = "FETCH_PRODUCT_DETAIL";
let isFail = false;
let message = "";
export async function fetchProducts(per_page = 20, page = 1, search = "") {
  try {
    let response = await axios.get(`${BACKEND_API_URL}/products?page=${page}&per_page=${per_page}&search=${search}`)
    response = response.data;
    if (!response.status) {
      isFail = true;
      message += response.message;
    }
    const resData = response.data.content;
    return resData;
  } catch (err) {
    throw err;
  }
};
export async function fetchProduct(_id = 0) {
  try {
    let response = await axios.get(`${BACKEND_API_URL}/products/${_id}`)
    response = response.data;
    if (!response.status) {
      isFail = true;
      message += response.message;
    }
    const resData = response.data;
    return resData;
  } catch (err) {
    throw err;
  }
};
export async function fetchProductCategories() {
  try {
    let response = await axios.get(`${BACKEND_API_URL}/categories`)
    response = response.data;
    if (!response.status) {
      isFail = true;
      message += response.message;
    }
    const resData = response.data.content;
    return resData;
  } catch (err) {
    throw err;
  }
};

export const fetchData = (per_page = 20, page = 1, search = "") => {
  return async (dispatch) => {
    dispatch({
      type: PRODUCT_LOADING,
    });
    try {
      const products = await fetchProducts(per_page, page,);
      const categories = await fetchProductCategories();
      if (isFail) {
        dispatch({
          type: PRODUCT_FAILURE,
        });
        throw new Error(message);
      }
      dispatch({
        type: FETCH_PRODUCTS,
        products,
        categories
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchProductDetail = (_id = 0) => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_PRODUCTS_DEFAULT,
      product_detail: PRODUCT_DETAIL_LOADING
    });
    try {
      const product = await fetchProduct(_id);
      if (isFail) {
        dispatch({
          type: FETCH_PRODUCTS_DEFAULT,
          product_detail: PRODUCT_DETAIL_FAILURE
        });
        throw new Error(message);
      }
      dispatch({
        type: FETCH_PRODUCTS_DEFAULT,
        product_detail: FETCH_PRODUCT_DETAIL,
        product
      });
    } catch (err) {
      throw err;
    }
  };
};