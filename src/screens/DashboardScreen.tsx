import dayjs from "dayjs";
import { ComponentProps, useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Card } from "../componentes/dashboard_components/Card";

import { DefaultBackground } from "../componentes/_shared/DefaultBackground";
import { useToast } from "../providers/main/toast";
import * as Api from "../service/api";
import { OrderApi } from "../types/Order.type";

import Logo from '../assets/logo.png';
import { DashboardProduction, OrderData } from "../types/Dashboard.type";

type CardMap = {

} & ComponentProps<typeof Card>;

export function DashboardScreen() {
  const [initialIsLoading, setInitialIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [todayOrders, setTodayOrders] = useState<OrderApi[]>([]);
  const [paymentPendingWeekOrders, setPaymentPendingWeekOrders] = useState<OrderApi[]>([]);
  const [todayProductionData, setTodayProductionData] = useState({} as DashboardProduction);
  const [orderData, setOrderData] = useState({} as OrderData);

  const toast = useToast();

  const cardMap: CardMap[] = [
    {
      label: 'Pedidos de hoje',
      value: todayOrders.length.toString(),
      listData: {
        enablePillStatus: true,
        data: todayOrders,
        onChangeItem: (item, index) => setTodayOrders((items) => {
          const currentItems = [...items];
          currentItems.splice(index, 1, item);

          return currentItems;
        }),
      },
    },
    {
      label: 'Pedidos aguardando sinal da semana',
      value: paymentPendingWeekOrders.length.toString(),
      listData: {
        formatDate: 'DD/MM/YYYY HH:mm',
        data: paymentPendingWeekOrders,
        onChangeItem: (item, index) => setPaymentPendingWeekOrders((items) => {
          const currentItems = [...items];
          currentItems.splice(index, 1, item);

          return currentItems;
        }),
      },
    },
    {
      label: 'Produção de hoje',
      value: `${todayProductionData.current_value}/${todayProductionData.limit_value}`
    },
    {
      label: 'Total de pedidos abertos',
      value: `${orderData.opened_orders_count}`
    },
    {
      label: 'Total de pedidos aguardando sinal',
      value: `${orderData.pending_payment_orders_count}`
    },
    {
      label: 'Total de pedidos fechados',
      value: `${orderData.closed_orders_count}`
    },
  ]

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const todayOrdersResponse = await Api.Order.index({
        start_at: dayjs(Date.now()).startOf('day').toDate(),
        final_at: dayjs(Date.now()).endOf('day').toDate(),
        status: ['open', "pending_payment"]
      }).then(({ data }) => data);

      const paymentPendingWeekOrdersResponse = await Api.Order.index({
        start_at: dayjs(Date.now()).startOf('day').toDate(),
        final_at: dayjs(Date.now()).endOf('week').toDate(),
        status: [ "pending_payment"]
      }).then(({ data }) => data);

      const todayProductionDataResponse = await Api.Dashboard.production()
        .then(({ data }) => data);

      const orderDataResponse = await Api.Dashboard.orderData()
        .then(({ data }) => data);

      setTodayOrders(todayOrdersResponse);
      setPaymentPendingWeekOrders(paymentPendingWeekOrdersResponse);
      setTodayProductionData(todayProductionDataResponse);
      setOrderData(orderDataResponse);
    } catch(error) {
      toast.show('Erro ao carregar dados. Tente novamente!', 'error');
    }

    setIsLoading(false);
  }

  useEffect(() => {
    (async () => {
      await getDataFromApi();
      setInitialIsLoading(false)
    })()
  }, [])

  return (
    <DefaultBackground isLoading={initialIsLoading}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getDataFromApi} />
        }
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.image}
              source={Logo}
              resizeMode='contain'
            />
          </View>
          {cardMap.map((item, index) => (
            <Card key={index} { ...item } />
          ))}
        </View>
      </ScrollView>
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 58,
  }
})