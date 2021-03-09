import {
  FETCH_PRODUCTS,
  PRODUCT_LOADING,
  PRODUCT_FAILURE,
  PRODUCT_DETAIL_LOADING,
  PRODUCT_DETAIL_FAILURE,
  FETCH_PRODUCT_DETAIL
} from "./productActions";
import { FIRST_OPEN } from "./checkFirstTimeActions";

const initialState = {
  product: {},
  products: [],
  categories: [],
  isFirstOpen: false,
  isLoading: false,
  isProductDetailLoading: false
};
export const productReducer = (state = initialState, action) => {
  let data = state;
  switch (action.type) {
    case PRODUCT_LOADING:
      data = {
        ...state,
        isLoading: true,
      };
      break;
    case PRODUCT_FAILURE:
      data = {
        ...state,
        isLoading: false,
      };
      break;
    case FETCH_PRODUCTS:
      data = {
        ...state,
        products: [...action.products],
        categories: [...action.categories],
        isLoading: false,
      };
      break;
    case FIRST_OPEN: {
      data = {
        ...state,
        isFirstOpen: true,
      };
      break;
    }
    default:
      data = state;
      break;
  }

  switch (action.product_detail) {
    case PRODUCT_DETAIL_LOADING:
      data["isProductDetailLoading"] = true;
      break;
    case PRODUCT_DETAIL_FAILURE:
      data["isProductDetailLoading"] = false;
      break;
    case FETCH_PRODUCT_DETAIL:
      data["isProductDetailLoading"] = false;
      data["product"] = action.product;
      break;
  }
  return data;
};
