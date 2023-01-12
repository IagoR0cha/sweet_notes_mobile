import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DefaultButton } from "./DefaultButton";
import { DefaultText } from "./DefaultText";
import { useTheme } from "../../providers/main/theme";
import { DefaultModal } from "./default_modal_components/DefaultModal";

type Props<T> = {
  placeholder: string;
  onGetDataFromApi: () => Promise<T[]>;
  onItemSelect?: (item: T) => void;
  onIdSelected?: (id: number) => void;
  value?: number | null;
  initialId?: number | null;
  label: string;
  error?: string;
  keyToLabel?: keyof T;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

type ItemSelected = {
  textColor: string;
  separatorColor: string;
  backgroundColor: string;
}

export function DefaultPickerFromApi<T extends { id: number }>(props: Props<T>) {
  const {
    placeholder,
    onGetDataFromApi,
    onItemSelect,
    value,
    initialId,
    label,
    error,
    containerStyle,
    style,
    keyToLabel = 'name',
    onIdSelected
  } = props;

  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [itemSelected, setItemSelected] = useState({} as T);

  const { theme } = useTheme();

  const handleShowModal = useCallback(async () => {
    setIsShowModal(true);
    setIsLoading(true);

    const data = await onGetDataFromApi();
    setCurrentData(data);

    setIsLoading(false);
  }, [])

  const handleSelectItem = useCallback((itemSelected: T) => {
    onItemSelect && onItemSelect(itemSelected);
    onIdSelected && onIdSelected(itemSelected.id)
    setItemSelected(itemSelected);

    setIsShowModal(false);
  }, [])

  const styleItemSelected = useCallback((id: number): ItemSelected => {
    if (!itemSelected || itemSelected.id !== id) {
      return {
        textColor: theme.primaryTextDefault,
        separatorColor: theme.textDisabled,
        backgroundColor: theme.card,
      }
    };

    return {
      textColor: theme.tertiary,
      separatorColor: theme.tertiary,
      backgroundColor: `${theme.tertiary}0f`
    }
  }, [itemSelected])

  useEffect(() => {
    (async () => {
      if (initialId) {
        const initialData = await onGetDataFromApi();
        console.log(initialData.map(({ id }) => id))
        console.log(initialId)

        const item = initialData.find(({ id }) => id === initialId);

        if (item) {
          setItemSelected(item);
        }
      }
    })()
  }, [])

  return (
    <>
      <View>
        <TouchableHighlight
          style={[{ backgroundColor: theme.inputBg, borderRadius: 10 }, containerStyle]}
          onPress={handleShowModal}
        >
          <View style={[styles.button, {
            backgroundColor: theme.inputBg,
            }, style]}
          >
            <DefaultText
              style={styles.textLabel}
              color={!error ? theme.secondaryTextDefault : theme.error}
              fontSize={12}
              fontWeight='regular'
            >
              { label }
            </DefaultText>
            <View style={styles.buttonContainer}>
              <DefaultText
                fontSize={14}
                color={theme.primaryTextDefault}
              >
                { (itemSelected as any)[(keyToLabel)] || placeholder }
              </DefaultText>
              <View style={{ flex: 1 }}>
                <MaterialCommunityIcons
                  style={{ alignSelf: 'flex-end' }}
                  name={'chevron-down'}
                  size={24}
                  color={theme.primaryTextDefault}
                />
              </View>
            </View>
          </View>
        </TouchableHighlight>
        {!!error &&
          <View style={styles.errorMessageContainer}>
            <DefaultText
              style={styles.errorMessage}
              color={theme.error}
              fontSize={12}
              fontWeight='medium'
            >
              { error }
            </DefaultText>
          </View>
        }
      </View>
      <DefaultModal
        visible={isShowModal}
        closeModal={setIsShowModal}
        title={placeholder}
      >
        <View style={styles.modalContainer}>
          {!isLoading ?
            <FlatList
              data={currentData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <DefaultButton
                  style={[styles.itemContainer, {
                    borderBottomColor: styleItemSelected(item.id).separatorColor,
                    backgroundColor: styleItemSelected(item.id).backgroundColor
                  }]}
                  onPress={() => handleSelectItem(item)}
                >
                    <DefaultText
                      fontSize={16}
                      fontWeight={'regular'}
                      color={styleItemSelected(item.id).textColor}
                    >
                      { (item as any)[keyToLabel] }
                    </DefaultText>
                </DefaultButton>
              )}
            />
            :
            <ActivityIndicator size={'large'} color={theme.tertiary} />
          }
        </View>
      </DefaultModal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    elevation: 0,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  textLabel: {
    marginLeft: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    elevation: 0,
    borderBottomWidth: 2
  },
  separator: {
    height: 2
  },
  modalContainer: {
    paddingHorizontal: 16,
    minHeight: 200,
    justifyContent: 'center',
    paddingBottom: 16
  },
  errorMessageContainer: {
    height: 15,
  },
  errorMessage: {
    marginLeft: 10,
  }
})