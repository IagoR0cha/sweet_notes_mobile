import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../providers/main/theme";
import { DefaultText } from "../_shared/DefaultText";

type Props = {
  label: string;
  children: ReactElement;
}

export function Card({ label, children }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.mainContent, styles.spacingHorizontal,
        styles.spacingVertical, { backgroundColor: theme.primary }
      ]}
    >
      <DefaultText style={{ marginBottom: 5 }} fontSize={16}
        color={theme.secondaryTextDefault} fontWeight='medium'
      >
        { label }
      </DefaultText>
      { children }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContent: {
    borderRadius: 10,
    elevation: 4,
    padding: 16
  },
  spacingHorizontal: {
    marginHorizontal: 16
  },
  spacingVertical: {
    marginVertical: 5
  }
})