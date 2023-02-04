import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";

import { useValidator } from "../../helpers/useValidator";
import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";
import { Product } from "../../service/api";
import { ItemChanged, Item, ItemCreate } from "../../types/Item.type";
import { DefaultIncrement } from "../_shared/DefaultIncrement";
import { DefaultPickerFromApi } from "../_shared/DefaultPickerFromApi";
import { DefaultTextInput } from "../_shared/DefaultTextInput";
import { DefaultModal } from "../_shared/default_modal_components/DefaultModal";

type Props = {
  visible: boolean;
  onClose: (status: boolean) => void;
  onSave: (item: ItemCreate, currentIndex?: number) => void;
  initialValue?: Item;
  currentIndex?: number;
}

export function AddEditItemModal({ onClose, visible, onSave, initialValue, currentIndex }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<ItemCreate>({
    product_id: null,
    quantity: 0,
    product_name: null
  } as unknown as ItemCreate);

  const [errors, isValid, handleError] = useValidator(item, {
    product_id: { message: 'Selecione o produto' },
    quantity: { message: 'Informe a quantidade' }
  })

  const toast = useToast();
  const { theme } = useTheme();

  async function getDataFromApi() {
    try {
      return Product.index().then(({ data }) => data);
    } catch(error) {
      toast.show('Erro ao editar o produto. Tente novamente!', 'error', 'long');
      return [];
    }
  }

  const handleChangeItem = useCallback((data: ItemChanged) => {
    setItem((props) => ({ ...props, ...data }));
  }, [])

  const handleSave = useCallback(() => isValid(() => {
    onSave(item, currentIndex);
    onClose(false);
  }), [item])

  useEffect(() => {
    if (initialValue) {
      setItem(initialValue as ItemCreate);
    }

    setIsLoading(false);
  }, [])

  return (
    <DefaultModal
      visible={visible}
      closeModal={onClose}
      title="Adicionar item"
      enableFooterButton
      submit={handleSave}
      footerButtonTitle="Adicionar"
      footerButtonBackgroundColor={theme.success}
      styleBody={{ paddingVertical: 12, backgroundColor: theme.background }}
    >
      {!isLoading ?
        <>
          <DefaultPickerFromApi
            style={[styles.input]}
            containerStyle={styles.inputContainer}
            label="Produto"
            placeholder="Selecione o produto"
            error={errors.product_id}
            initialId={item.product_id}
            onItemSelect={(item) => {
              handleError(null, 'product_id');
              handleChangeItem({ product_id: item.id, product_name: item.name });
          }}
            onGetDataFromApi={getDataFromApi}
          />
          <DefaultIncrement
            inputStyle={styles.input}
            style={styles.inputContainer}
            label="Quantidade"
            value={item.quantity}
            error={errors.quantity}
            onChangeText={(value) => {
              handleError(null, 'quantity');
              handleChangeItem({ quantity: value });
            }}
          />
          <DefaultTextInput
            inputStyle={styles.input}
            style={styles.inputContainer}
            label='Observação'
            placeholder='Insira uma observação (Opcional)'
            value={item.observation}
            error={errors.observation}
            multiline
            onChangeText={(value) => handleChangeItem({ observation: value as string })}
          />
        </>
        :
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'large' : 53}
          color={theme.tertiary}
        />
      }
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 8,
    marginVertical: 5
  },
  input: {
    elevation: 4,
  },
})