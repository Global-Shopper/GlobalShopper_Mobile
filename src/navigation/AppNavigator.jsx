import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import IntroScreen from "../screens/IntroScreen";
// import DetailScreen from "../screens/DetailScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();
//Lưu ý các navigator phải được import vào đây và được sử dụng trong hàm AppNavigator
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="IntroScreen">
      <Stack.Screen
        name="IntroScreen"
        component={IntroScreen}
        options={{ headerShown: false }} // Hide header for intro screen
      />
      <Stack.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }} // Hide header for tab navigator
      />
      {/* <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Detail" }}
      /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;