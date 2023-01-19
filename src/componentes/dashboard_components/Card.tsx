import { useNavigation } from "@react-navigation/native";
import { ComponentProps, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { useTheme } from "../../providers/main/theme";
import { NavigationStack } from "../../routes/main_routes/_MainNavigator.routes";
import { OrderApi } from "../../types/Order.type";
import { DefaultEmptyList } from "../_shared/DefaultEmptyList";
import { DefaultText } from "../_shared/DefaultText";
import { CardItem } from "./CardItem";
import { HiddenButtons } from "./HiddenButtons";

type Props = {
  label: string;
  value: string;
  listData?: ListData;
}

type ListData = Omit<ComponentProps<typeof SwipeListView>, 'data'> & {
  data: OrderApi[];
  formatDate?: string;
  enablePillStatus?: boolean;
  onChangeItem: (item: OrderApi, index: number) => void;
}

export function Card(props: Props) {
  const { label, value, listData } = props;

  const { theme } = useTheme();
  const navigation = useNavigation<NavigationStack>();

  const handleShowOrder = useCallback((order: OrderApi) => {
    const { id } = order;

    navigation.navigate('OneShowOrderScreen', { id, title: `Pedido ${id}` });
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={styles.header}>
        <DefaultText fontSize={16}>
          { label }
        </DefaultText>
        <DefaultText fontSize={20} fontWeight='bold'>
          { value }
        </DefaultText>
      </View>
      {!!listData &&
        <View>
          <SwipeListView
            contentContainerStyle={styles.list}
            data={listData.data}
            renderItem={({ item }) => (
              <CardItem
                formatDate={listData.formatDate} data={item}
                onPress={() => handleShowOrder(item)}
                enablePillStatus={listData.enablePillStatus}
              />
            )}
            renderHiddenItem={({ item, index }) => (
              <HiddenButtons index={index} data={item} onChangeItem={listData.onChangeItem} />
            )}
            ListEmptyComponent={<DefaultEmptyList />}
            closeOnRowPress
            closeOnScroll
            closeOnRowBeginSwipe
            leftOpenValue={110}
            rightOpenValue={-110}
          />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    marginHorizontal: 10,
    marginVertical: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  list: {
    paddingVertical: 8,
  },
})