import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../../../providers/main/theme";
import { OrdersScreen } from "../../../screens/order_screens/OrdersScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export function OrdersNavigator() {
  const { theme } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerTintColor: theme.tertiary,
        headerStyle: { backgroundColor: theme.card}
      }}
    >
      <Screen
        name='OrdersScreen'
        component={OrdersScreen}
        options={{ title: 'Pedidos' }}
      />
    </Navigator>
  )
}