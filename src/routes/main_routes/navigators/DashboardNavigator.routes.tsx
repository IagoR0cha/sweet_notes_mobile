import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DashboardScreen } from "../../../screens/DashboardScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export function DashboardNavigator() {

  return (
    <Navigator
      screenOptions={{ headerShown: false }}
    >
      <Screen
        name='DashboardScreen'
        component={DashboardScreen}
      />
    </Navigator>
  )
}