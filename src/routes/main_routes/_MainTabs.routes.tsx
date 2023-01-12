import { ComponentProps } from 'react';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DashboardNavigator } from './navigators/DashboardNavigator.routes';
import { OrdersNavigator } from './navigators/OrderNavigator.routes';
import { ProductsNavigator } from './navigators/ProductsNavigator.routes';
import { MenuNavigator } from './navigators/MenuNavigator.routes';
import { useTheme } from '../../providers/main/theme';

interface PropsIcon {
  focused: boolean;
  color: string;
  size: number;
}

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type IconMap = {
  [key: string]: MaterialIconName;
}

export type NavigationTabsProp = NativeStackNavigationProp<MainTabsParamList, keyof MainTabsParamList>;

type MainTabsParamList = {
  DashboardNavigator: undefined
  OrderNavigator: undefined
  ProductsNavigator: undefined
  MenuNavigator: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<MainTabsParamList>();

export function MainTabsRoutes() {
  const { theme } = useTheme();

  function tabsIconController(route: RouteProp<Record<string, object | undefined>, string>, { focused, color, size }: PropsIcon) {
    let iconName: MaterialIconName;

    let iconMap: IconMap = {
      'DashboardNavigator': 'view-dashboard-outline',
      'OrderNavigator': 'clipboard-text-outline',
      'ProductsNavigator': 'cake-variant-outline',
      'MenuNavigator': 'menu',
    }

    iconName = iconMap[route.name];

    return <MaterialCommunityIcons name={iconName} size={size} color={color} />
  }

  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (response) => tabsIconController(route, response),
        tabBarActiveTintColor: theme.tertiary,
        // tabBarInactiveTintColor: theme.main,
        tabBarActiveBackgroundColor: theme.card,
        tabBarInactiveBackgroundColor: theme.card,
        headerShown: false
      })}
    >
      <Screen
        name='DashboardNavigator'
        component={DashboardNavigator}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Screen
        name='OrderNavigator'
        component={OrdersNavigator}
        options={{ title: 'Pedidos' }}
      />
      <Screen
        name='ProductsNavigator'
        component={ProductsNavigator}
        options={{ title: 'Produtos' }}
      />
      <Screen
        name='MenuNavigator'
        component={MenuNavigator}
        options={{ title: 'Menu' }}
      />
    </Navigator>
  )
}