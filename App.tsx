import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider } from "react-redux";
import RootNavigator from "./src/navigation/RootNavigator";
import store from "./src/store/store";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
        {/* <SplashScreen/> */}
      </NavigationContainer>
    </Provider>
  );
}
