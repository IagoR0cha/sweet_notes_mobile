import { ReactNode } from "react";
import { ActivityIndicator, Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "../../providers/main/theme";


type Props = {
  style?: StyleProp<ViewStyle>;
  headerComponent?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
}

export function DefaultBackground({ style, headerComponent, children, isLoading }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: theme.background }}>
        { headerComponent }
      </View>
      <View
        style={[
          styles.bodyContainer,
          { backgroundColor: theme.background },
          style
        ]}
      >
        {!isLoading ?
          children
          :
          <ActivityIndicator
            style={{ flex: 1 }}
            size={Platform.OS === 'ios' ? 'large' : 53}
            color={theme.tertiary}
          />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bodyContainer: {
    flex: 1,
  }
})