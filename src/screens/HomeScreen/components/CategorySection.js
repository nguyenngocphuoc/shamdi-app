import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProductItem } from "./ProductItem";
import CustomText from "../../../components/UI/CustomText";
import Colors from "../../../utils/Colors";
import { BlurView } from "expo-blur";
import { AsyncStorage } from 'react-native';
import CURRENT_CATEGORY_ID from '../../../utils/Config'
//PropTypes check
import PropTypes from "prop-types";
export class CategorySection extends React.PureComponent {
  render() {
    const { data, name, bg, navigation, id } = this.props;
    const items = data.filter((product) => product.type === id).slice(0, 2);
    if (items.length <= 0) return (<View></View>);

    let Image_Http_URL = { uri: bg };
    return (
      <View style={[styles.category]}>
        <Image style={styles.background} source={Image_Http_URL} blurRadius={10} />
        <View style={styles.titleHeader}>
          <CustomText style={styles.title}>{name}</CustomText>
        </View>
        <View style={styles.productList}>
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.list}
            renderItem={({ item }) => {
              return (
                <ProductItem
                  key={item._id}
                  item={item}
                  navigation={navigation}
                />
              );
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            const setCategory = async () => {
              try {
                navigation.navigate("Product");
              } catch (err) {
                alert(err);
              }
            };
            setCategory();
          }}
          style={{ marginHorizontal: 10 }}
        >
          <BlurView tint="light" intensity={100} style={styles.seeMore}>
            <CustomText style={styles.seeMoreText}>Xem Thêm</CustomText>
          </BlurView>
        </TouchableOpacity>
      </View>
    );
  }
}

CategorySection.propTypes = {
  data: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  category: {
    height: 400,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 15,
    borderRadius: 5,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    resizeMode: "stretch",
    borderRadius: 5,
    height: 400,
    width: "100%",
    bottom: 0,
  },
  titleHeader: {
    marginHorizontal: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: Colors.light_green,
    fontWeight: "500",
  },
  list: {
    justifyContent: "space-between",
  },
  productList: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  seeMore: {
    // backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: "100%",
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 14,
    color: Colors.lighter_green,
  },
});
