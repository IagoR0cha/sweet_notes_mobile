import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MenuScreen } from "../../../screens/MenuScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export function MenuNavigator() {

  return (
    <Navigator
      screenOptions={{ headerShown: false }}
    >
      <Screen
        name='MenuScreen'
        component={MenuScreen}
      />
    </Navigator>
  )
}