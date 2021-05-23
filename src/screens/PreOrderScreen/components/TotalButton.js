import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../../../utils/Colors';
//Text
import CustomText from '../../../components/UI/CustomText';
//PropTypes check
import PropTypes from 'prop-types';

export const TotalButton = ({ toPayment, isLoading }) => {
  return (
    <View style={styles.total}>
      <TouchableOpacity onPress={toPayment}>
        <View style={styles.buttom}>
          {(isLoading) ? (
            <ActivityIndicator size='small' color='#fff' />
          ) : (
            <CustomText style={{ color: '#fff', fontSize: 16 }}>
              Đặt hàng
            </CustomText>
          )}

        </View>
      </TouchableOpacity>
    </View>
  );
};

TotalButton.propTypes = {
  toPayment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  total: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    left: 0,
    paddingHorizontal: 10,
  },
  buttom: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
});
