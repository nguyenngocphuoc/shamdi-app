import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
//redux
import { useSelector } from "react-redux";
//Color
import Colors from "../../utils/Colors";
//Component
import { ProductBody } from "./components";
const axios = require('axios')
//
import { BACKEND_API_URL, BASIC_AUTH } from "../../utils/Config";
import { isEmptyOrSpaces, variationsData } from "../../utils/Tools";
//
import Spinner from 'react-native-loading-spinner-overlay';

export const ProductScreen = (props) => {
  const products = useSelector((state) => state.store.products);
  const [loading, setLoading] = useState(false);
  const [productsFilter, setproductsFilter] = useState(products);
  const searchFilterFunction = (text) => {
    if (text) {
      const search = async () => {
        setLoading(true);
        const data = await getData(50, 1, text);
        setLoading(false);
        setproductsFilter(data);
      }
      search();
    }
  };
  const getData = async (per_page = 20, page = 1, search = "") => {
    let response = await axios.get(`${BACKEND_API_URL}/products?page=${page}&per_page=${per_page}` + (!isEmptyOrSpaces(search) ? `&search=${search}` : ""), {
      headers: { 'Authorization': BASIC_AUTH }
    })
    let data = {
      "total": 100,
      "page": page,
      "pageSize": per_page,
      "content": []
    };
    if (response.data) {
      response.data.forEach(function (product) {
        data.content.push({
          "url": product.images[0].src,
          "thumb": product.images[0].src,
          "images": product.images.map(({ src }) => src),
          "_id": product.id,
          "permalink": product.permalink,
          "filename": product.name,
          "price": product.price,
          "color": "blue",
          "attributes": product.attributes,
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
  }
  return (
    <View style={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={'Đang tải...'}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <ProductBody
        navigation={props.navigation}
        productsFilter={productsFilter}
        searchFilterFunction={searchFilterFunction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
