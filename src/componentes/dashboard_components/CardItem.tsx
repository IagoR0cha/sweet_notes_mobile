import { StyleSheet, View } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler";

import { statusMap } from "../../helpers/statusMap";
import { useTransformDate } from "../../helpers/transform_date";
import { useTheme } from "../../providers/main/theme";
import { OrderApi } from "../../types/Order.type"
import { DefaultPill } from "../_shared/DefaultPill";
import { DefaultText } from "../_shared/DefaultText"

type Props = {
  data: OrderApi;
  onPress: () => void;
  formatDate?: string;
  enablePillStatus?: boolean;
}

export function CardItem({ data, onPress, formatDate, enablePillStatus }: Props) {
  const { id, client, order_date, status } = data;

  const { theme } = useTheme();

  return (
    <TouchableHighlight
      style={[styles.touchableContainer, { backgroundColor: theme.main }]}
      onPress={onPress}
    >
      <View style={[styles.container, { backgroundColor: theme.main }]}>
        <View style={styles.infoContainer}>
          <DefaultText fontSize={16} color={theme.primaryTextLight}>
            { `Pedido: ${id}` }
          </DefaultText>
          <DefaultText fontSize={12} color={theme.primaryTextLight}>
            { `Cliente: ${client}` }
          </DefaultText>
          {enablePillStatus &&
            <DefaultPill
              style={{ marginTop: 2 }}
              label={statusMap[status].label}
              status={statusMap[status].status}
            />
          }
        </View>
        <DefaultText
          fontSize={16}
          color={theme.primaryTextLight}
          fontWeight='bold'
        >
          { useTransformDate(order_date, (formatDate || 'HH:mm')) }
        </DefaultText>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  touchableContainer: {
    marginVertical: 3,
    borderRadius: 10,
  },
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoContainer: {

  }
})