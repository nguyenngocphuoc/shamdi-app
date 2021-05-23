import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../../../utils/Colors";
import { Button } from "react-native-paper";
//PropTypes check
import PropTypes from "prop-types";

const UploadButton = ({
  user,
  navigation,
}) => {
  return (
    <View style={styles.button}>
      <Button
        mode='contained'
        onPress={() => navigation.navigate("ProfileEdit", { user })}
        style={{
          height: 50,
          justifyContent: "center",
          backgroundColor: Colors.leave_green,
        }}
      >
        cập nhập thông tin cá nhân
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  button: {
    marginTop: 30,
  },
});

export default UploadButton;
