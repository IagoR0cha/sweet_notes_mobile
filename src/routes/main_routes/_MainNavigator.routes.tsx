import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { MainTabsRoutes } from "./_MainTabs.routes";
import { CreateEditProductScreen } from '../../screens/product_screens/CreateEditProductScreen';
import { useTheme } from '../../providers/main/theme';
import { CreateEditOrderScreen } from '../../screens/order_screens/CreateEditOrderScreen';

export type NavigationStack = NativeStackNavigationProp<MainNavigatorParamList, keyof MainNavigatorParamList>

export type MainNavigatorParamList = {
  Root: undefined;
  CreateEditProducts: { title?: string, id?: number } | undefined;
  CreateEditOrder: { title?: string, id?: number } | undefined;
}

const { Navigator, Screen } = createNativeStackNavigator<MainNavigatorParamList>();

export function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Navigator>
      <Screen
        name='Root'
        component={MainTabsRoutes}
        options={{ headerShown: false }}
      />
      <Screen
        name='CreateEditProducts'
        component={CreateEditProductScreen}
        options={{
          headerTintColor: theme.tertiary,
          headerStyle: { backgroundColor: theme.card}
        }}
      />
      <Screen
        name='CreateEditOrder'
        component={CreateEditOrderScreen}
        options={{
          headerTintColor: theme.tertiary,
          headerStyle: { backgroundColor: theme.card}
        }}
      />
    </Navigator>
  )
}