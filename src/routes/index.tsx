import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useTheme } from "../providers/main/theme";

import { MainRootNavigator } from "./main_routes";

export function Routes() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.card} barStyle='dark-content' />
      <MainRootNavigator />
    </NavigationContainer>
  )
}