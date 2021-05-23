// Import react
import React, { useState } from 'react';
// Import react-native components
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Platform,
  StatusBar,
  TextInput
} from 'react-native';
//icon
import { Ionicons } from '@expo/vector-icons';
//Colors
import Colors from '../../../utils/Colors';
//Search Item component
import SearchItem from './SearchItem';
import Animated, { Easing } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
const axios = require('axios')
//
import { BACKEND_API_URL, BASIC_AUTH } from "../../../utils/Config";
import { isEmptyOrSpaces, variationsData } from "../../../utils/Tools";
//
import Spinner from 'react-native-loading-spinner-overlay';

const { Value, timing } = Animated;
// Calculate window size
const { width, height } = Dimensions.get('window');

export class Header extends React.Component {
  constructor(props) {
    super(props);
    // state
    this.state = {
      loading: false,
      isFocused: false,
      keyword: '',
      productsFilter: '',
      searched: false
    };
    // animation values
    this._input_box_translate_x = new Value(width);
    this._back_button_opacity = new Value(0);
    this._content_translate_y = new Value(height);
    this._content_opacity = new Value(0);
  }
  //Search
  searchFilterFunction = (searchText) => {
    this.setState({ keyword: searchText });
  };
  onSearch = () => {
    const search = async () => {
      this.setState({ loading: true });
      const data = await this.getData(50, 1, this.state.keyword);
      this.setState({ loading: false, productsFilter: data, searched: true });
    }
    search();
  }
  getData = async (per_page = 20, page = 1, search = "") => {
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
  _onFocus = () => {
    // update state
    this.setState({ isFocused: true });
    // animation config
    // input box
    const input_box_translate_x_config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    const back_button_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };
    // content
    const content_translate_y_config = {
      duration: 0,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };
    // run animation
    timing(this._input_box_translate_x, input_box_translate_x_config).start();
    timing(this._back_button_opacity, back_button_opacity_config).start();
    timing(this._content_translate_y, content_translate_y_config).start();
    timing(this._content_opacity, content_opacity_config).start();
    // force focus
    this.refs.input.focus();
  };
  _onBlur = () => {
    // update state
    this.setState({ isFocused: false });
    // animation config
    // input box
    const input_box_translate_x_config = {
      duration: 50,
      toValue: width,
      easing: Easing.inOut(Easing.ease),
    };
    const back_button_opacity_config = {
      duration: 50,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };

    // content
    const content_translate_y_config = {
      duration: 0,
      toValue: height,
      easing: Easing.inOut(Easing.ease),
    };
    const content_opacity_config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };
    // run animation
    timing(this._input_box_translate_x, input_box_translate_x_config).start();
    timing(this._back_button_opacity, back_button_opacity_config).start();
    timing(this._content_translate_y, content_translate_y_config).start();
    timing(this._content_opacity, content_opacity_config).start();
    // force blur
    this.refs.input.blur();
  };

  render() {
    const scrollY = this.props.scrollPoint;
    const headerPlatform = 50;
    const clampedScrollY = scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    });
    const _diff_clamp_scroll_y = Animated.diffClamp(
      clampedScrollY,
      0,
      headerPlatform,
    );
    const _header_translate_y = this.state.isFocused ? 0 : Animated.interpolate(_diff_clamp_scroll_y, {
      inputRange: [0, headerPlatform],
      outputRange: [0, -headerPlatform],
      extrapolate: 'clamp',
    });
    const _header_opacity = this.state.isFocused ? 1 : Animated.interpolate(_diff_clamp_scroll_y, {
      inputRange: [0, headerPlatform],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    // const ViewPlatForm = Platform.OS === "android" ? SafeAreaView : View;
    return (
      <>
        <SafeAreaView
          style={{ ...styles.header_safe_area, ...this.props.style }}
        >
          <Animated.View
            style={[
              styles.header,
              {
                transform: [
                  {
                    translateY: _header_translate_y,
                  },
                ],
                opacity: _header_opacity,
              },
            ]}
          >
            <View style={styles.header_inner}>
              <TouchableOpacity
                onPress={() => this.props.navigation.toggleDrawer()}
                activeOpacity={1}
              >
                <Ionicons
                  name='ios-menu'
                  size={30}
                  color={Colors.lighter_green}
                />
              </TouchableOpacity>
              <View>
                <Image
                  source={require('../../../assets/Images/logoNoText.png')}
                  style={{
                    width: height < 668 ? 130 : 120,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <TouchableOpacity
                activeOpacity={1}
                underlayColor={'#ccd0d5'}
                onPress={this._onFocus}
                style={styles.search_icon_box}
              >
                <Ionicons name='ios-search' size={20} color={Colors.white} />
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.input_box,
                  { transform: [{ translateX: this._input_box_translate_x }] },
                ]}
              >
                <Animated.View style={{ opacity: this._back_button_opacity }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor={'#ccd0d5'}
                    onPress={this._onBlur}
                    style={styles.back_icon_box}
                  >
                    <Ionicons
                      name='ios-arrow-back'
                      size={25}
                      color={Colors.light_green}
                    />
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View>
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor={'#ccd0d5'}
                    onPress={() => { this.refs.input.focus(); }}
                    style={{
                      width: width - 80,
                      height: 40,
                      borderRadius: 40,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TextInput
                      ref='input'
                      placeholder='Tìm kiếm sản phẩm'
                      onChangeText={(value) => this.searchFilterFunction(value)}
                      style={styles.input}
                    />
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{ opacity: this._back_button_opacity }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor={'#ccd0d5'}
                    onPress={() => { this.onSearch() }}
                    style={styles.back_icon_box}
                  >
                    <Ionicons
                      name='ios-search'
                      size={25}
                      color={Colors.light_green}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </View>
          </Animated.View>
        </SafeAreaView>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: this._content_opacity,
              transform: [{ translateY: this._content_translate_y }],
            },
          ]}
        >
          <View style={styles.content_safe_area}>
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={this.state.loading}
              //Text with the Spinner
              textContent={'Đang tải...'}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
            {!this.state.searched ? (
              <View style={styles.image_placeholder_container}>
                <Image
                  source={require('../../../assets/Images/logo1.png')}
                  style={styles.image_placeholder}
                />
                <Text style={styles.image_placeholder_text}>
                  Nhập vào từ khóa{'\n'}
                  để tìm kiếm :D
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginHorizontal: 4,
                  marginTop:
                    Platform.OS === 'android' ? 0 : height < 668 ? 0 : 60,
                }}
              >
                {this.state.productsFilter.length === 0 ? (
                  <Text style={styles.image_placeholder_text}>
                    Không tìm thấy sản phầm
                  </Text>
                ) : (
                  <FlatList
                    data={this.state.productsFilter}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => {
                      return (
                        <SearchItem
                          item={item}
                          navigation={this.props.navigation}
                        />
                      );
                    }}
                  />
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header_safe_area: {
    zIndex: 1000,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    position: 'absolute',
    backgroundColor: Colors.white,
    width,
    height: 50,
    top:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : height > 736
          ? 40
          : 20,
  },
  header_inner: {

    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  search_icon_box: {
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: Colors.lighter_green,
    borderWidth: 1,
    borderColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input_box: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.white,
    width: width,
  },
  back_icon_box: {
    width: 40,
    height: 40,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.light_grey,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    marginHorizontal: 20,
  },
  content: {
    width: width,
    height: height,
    position: 'absolute',
    left: 0,
    zIndex: 999,
  },
  content_safe_area: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 80 : 40,
    paddingBottom: 40,
    backgroundColor: Colors.white,
  },
  content_inner: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light_grey,
  },
  image_placeholder_container: {
    flexDirection: 'column',
    marginTop: 100,
  },
  image_placeholder: {
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  image_placeholder_text: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 5,
  },
  search_item: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e4eb',
    marginLeft: 16,
  },
  item_icon: {
    marginRight: 15,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
