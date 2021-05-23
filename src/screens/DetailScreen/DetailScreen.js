import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, BackHandler, Text } from 'react-native';
//Color
import Colors from '../../utils/Colors';
//Redux
import { useSelector, useDispatch } from 'react-redux';
//Components
import Snackbar from '../../components/Notification/Snackbar';
// fetch
import { fetchProductDetail, fetchFavorite } from '../../reducers';
// loading
import Skeleton from '../../components/Loaders/SkeletonProductDetailLoading';
//image slider
import { SliderBox } from "react-native-image-slider-box";
//icon 
import { Ionicons } from "@expo/vector-icons";
import {
  Header,
  DetailBody,
  ActionButton,
  ModalComp,
  Comments,
} from './components';
import CustomText from '../../components/UI/CustomText';
const { width, height } = Dimensions.get("window");
export const DetailScreen = (props) => {
  const dispatch = useDispatch();
  const scrollY = new Animated.Value(0);
  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.store.product);
  const favoriteList = useSelector((state) => state.fav.favoriteList);
  const isProductDetailLoading = useSelector((state) => state.store.isProductDetailLoading);
  let { item } = props.route.params;
  const [message, setMessage] = useState('');
  //full screen
  let [showFullScreen, setShowFullScreen] = useState(false);
  //selected option
  const [selectedOption, setSelectedOption] = useState(() => {
    if (item.attributes) {
      return item.attributes.map(({ options }) => options[0]);
    }
    return [];
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  //color
  const [modalVisible, setModalVisible] = useState(false);
  //Favorite
  const [favoriteProducts, setFavoriteProducts] = useState(favoriteList.some((product) => product.item._id === item._id));
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    const fetching = async () => {
      try {
        await dispatch(fetchFavorite());
        await dispatch(fetchProductDetail(item._id));
      } catch (err) {
        alert(err);
      }
    };
    fetching();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [item, showFullScreen]);
  const onFullScreen = () => {
    setShowFullScreen(true);
  }
  const handleBackButtonClick = () => {
    if (showFullScreen) {
      setShowFullScreen(false);
    } else {
      props.navigation.goBack();
    }

    return true;
  }
  const onSelectedOptionChange = (value) => {
    setSelectedOption(value);
  }
  if (showFullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              setShowFullScreen(false);
            }}
            style={styles.goBackIcon}
          >
            <View>
              <Ionicons name="ios-arrow-back" size={25} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <SliderBox circleLoop={true} images={item.images} />
      </View>)
  }
  return (
    <View style={styles.container}>
      {showSnackbar ? (
        <Snackbar checkVisible={showSnackbar} message={message} />
      ) : (
        <View />
      )}
      <Header navigation={props.navigation} scrollY={scrollY} item={item} onFullScreen={onFullScreen} />
      <Animated.ScrollView
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <DetailBody
          item={isProductDetailLoading ? item : product}
          color={Colors.lighter_green}
          onSelectedOptionChange={onSelectedOptionChange}
          prevSelectedOption={selectedOption}
          isProductDetailLoading={isProductDetailLoading}
        />
        <Comments item={isProductDetailLoading ? item : product} />
      </Animated.ScrollView>
      <ActionButton
        item={isProductDetailLoading ? item : product}
        FavoriteProducts={favoriteProducts}
        setFavoriteProducts={setFavoriteProducts}
        setShowSnackbar={setShowSnackbar}
        setModalVisible={setModalVisible}
        setMessage={setMessage}
        user={user}
        color={Colors.lighter_green}
        variations={selectedOption.join("-")}
        isProductDetailLoading={isProductDetailLoading}
      />
      <ModalComp
        item={isProductDetailLoading ? item : product}
        color={Colors.lighter_green}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={props.navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
    justifyContent: "center",
    height: height,
  },
  fullScreenContainer: {
    flex: 1,
  },
  topBar: {
    paddingTop: Platform.OS === "android" ? 15 : 25,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    height: 80,
    zIndex: 1000,
  },
  goBackIcon: {
    width: 40,
  }
});
