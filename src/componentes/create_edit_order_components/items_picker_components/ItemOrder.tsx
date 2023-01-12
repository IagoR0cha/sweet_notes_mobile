import { useCallback, useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";

import { useTheme } from "../../../providers/main/theme";
import { DefaultButton } from "../../_shared/DefaultButton";
import { DefaultIconButton } from "../../_shared/DefaultIconButton";
import { DefaultText } from "../../_shared/DefaultText";

type Props = {
  index: number;
  label: string;
  value: number;
  onChangeQty: (value: number) => void;
  onPress: (index: number) => void;
}

export function ItemOrder({ label, value, onChangeQty, onPress, index }: Props) {
  const [currentInput, setCurrentInput] = useState<string>((value !== undefined && value !== null) ? value.toString() : '0');

  const { theme } = useTheme();

  const handleDecrementValue = useCallback(() => {
    setCurrentInput((valueStg) => {
      if (valueStg <= '0') {
        return valueStg;
      }

      const newValue = parseInt(valueStg) - 1;
      onChangeQty(newValue);
      return newValue.toString();
    })
  }, [])

  const handleIncrementValue = useCallback(() => {
    setCurrentInput((valueStg) => {
      const newValue = parseInt(valueStg) + 1;
      onChangeQty(newValue);
      return newValue.toString();
    })
  }, [])

  function handleContentText(value: string) {
    let currentValue = value;

    onChangeQty(parseInt(currentValue));
    setCurrentInput(value);
  }

  return (
    <DefaultButton
      style={[styles.container, { backgroundColor: theme.main }]}
      onPress={() => onPress(index)}
    >
      <DefaultText
        color={theme.primaryTextLight}
        fontSize={14}
        fontWeight='regular'
      >
        { label }
      </DefaultText>
      <View style={[styles.contentContainer]}>
        <DefaultIconButton
          style={{ borderRadius: 30 }}
          icon="minus"
          backgroundColor={theme.danger}
          onPress={handleDecrementValue}
        />
        <TextInput
          style={[
            styles.textInput,
            { color: theme.primaryTextLight },
          ]}
          onChangeText={handleContentText}
          keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
          value={currentInput}
        />
        <DefaultIconButton
          style={{ borderRadius: 30 }}
          icon="plus"
          backgroundColor={theme.success}
          onPress={handleIncrementValue}
        />
      </View>
    </DefaultButton>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%'
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: '100%',
    width: 30,
    textAlign: 'center'
  },
})