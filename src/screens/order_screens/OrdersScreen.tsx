import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { DefaultBackground } from "../../componentes/_shared/DefaultBackground";
import { DefaultDeleteButtonHidden } from "../../componentes/_shared/DefaultDeleteButtonHidden";
import { DefaultListItem } from "../../componentes/_shared/DefaultListItem";
import * as Api from "../../service/api";
import { OrderApi } from "../../types/Order.type";
import { useTransformDate } from '../../helpers/transform_date';
import { useNavigation } from "@react-navigation/native";
import { NavigationStack } from "../../routes/main_routes/_MainNavigator.routes";
import { DefaultButton } from "../../componentes/_shared/DefaultButton";
import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";

export function OrdersScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<(OrderApi & { key: number })[]>([]);

  const navigation = useNavigation<NavigationStack>();
  const { theme } = useTheme();
  const toast = useToast();

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const response = await Api.Order.index().then(({ data }) => data);
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
    if (!id) return toast.show('Erro ao deletar item. Tente novamente!', 'error');

    await Api.Order.delete(id).then(() => {
      const currentOrders = [...orders];
      currentOrders.splice(index, 1);

      setOrders(currentOrders);
    })
  }

  const handleCreateOrder = useCallback(() => {
    navigation.navigate('CreateEditOrder');
  }, [])

  useEffect(() => {
    getDataFromApi();
  }, [])

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
      <SwipeListView
        contentContainerStyle={styles.list}
        data={orders}
        renderItem={({ item }) => (
          <DefaultListItem
            title={`Pedido ${item.id}`}
            subTitle={`Cliente: ${item.client}`}
            centerText={useTransformDate(item.order_date, 'DD/MM/YYYY HH:mm')}
            onEdit={() => handleEdit(item)}
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
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})