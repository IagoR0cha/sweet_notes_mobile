import { FlatList, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from "../../providers/main/theme";
import { DefaultText } from "./DefaultText";
import { useCallback, useState } from "react";
import { DefaultModal } from "./default_modal_components/DefaultModal";
import { DefaultButton } from "./DefaultButton";

type Props<T> = {
  data: T[];
  label: string;
  error?: string;
  placeholder: string;
  initialValue?: T;
  onItemSelect: (item: string) => void;
  keyToLabel?: keyof T;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

type ItemSelected = {
  textColor: string;
  separatorColor: string;
  backgroundColor: string;
}


export function DefaultPicker<T extends { value: string }>(props: Props<T>) {
  const {
    data,
    label,
    error,
    placeholder,
    initialValue,
    onItemSelect,
    keyToLabel,
    style,
    containerStyle
  } = props;

  const [itemSelected, setItemSelected] = useState(initialValue || {} as T);
  const [isShowModal, setIsShowModal] = useState(false);

  const { theme } = useTheme();

  const handleShowModal = useCallback(async () => {
    setIsShowModal(true);
  }, [])

  const styleItemSelected = useCallback((item: string): ItemSelected => {
    if (!itemSelected.value || itemSelected.value !== item) {
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
  }, [itemSelected.value])

  const handleSelectItem = useCallback((itemSelected: T) => {
    onItemSelect(itemSelected.value);
    setItemSelected(itemSelected);

    setIsShowModal(false);
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
          <FlatList
            data={data}
            keyExtractor={(__, index) => index.toString()}
            renderItem={({ item }) => (
              <DefaultButton
                style={[styles.itemContainer, {
                  borderBottomColor: styleItemSelected(item.value).separatorColor,
                  backgroundColor: styleItemSelected(item.value).backgroundColor
                }]}
                onPress={() => handleSelectItem(item)}
              >
                  <DefaultText
                    fontSize={16}
                    fontWeight={'regular'}
                    color={styleItemSelected(item.value).textColor}
                  >
                    { (item as any)[(keyToLabel)] }
                  </DefaultText>
              </DefaultButton>
            )}
          />
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