import { API_URL, BASIC_AUTH, BACKEND_API_URL } from "../../utils/Config";
import { timeoutPromise } from "../../utils/Tools";
export const ORDER_LOADING = "ORDER_LOADING";
export const ORDER_FAILURE = "ORDER_FAILURE";
export const FETCH_ORDER = "FETCH_ORDER";
export const ADD_ORDER = "ADD_ORDER";
export const ERROR = "ERROR";
const axios = require('axios')

//Fetch order
export const fetchOrder = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: ORDER_LOADING,
    });
    const user = getState().auth.user;
    if (user.userid == undefined) {
      return;
    }
    try {
      let response = await axios.get(`${BACKEND_API_URL}/orders?customer=${user.userid}`, {
        headers: { 'Authorization': BASIC_AUTH }
      })
      if (!response.data) {
        dispatch({
          type: ORDER_FAILURE,
        });
        throw new Error("Something went wrong! Can't get your order");
      } else {
        const resData = response.data;
        const orderData = resData.map((data) => {
          let cartItems = [];
          if (data.line_items) {
            cartItems = data.line_items.map((item) => {
              return {
                quantity: item.quantity,
                item: {
                  filename: item.name,
                  selectedVariation: item.meta_data.map(({ value }) => value).join(" - "),
                  price: item.total,
                }
              }
            })
          }
          const result = {
            _id: data.id,
            date: data.date_created,
            name: data.billing.first_name + data.billing.last_name,
            address: data.billing.address_1,
            phone: data.billing.phone,
            paymentMethod: "bacs",
            items: cartItems,
            totalAmount: data.total,
            status: data.status
          }
          return result;
        });
        dispatch({
          type: FETCH_ORDER,
          orderData,
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

//Add order
export const addOrder = (
  cartItems,
  name,
  totalAmount,
  fullAddress,
  phone
) => {
  return async (dispatch, getState) => {
    dispatch({
      type: ORDER_LOADING,
    });
    const user = getState().auth.user;
    try {
      let line_items = [];
      cartItems.forEach(item => {
        const data = {
          product_id: item.item._id,
          quantity: item.quantity
        };
        if (item.item.variationsData && item.item.variationsData[item.item.selectedVariation]) {
          const variation_id = item.item.variationsData[item.item.selectedVariation].id;
          data["variation_id"] = variation_id;
        }
        line_items.push(data)
      });
      const data = {
        customer_id: user.userid,
        payment_method: "bacs",
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        billing: {
          customer_id: user.userid,
          first_name: "",
          last_name: name,
          address_1: fullAddress,
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "Việt Nam",
          email: user.email,
          phone: phone
        },
        shipping: {
          first_name: "",
          last_name: name,
          address_1: fullAddress,
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "Việt Nam"
        },
        line_items,
        shipping_lines: [
          {
            method_id: "flat_rate",
            method_title: "Flat Rate",
            total: "0.0"
          }
        ]
      };
      let response = await axios.post(`${BACKEND_API_URL}/orders`, data, {
        headers: { 'Authorization': BASIC_AUTH }
      })

      if (!response.data) {
        dispatch({
          type: ORDER_FAILURE,
        });
        throw new Error("Something went wrong!");
      }

      const resData = response.data;
      const orderData = {
        _id: resData.id,
        date: resData.date_created,
        name,
        address: fullAddress,
        phone,
        paymentMethod: "bacs",
        items: cartItems,
        totalAmount,
        status: "pending"
      }
      dispatch({
        type: ADD_ORDER,
        orderItem: orderData,
      });
    } catch (err) {
      throw err;
    }
  };
};
