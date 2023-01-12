import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../../../providers/main/theme";
import { ProductsScreen } from "../../../screens/product_screens/ProductsScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export function ProductsNavigator() {
  const { theme } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerTintColor: theme.tertiary,
        headerStyle: { backgroundColor: theme.card},
      }}
    >
      <Screen
        name='ProductsScreen'
        component={ProductsScreen}
        options={{ title: 'Produtos' }}
      />
    </Navigator>
  )
}