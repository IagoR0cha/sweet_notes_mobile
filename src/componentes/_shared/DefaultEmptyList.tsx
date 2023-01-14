import { StyleSheet, View } from "react-native";
import { useTheme } from "../../providers/main/theme";
import { DefaultText } from "./DefaultText";

export function DefaultEmptyList() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <DefaultText fontWeight="regular" color={theme.secondaryTextDefault}>
        Nenhum dado disponível
      </DefaultText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
})