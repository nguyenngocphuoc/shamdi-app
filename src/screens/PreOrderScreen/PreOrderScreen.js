import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, ScrollView } from "react-native";
//Address
import Address from "./components/Address";
//Redux
import { addOrder, resetCart } from '../../reducers';
import { useDispatch, useSelector } from 'react-redux';
//Steps
import Colors from "../../utils/Colors";
import { Header, SummaryOrder, TotalButton, UserForm } from "./components";
import Loader from "../../components/Loaders/Loader";

export const PreOrderScreen = (props) => {
  const dispatch = useDispatch();
  const unmounted = useRef(false);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const orders = useSelector((state) => state.order.orders);
  const carts = useSelector((state) => state.cart.cartItems);
  const { cartItems, total, cartId } = props.route.params;
  const [error, setError] = useState("");
  //Can Toi uu lai
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  const [province, setProvince] = useState("");
  const [town, setTown] = useState("");
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  const getReceiver = (name, phone, address) => {
    setName(name);
    setPhone(phone);
    setAddress(address);
  };
  const checkValidation = (error) => {
    setError(error);
  };

  const fullAddress = `${address}, ${town} ,${province}`;
  //action Add Order
  const addOrderAct = async () => {
    try {
      setLoading(true);
      await dispatch(
        addOrder(
          cartItems,
          name,
          total,
          fullAddress,
          phone,
        ),
      );
      await dispatch(resetCart(cartId));
      props.navigation.navigate('FinishOrder');
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    if (carts.items.length === 0) {
      props.navigation.goBack();
    }
  }, [carts.items]);
  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <ScrollView>
            <UserForm
              getReceiver={getReceiver}
              checkValidation={checkValidation}
            />
            <SummaryOrder cartItems={cartItems} total={total} />
          </ScrollView>
          <TotalButton isLoading={orders.isLoading} toPayment={addOrderAct} />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
});
