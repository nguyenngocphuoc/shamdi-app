import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../../../components/UI/CustomText";
import Colors from "../../../utils/Colors";
import UserComment from "./UserComment";
import { BACKEND_API_URL, BASIC_AUTH } from "../../../utils/Config";
const axios = require('axios')
//import comments from "../../../db/Comments";
const { width, height } = Dimensions.get("window");

export const Comments = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [textComment, setTextComment] = useState("");
  const modalizeRef = useRef(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const item = props.item;
  if (!item.comments) {
    item.comments = [];
  }
  const onSendComment = async () => {
    const data = {
      product_id: item._id,
      review: textComment,
      reviewer: user.name,
      reviewer_email: user.email,
      rating: 5,
      status: "hold"
    };
    console.log(`${BACKEND_API_URL}/products/reviews`);
    try {
      let response = await axios.post(`${BACKEND_API_URL}/products/reviews`, data, {
        headers: { 'Authorization': BASIC_AUTH }
      })
      Alert.alert(
        'Chúc mừng !',
        'Chúng tôi đã nhận được bình luận của bạn, chúc bạn 1 ngày mua sắm vui vẻ',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      )
    } catch (error) {
      alert(error);
    } finally {
      setTextComment("");
    }
  }
  return (
    <>
      <View style={styles.commentContainer}>
        <TouchableOpacity onPress={onOpen}>
          <CustomText style={styles.title}>Comments</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.commentCount}>{item.comments.length}</CustomText>
      </View>
      <Portal>
        <Modalize ref={modalizeRef} snapPoint={height - 200}>
          <View style={styles.contentContainer}>
            {Object.keys(user).length === 0 ? (
              <></>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.profileContainer}>
                  <Image
                    style={styles.profilePic}
                    source={
                      user.profilePicture.length === 0
                        ? require("../../../assets/Images/defaultprofile.jpg")
                        : { uri: user.profilePicture }
                    }
                  />
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    width: "75%",
                  }}
                >
                  <BlurView tint='dark' intensity={10} style={styles.inputBlur}>
                    <TextInput
                      value={textComment}
                      placeholder='Add a public comment...'
                      style={{ width: "100%" }}
                      onChangeText={(text) => setTextComment(text)}
                    />
                  </BlurView>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={onSendComment}
                  >
                    <Entypo
                      name='paper-plane'
                      size={25}
                      color={textComment.length === 0 ? Colors.grey : Colors.blue}
                    />
                  </TouchableOpacity>

                </View>
              </View>
            )}
            {item.comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.light_grey,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  commentCount: {
    fontSize: 15,
    marginHorizontal: 15,
    color: Colors.grey,
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    height: 60,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_grey,
  },
  inputBlur: {
    height: 40,
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  profileContainer: {
    justifyContent: "center",
  },
  profilePic: {
    resizeMode: Platform.OS === "android" ? "cover" : "contain",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
