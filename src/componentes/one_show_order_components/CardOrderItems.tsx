import { StyleSheet, View } from "react-native";
import { useTheme } from "../../providers/main/theme";
import { OrderItem } from "../../types/Order.type";
import { DefaultText } from "../_shared/DefaultText";

type Props = {
  data: OrderItem;
  index: number;
}

type InfoMap = {
  label: string;
  value: string | undefined;
}

export function CardOrderItems({ data, index }: Props) {
  const { product_name, quantity, observation, product_price } = data;

  const { theme } = useTheme();

  const infoMap: InfoMap[] = [
    { label: 'Quantidade:', value: `${quantity}` },
    { label: 'Preço unitário:', value: `R$${product_price.toFixed(2)}` },
    { label: 'Observação:', value: observation },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.main }]}>
      <View style={[styles.header, styles.spacingHorizontal]}>
        <DefaultText style={{ marginBottom: 5 }} fontSize={16} fontWeight='bold' color={theme.primaryTextLight}>
          { `${index}. ${product_name}` }
        </DefaultText>
      </View>
      <View style={[styles.body, styles.spacingHorizontal, { backgroundColor: theme.inputBg }]}>
        {infoMap.map(({ label, value }, index) => (
          !!value &&
            <View key={index} style={styles.infoContainer}>
              <DefaultText  style={{ marginRight: 5 }} fontSize={14}
                color={theme.secondaryTextDefault} fontWeight='medium'
              >
                { label }
              </DefaultText>
              <DefaultText style={{ flex: 1 }} fontSize={14} color={theme.primaryTextDefault} fontWeight='bold'>
                { value }
              </DefaultText>
            </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginVertical: 4,
    overflow: 'hidden'
  },
  header: {
    paddingVertical: 8
  },
  body: {
    paddingVertical: 8
  },
  spacingHorizontal: {
    paddingHorizontal: 16
  },
  infoContainer: {
    flexDirection: 'row',
  }
})