import React from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import Colors from "../../../utils/Colors";
//PropTypes check
import PropTypes from "prop-types";

const { height, width } = Dimensions.get("window");

const DOT_SIZE = 20;

const Pagination = ({ scrollX, slides }) => {
  const dot_start = (slides.length - 1) / 2;
  let outputRange = [];
  let inputRange = [];
  for (let index = 0; index < slides.length; index++) {
    outputRange.push(DOT_SIZE * index - dot_start * DOT_SIZE);
    inputRange.push(width * index);
  }

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange,
  });
  return (
    <View style={[styles.pagination]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width,
        }}
      >
        <Animated.View
          style={[
            styles.paginationIndicator,
            {
              position: "absolute",
              transform: [{ translateX }],
            },
          ]}
        />
        {slides.map((item) => {
          return (
            <View key={item.id} style={styles.paginationDotContainer}>
              <View style={styles.paginationDot} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

Pagination.propTypes = {
  scrollX: PropTypes.object.isRequired,
  slides: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  pagination: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    height: DOT_SIZE,
    zIndex: 100,
    alignItems: "center",
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
    backgroundColor: "rgba(198, 198, 198, 0.5)",
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE * 0.5,
    height: DOT_SIZE * 0.5,
    zIndex: 101,
    borderRadius: DOT_SIZE * 0.25,
    backgroundColor: Colors.lighter_green,
  },
});

export default Pagination;
