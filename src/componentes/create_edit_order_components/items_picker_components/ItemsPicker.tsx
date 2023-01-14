import { Dispatch, useCallback, useState } from "react";
import { LogBox, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { useTheme } from "../../../providers/main/theme";
import { Item, ItemCreate } from "../../../types/Item.type";
import { DefaultDeleteButtonHidden } from "../../_shared/DefaultDeleteButtonHidden";
import { DefaultIconButton } from "../../_shared/DefaultIconButton";
import { DefaultText } from "../../_shared/DefaultText";
import { AddEditItemModal } from "../AddEditItemModal";
import { ItemOrder } from "./ItemOrder";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

type Props = {
  style?: StyleProp<ViewStyle>;
  itemsValue: Item[];
  onChangeItem: (item: Item[]) => void;
}

type ModalControl = {
  visible: boolean;
  initialValue?: Item;
  currentIndex?: number
} | { visible: false }

export function ItemsPicker({ style, itemsValue, onChangeItem }: Props) {
  const [modalIsShow, setModalIsShow] = useState<ModalControl>({ visible: false });

  const { theme } = useTheme();

  const handleOpenModal = useCallback(() => {
    setModalIsShow({ visible: true });
  }, [])

  const handleSaveItem = useCallback((item: ItemCreate, currentIndex?: number) => {
    if (!currentIndex) {
      return onChangeItem([...itemsValue, item]);
    }

    const currentItems = [...itemsValue];
    currentItems[currentIndex] = item;

    onChangeItem(currentItems);
  }, [itemsValue])

  const handleChangeQtyItem = useCallback((value: number, index: number) => {
    const currentItems = [...itemsValue];

    currentItems[index] = {
      ...currentItems[index],
      quantity: value
    }

    onChangeItem(currentItems);
  }, [itemsValue])

  const handleDeleteItem = useCallback((indexToDelete: number, id?: number) => {
    const currentItems = [...itemsValue];

    if (id) {
      currentItems.splice(indexToDelete, 1, { id, _destroy: true });
    } else {
      currentItems.splice(indexToDelete, 1);
    }

    onChangeItem(currentItems);
  }, [itemsValue])

  const handleSelectOrderItem = useCallback((index: number) => {
    setModalIsShow({ visible: true, currentIndex: index, initialValue: itemsValue[index] });
  }, [itemsValue])

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.primary }, style]}>
        <View style={styles.header}>
          <DefaultText fontSize={16} fontWeight='medium'>
            Items
          </DefaultText>
          <DefaultIconButton
            style={styles.addButton}
            icon="plus"
            colorIcon={theme.primaryTextLight}
            backgroundColor={theme.main}
            onPress={handleOpenModal}
          />
        </View>
        <View style={styles.body}>
          <SwipeListView
            data={itemsValue.filter(({ _destroy }) => !_destroy)}
            renderItem={({ item, index }) => (
              <ItemOrder
                key={index}
                index={index}
                label={!item._destroy ? item.product_name : ''}
                onChangeQty={(value) => handleChangeQtyItem(value, index)}
                value={!item._destroy ? item.quantity : 0}
                onPress={handleSelectOrderItem}
              />
            )}
            keyExtractor={(__, index) => index.toString()}
            disableRightSwipe
            renderHiddenItem={({ item, index }) => (
              <DefaultDeleteButtonHidden
                style={{ marginVertical: 5 }}
                data={item}
                index={index}
                onDelete={handleDeleteItem}
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
          />
        </View>
      </View>
      {modalIsShow.visible &&
        <AddEditItemModal
          onClose={() => setModalIsShow({ visible: false })}
          visible={modalIsShow.visible}
          onSave={handleSaveItem}
          initialValue={modalIsShow.initialValue}
          currentIndex={modalIsShow.currentIndex}
        />
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  body: {
    
  },
  inputContainer: {
    marginHorizontal: 8,
    marginVertical: 5
  },
  input: {
    elevation: 4,
  },
  addButton: {
    borderRadius: 10
  }
})