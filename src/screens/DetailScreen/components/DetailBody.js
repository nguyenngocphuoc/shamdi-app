import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
//Animatable
import * as Animatable from "react-native-animatable";
//icon
import { AntDesign } from "@expo/vector-icons";
//import CustomText
import CustomText from "../../../components/UI/CustomText";
//Color
import Colors from "../../../utils/Colors";
//number format
import NumberFormat from "../../../components/UI/NumberFormat";
//PropTypes check
import PropTypes from "prop-types";
//html parse
import HTML from 'react-native-render-html';
// sharebtn
import ShareItem from "../../../components/UI/ShareItem";

const { width, height } = Dimensions.get("window");

export const DetailBody = ({ item, color }) => {
  const star = (rating) => {
    let result = [];
    for (let index = 0; index < 5; index++) {
      const delay = index * 100 + 1600;
      let starColor = "#003300";
      if (index < rating) {
        starColor = color;
      }
      result.push(
        <Animatable.View animation="bounceIn" delay={delay}>
          <AntDesign name="star" size={15} color={starColor} />
        </Animatable.View>
      );
    }
    return (
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        {result}
        {
          <Animatable.View animation="bounceIn" delay={2100}>
            <CustomText>({rating})</CustomText>
          </Animatable.View>
        }
        {
          <Animatable.View animation="bounceIn" delay={2200}>
            <View style={styles.shareIcon}>
              <ShareItem
                imageURL={item.url}
                title={item.filename}
                message={item.filename}
              />
            </View>
          </Animatable.View>
        }
      </View>);
  }
  return (
    <View style={[styles.footer]}>
      <Animatable.View
        animation="lightSpeedIn"
        delay={1000}
        style={styles.footer_header}
      >
        <CustomText selectable={true} style={{ ...styles.title, color }}>
          {item.filename}
        </CustomText>
        <NumberFormat
          style={{ color: "#fff", fontSize: 13 }}
          price={item.price}
          color={color}
        />
      </Animatable.View>
      {star(item.average_rating)}
      <Animatable.View
        animation="fadeInUpBig"
        delay={1000}
        style={styles.description}
      >
        <CustomText
          style={{
            ...styles.title,
            fontWeight: "500",
            marginTop: 20,
            marginBottom: 10,
            textDecorationLine: "underline",
          }}
        >
          Chi ti???t
        </CustomText>
        <View style={styles.infoContainer}>
          <CustomText>M??u s???c: </CustomText>
          <CustomText style={{ color: color }}>{item.color}</CustomText>
        </View>
        <View style={styles.infoContainer}>
          <CustomText>T??nh tr???ng: </CustomText>
          <CustomText>{item.standard}</CustomText>
        </View>
        <View style={styles.infoContainer}>
          <CustomText>Xu???t x???: </CustomText>
          <CustomText>{item.origin}</CustomText>
        </View>
        <CustomText
          style={{
            ...styles.title,
            textDecorationLine: "underline",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          Mi??u t???
        </CustomText>
        <ScrollView style={{ flex: 1 }}>
          <HTML html={item.description} imagesMaxWidth={Dimensions.get('window').width} />
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

DetailBody.propTypes = {
  item: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  footer: {
    width,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    marginTop: 200,
    borderRadius: 30,
  },
  footer_header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shareIcon: {
    marginRight: 20,
    flexDirection: "row",
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    maxWidth: "80%",
    fontSize: 17,
    color: Colors.text,
  },
  detail: {
    fontSize: 15,
    lineHeight: 20,
  },

  price: {
    color: "#fff",
  },
  description: {
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 10,
    flexDirection: "row",
  },
});
