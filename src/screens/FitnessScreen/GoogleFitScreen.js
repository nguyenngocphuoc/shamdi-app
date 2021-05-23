import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, ScrollView, StyleSheet, PermissionsAndroid } from "react-native";
import FitImage from "../../components/UI/FitImage";
import FitHealthStat from "../../components/UI/FitHealthStat";
import FitExerciseStat from "../../components/UI/FitExerciseStat";
import FitChart from "../../components/UI/FitChart";
import AdditionalStats from "../../components/UI/AdditionalStats";
import Header from "./Header";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
const { width } = Dimensions.get("screen");
const sleepData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
        {
            data: [9, 6, 6.5, 8, 6, 7, 9],
            baseline: 8
        }
    ]
};

const stepsData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
        {
            data: [10000, 9000, 2000, 3000, 8000, 11000, 10500, 1000],
            baseline: 10000
        }
    ]
};
const LOCATION_TASK_NAME = "locationTask";
const GoogleFitScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    let [curDistance, setCurDistance] = useState(0);
    let [distance, setDistance] = useState(10);
    useEffect(() => {
        (async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                alert("Quyền truy cập vị trí đã bị từ chối!");
            } else {
                try {
                    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.BestForNavigation,
                        distanceInterval: 10,
                        activityType: Location.ActivityType.Fitness
                    })
                    Location.watchPositionAsync(
                        {
                            accuracy: Location.Accuracy.BestForNavigation,
                            activityType: Location.ActivityType.Fitness
                        },
                        (location) => {
                            if (location) {
                                //curDistance += location.coords.speed / 1000
                                setCurDistance(Math.floor((Math.random() * 10) + 1));
                                setLocation(location.coords);
                            }
                        }
                    );
                } catch (error) {
                    alert(error)
                }
            }
            /*      const granted = await PermissionsAndroid.request(
                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                     {
                         'title': 'Chia sẻ vị trí',
                         'message': 'Shamdi cần truy cập vị trí của bạn'
                     }
                 )
                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                     console.log("You can use the location")
                 } else {
                     setErrorMsg('Permission to access location was denied');
                 } */

            return () => {

            };
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView style={{ backgroundColor: "#1f2026" }}>
                <View>
                    <FitImage
                        curSpeed={location ? location.speed : 0}
                        maxSpeed={10}
                        curDistance={curDistance}
                        distance={distance}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        marginLeft: width * 0.15,
                        marginRight: width * 0.15,
                        marginBottom: width * 0.05,
                    }}
                >
                    <FitHealthStat
                        iconBackgroundColor="#183b57"
                        iconColor="#0e8df2"
                        actual={location ? location.speed.toFixed(1) : 0}
                        over=" "
                        type="Speed (m/s)"
                    />
                    <FitHealthStat
                        iconBackgroundColor="#124b41"
                        iconColor="#03ddb3"
                        actual={curDistance.toFixed(2)}
                        over={"/" + distance}
                        type="Distant (Km)"
                        doubleIcon
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        marginLeft: width * 0.1,
                        marginRight: width * 0.1,
                        marginBottom: width * 0.05,
                    }}
                >
                    <View>
                        <FitExerciseStat quantity="8225" type="steps" />
                    </View>
                    <View>
                        <Text style={{ color: "#9a9ba1", fontSize: 40, fontWeight: "100" }}>
                            |
          </Text>
                    </View>
                    <View>
                        <FitExerciseStat quantity="6432" type="cal" />
                    </View>
                    <View>
                        <Text style={{ color: "#9a9ba1", fontSize: 40, fontWeight: "100" }}>
                            |
          </Text>
                    </View>
                    <View>
                        <FitExerciseStat quantity="5.2" type="km" />
                    </View>
                </View>
                <View>
                    <FitChart
                        title={"Sleep"}
                        description={"7h 48m • Yesterday"}
                        data={sleepData}
                        baseline={8}
                    />
                    <FitChart
                        title={"Take 10,000 steps a day"}
                        data={stepsData}
                        baseline={10000}
                    />
                </View>
                <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <AdditionalStats name="Heart rate" description="No recent data" />
                    <AdditionalStats name="Weight" description="69 kg • Mar 14" />
                    <AdditionalStats
                        name="Blood pressure"
                        description="120/70 mmHg • Apr 27, 2019"
                    />
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1f2026",
    },
});
export default GoogleFitScreen;
