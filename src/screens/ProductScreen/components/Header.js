import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
// import SearchInput from "./SearchInput";
import Animated from "react-native-reanimated";
import ShareItem from "../../../components/UI/ShareItem";
//Color
import Colors from "../../../utils/Colors";
import CustomText from "../../../components/UI/CustomText";
//icon
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
//PropTypes check
import PropTypes from "prop-types";

const { interpolate, Extrapolate } = Animated;
const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 180;
const HEADER_MIN = 90;
const HEADER_DISTANCE = HEADER_HEIGHT - HEADER_MIN;

export const Header = ({ navigation, searchFilterFunction, scrollY }) => {
  return (
    <>
      <View style={styles.topBar}>
        <View style={{ position: "absolute", left: 0, top: 40, zIndex: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.icon}
          >
            <Ionicons name="ios-arrow-back" size={25} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.shareItem}>
          <ShareItem
            imageURL="https://www.facebook.com/daquyankhangthinhvuong/"
            title="Share our facebook page"
            message="Our Facebook Link"
            color="black"
          />
        </View>
        <Animated.View
          style={{
            position: "absolute",
            width: width - 80,
            height: 40,
            top: 40,
          }}
        >
          <BlurView
            tint="dark"
            intensity={40}
            style={[{ width: "100%", borderRadius: 5 }]}
          >
            <TextInput
              placeholder="Tìm kiếm sản phẩm"
              placeholderTextColor={Colors.white}
              clearButtonMode="always"
              onChangeText={(text) => searchFilterFunction(text)}
              style={{
                height: 40,
                marginHorizontal: 20,
                color: Colors.white,
              }}
            />
          </BlurView>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.header,
        ]}
      >
      </Animated.View>
    </>
  );
};

Header.propTypes = {
  navigation: PropTypes.object.isRequired,
  searchFilterFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
    height: 90,
    zIndex: 100,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    height: 90,
    backgroundColor: Colors.lighter_green,
  },
  title: {
    marginTop: Platform.OS === "android" ? 0 : 5,
    fontSize: 30,
    color: Colors.white,
  },
  shareItem: {
    position: "absolute",
    right: 0,
    top: 40,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
