import { StyleSheet, Text, View } from "react-native";
import { ProductionControlButton } from "../componentes/menu_components/ProductionControlButton";
import { DefaultBackground } from "../componentes/_shared/DefaultBackground";
import { DefaultButton } from "../componentes/_shared/DefaultButton";
import { DefaultText } from "../componentes/_shared/DefaultText";

export function MenuScreen() {
  return (
    <DefaultBackground style={{ paddingVertical: 8 }}>
      <ProductionControlButton />
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})