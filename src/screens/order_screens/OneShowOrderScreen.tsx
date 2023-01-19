import { RouteProp, useNavigation } from "@react-navigation/native"
import { ReactElement, useEffect, useMemo, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Card } from "../../componentes/one_show_order_components/Card"
import { CardOrderItems } from "../../componentes/one_show_order_components/CardOrderItems"
import { DefaultBackground } from "../../componentes/_shared/DefaultBackground"
import { DefaultPill } from "../../componentes/_shared/DefaultPill"
import { DefaultText } from "../../componentes/_shared/DefaultText"
import { statusMap } from "../../helpers/statusMap"
import { useTransformDate } from "../../helpers/transform_date"
import { useTheme } from "../../providers/main/theme"
import { useToast } from "../../providers/main/toast"
import { MainNavigatorParamList } from "../../routes/main_routes/_MainNavigator.routes"
import { Order } from "../../service/api"
import { OrderApi } from "../../types/Order.type"
import { DashboardScreen } from "../DashboardScreen"

type Props = {
  route: RouteProp<MainNavigatorParamList, 'OneShowOrderScreen'>;
  navigation: any;
}

type InfoDataMap = {
  label: string;
  value?: string;
  defaultValue?: ReactElement;
}

export function OneShowOrderScreen({ route }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderApi | null>(null);

  const { theme } = useTheme();
  const toast = useToast();
  const navigation = useNavigation();

  const infoDataMap = useMemo((): InfoDataMap[] => {
    if (!order) return [];

    return [
      { label: 'Nome:', value: `Pedido ${order.id}` },
      { label: 'Cliente:', value: order.client },
      { label: 'Data de entrega:', value: useTransformDate(order.order_date, 'DD/MM/YY HH:mm') },
      { label: 'Status: ', defaultValue: (
        <DefaultPill
          label={statusMap[order.status].label}
          status={statusMap[order.status].status}
          textOptions={{ fontSize: 14, fontWeight: 'bold', color: theme.primaryTextDefault }}
          style={{ paddingHorizontal: 25, paddingVertical: 4, borderRadius: 60 }}
        />
      )},
    ]
  }, [order])

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const response = await Order.show(route.params.id).then(({ data }) => data);
      setOrder(response);
    } catch(error) {
      toast.show('Erro carregar pedido. Tente novamente!', 'error', 'long');
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getDataFromApi();
  }, [])

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
      headerRight: () => (
        order &&
          <DefaultPill
            label={statusMap[order.status].label}
            status={statusMap[order.status].status}
            textOptions={{ fontSize: 16, fontWeight: 'bold', color: theme.primaryTextDefault }}
            style={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 60 }}
          />
      )
    });
  }, [order])

  return (
    <DefaultBackground isLoading={isLoading}>
      {order &&
        <ScrollView>
          <View style={styles.container}>
            <View style={[styles.mainContent, styles.spacingHorizontal,  styles. spacingVertical, { backgroundColor: theme.primary }]}>
              {infoDataMap.map(({ label, value, defaultValue }, index) => (
                <View key={index} style={[styles.infoDataContainer]}>
                  <DefaultText  style={{ marginRight: 5 }} fontSize={16}
                    color={theme.secondaryTextDefault} fontWeight='medium'
                  >
                    { label }
                  </DefaultText>
                  {!!value ?
                    <DefaultText fontSize={16} color={theme.primaryTextDefault} fontWeight='bold'>
                      { value }
                    </DefaultText>
                    :
                    defaultValue || null
                  }
                </View>
              ))}
            </View>
            {order.description &&
              <Card label="Descrição:">
                <DefaultText style={{ marginLeft: 5 }} fontSize={16} color={theme.primaryTextDefault} fontWeight='medium'>
                  { order.description }
                </DefaultText>
              </Card>
            }
            <Card label="Items:">
              <>
                {order.items.map((item, index) => (
                  <CardOrderItems key={item.id} index={index + 1} data={item} />
                ))}
              </>
            </Card>
          </View>
        </ScrollView>
      }
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10
  },
  mainContent: {
    borderRadius: 10,
    elevation: 4,
    padding: 16
  },
  infoDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1
  },
  spacingHorizontal: {
    marginHorizontal: 16
  },
  spacingVertical: {
    marginVertical: 5
  }
})