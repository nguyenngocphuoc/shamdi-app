import { BACKEND_API_URL, BASIC_AUTH } from "../../utils/Config";
import { isEmptyOrSpaces } from "../../utils/Tools";
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
    let data = {
      "total": 100,
      "page": page,
      "pageSize": per_page,
      "content": []
    };
    let response = await axios.get(`${BACKEND_API_URL}/products?page=${page}&per_page=${per_page}` + (isEmptyOrSpaces(search) ? `&search=${search}` : ""), {
      headers: { 'Authorization': BASIC_AUTH }
    })
    if (response.data) {
      response.data.forEach(function (product) {
        data.content.push({
          "url": product.images[0].src,
          "thumb": product.images[0].src,
          "images": product.images.map(({ src }) => src),
          "_id": product.id,
          "filename": product.name,
          "price": product.price,
          "color": "blue",
          "origin": "Việt Nam",
          "standard": "New",
          "description": product.short_description,
          "type": product.categories && product.categories[0] ? product.categories[0].id : "order",
          "average_rating": product.average_rating,
          "rating_count": product.rating_count,
          "createdAt": product.date_created_gmt,
          "updatedAt": product.date_modified_gmt,
          "comments": [],
          "__v": 0
        })

      });

      response = { status: true, data, message: "ok" };
    } else {
      response = { status: false, data, message: "Tải dữ liệu lỗi" }
    }
    if (!response.status) {
      isFail = true;
      message += response.message;
    }
    const resData = response.data.content;
    return resData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export async function fetchProduct(_id = 0) {
  let data = {};
  try {
    let productRes = await axios.get(`${BACKEND_API_URL}/products/${_id}`, {
      headers: { 'Authorization': BASIC_AUTH }
    })
    let productReviewRes = await axios.get(`${BACKEND_API_URL}/products/reviews?product=${_id}`, {
      headers: { 'Authorization': BASIC_AUTH }
    })
    let response = { status: false, data, message: "Tải dữ liệu lỗi" }
    if (productRes.data) {
      const review = productReviewRes.data;
      const product = productRes.data;
      data = {
        "url": product.images[0].src,
        "thumb": product.images[0].src,
        "images": product.images.map(({ src }) => src),
        "_id": product.id,
        "filename": product.name,
        "price": product.price,
        "color": "blue",
        "origin": "Việt Nam",
        "standard": "New",
        "description": product.short_description,
        "type": product.categories && product.categories[0] ? product.categories[0].id : "order",
        "average_rating": product.average_rating,
        "rating_count": product.rating_count,
        "createdAt": product.date_created_gmt,
        "updatedAt": product.date_modified_gmt,
        "comments": review,
        "__v": 0
      };
      response = { status: true, data, message: "ok" };
    }
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
    let response = await axios.get(`${BACKEND_API_URL}/products/categories`, {
      headers: { 'Authorization': BASIC_AUTH }
    })
    let data = {
      "content": [{
        "id": "other",
        "bg": "https://firebasestorage.googleapis.com/v0/b/dmc2019-236614.appspot.com/o/bg3.jpg?alt=media&token=6595c8fd-f777-48d9-8fad-43fa9e8acad4",
        "name": "khác"
      }]
    };
    if (response.data) {
      response.data.forEach(function (categories) {
        data.content.push({
          "id": categories.id,
          "bg": categories.images && categories.images[0] ? categories.images[0].src : "https://firebasestorage.googleapis.com/v0/b/dmc2019-236614.appspot.com/o/bg3.jpg?alt=media&token=6595c8fd-f777-48d9-8fad-43fa9e8acad4",
          "name": categories.name
        })
      });
      response = { status: true, data, message: "ok" };
    }
    else {
      response = { status: false, data, message: "Tải dữ liệu lỗi" };
    }
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