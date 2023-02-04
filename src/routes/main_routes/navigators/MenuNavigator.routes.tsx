import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../../../providers/main/theme";

import { MenuScreen } from "../../../screens/MenuScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export function MenuNavigator() {
  const { theme } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerTintColor: theme.tertiary,
        headerStyle: { backgroundColor: theme.card},
      }}
    >
      <Screen
        name='MenuScreen'
        component={MenuScreen}
        options={{ title: 'Menu' }}
      />
    </Navigator>
  )
}