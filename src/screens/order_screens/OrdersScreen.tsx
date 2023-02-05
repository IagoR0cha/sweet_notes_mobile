import { ComponentProps, useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { DefaultBackground } from "../../componentes/_shared/DefaultBackground";
import { DefaultDeleteButtonHidden } from "../../componentes/_shared/DefaultDeleteButtonHidden";
import { DefaultListItem } from "../../componentes/_shared/DefaultListItem";
import * as Api from "../../service/api";
import { OrderApi, OrderIndexParams, StatusOrder } from "../../types/Order.type";
import { useTransformDate } from '../../helpers/transform_date';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationStack } from "../../routes/main_routes/_MainNavigator.routes";
import { DefaultButton } from "../../componentes/_shared/DefaultButton";
import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";
import { OrderFilter } from "../../componentes/order_components/OrderFilter";
import { DefaultPill } from "../../componentes/_shared/DefaultPill";

type StatusMap = {
  [key in StatusOrder]: ComponentProps<typeof DefaultPill>;
}

export function OrdersScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<(OrderApi & { key: number })[]>([]);
  const [filterParams, setFilterParams] = useState<OrderIndexParams>({});

  const navigation = useNavigation<NavigationStack>();
  const { theme } = useTheme();
  const toast = useToast();

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const response = await Api.Order.index(filterParams).then(({ data }) => data);
      setOrders(response.map((item, index) => ({ ...item, key: index })));
    } catch(error) {

    }

    setIsLoading(false);
  }

  const handleEdit = useCallback((item: OrderApi) => {
    const { id } = item;
    navigation.navigate('CreateEditOrder', { id: id, title: `Pedido ${id}` })
  }, [])

  const handleDelete = async (index: number, id?: number) => {
    if (!id) return toast.show('Erro ao deletar item. Tente novamente!', 'error', 'long');

    await Api.Order.delete(id).then(() => {
      const currentOrders = [...orders];
      currentOrders.splice(index, 1);

      setOrders(currentOrders);
    })
  }

  const handleCreateOrder = useCallback(() => {
    navigation.navigate('CreateEditOrder');
  }, [])

  const handleShowOrder = useCallback((item: OrderApi) => {
    const { id } = item;

    navigation.navigate('OneShowOrderScreen', { id, title: `Pedido ${id}` });
  }, [])

  const statusController = useCallback((status: StatusOrder) => {
    const statusMap: StatusMap = {
      open: { label: 'Aberto', status: 'success' },
      close: { label: 'Fechado', status: 'error' },
      pending_payment: { label: 'Aguardando sinal', status: 'warning' },
    }

    return statusMap[status];
  }, [])

  useEffect(() => {
    getDataFromApi();
  }, [filterParams])

  useFocusEffect(
    useCallback(() => {
      getDataFromApi();
    }, [filterParams])
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DefaultButton
          label='Criar'
          backgroundColor={theme.primary}
          onPress={handleCreateOrder}
        />
      )
    })
  }, [])

  return (
    <DefaultBackground>
      <BottomSheetModalProvider>
        <SwipeListView
          contentContainerStyle={styles.list}
          data={orders}
          renderItem={({ item }) => (
            <DefaultListItem
              title={`Pedido ${item.id}`}
              subTitle={`Cliente: ${item.client}`}
              centerText={useTransformDate(item.order_date, 'DD/MM/YYYY HH:mm')}
              onEdit={() => handleEdit(item)}
              pillData={statusController(item.status)}
              onPress={() => handleShowOrder(item)}
            />
          )}
          keyExtractor={(item) => item.key.toString()}
          disableRightSwipe
          renderHiddenItem={({ item, index }) => (
            <DefaultDeleteButtonHidden
              data={item}
              index={index}
              onDelete={handleDelete}
            />
          )}
          closeOnRowPress
          closeOnScroll
          closeOnRowBeginSwipe
          leftOpenValue={110}
          rightOpenValue={-110}
          previewRowKey={'0'}
          previewOpenValue={-50}
          previewOpenDelay={1500}
          refreshing={isLoading}
          onRefresh={getDataFromApi}
        />
      </BottomSheetModalProvider>
      <OrderFilter
        style={styles.orderFilterButton}
        onChangerFilter={setFilterParams}
      />
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 100
  },
  orderFilterButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  }
})