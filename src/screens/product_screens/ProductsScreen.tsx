import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { DefaultBackground } from "../../componentes/_shared/DefaultBackground";
import { DefaultButton } from "../../componentes/_shared/DefaultButton";
import { DefaultDeleteButtonHidden } from "../../componentes/_shared/DefaultDeleteButtonHidden";
import { DefaultListItem } from "../../componentes/_shared/DefaultListItem";
import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";
import { NavigationStack } from "../../routes/main_routes/_MainNavigator.routes";
import * as Api from "../../service/api";
import { ProductApi } from "../../types/Product.type";

export function ProductsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setProducts] = useState<(ProductApi & { key: number })[]>([]);

  const navigation = useNavigation<NavigationStack>();
  const { theme } = useTheme();
  const toast = useToast();

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const response = await Api.Product.index().then(({ data }) => data);
      setProducts(response.map((item, index) => ({ ...item, key: index })));
    } catch(error) {

    }

    setIsLoading(false);
  }

  const handleEdit = useCallback((product: ProductApi) => {
    navigation.navigate('CreateEditProducts', {
      id: product.id,
      title: product.name
    });
  }, [])

  const handleDelete = useCallback((index: number, id?: number) => {
    if (!id) return toast.show('Erro ao deletar item. Tente novamente!', 'error', 'long');
  }, [])

  const handleCreateProduct = useCallback(() => {
    navigation.navigate('CreateEditProducts');
  }, [])

  useEffect(() => {
    getDataFromApi();
  }, [])

  useEffect(() => {
    (() => {
      navigation.removeListener('focus', () => {});

      navigation.addListener('focus', () => {
        getDataFromApi();
      })
    })()

    return () => {
      navigation.removeListener('focus', () => {});
    }
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DefaultButton
          label='Criar'
          backgroundColor={theme.primary}
          onPress={handleCreateProduct}
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
            title={item.name}
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