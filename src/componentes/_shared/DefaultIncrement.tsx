import { useCallback, useMemo, useState } from "react";
import { Platform, StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native"

import { DefaultText } from "./DefaultText";
import { useTheme } from "../../providers/main/theme";
import { DefaultIconButton } from "./DefaultIconButton";

type Props = {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label: string;
  color?: string;
  disabled?: boolean;
  styleTextInput?: StyleProp<TextStyle>;
  onChangeText: (value: number) => void;
  backgroundColor?: string;
  error?: string;
  value?: number;
}


export function DefaultIncrement(props: Props) {
  const {
    label,
    style,
    color,
    disabled,
    styleTextInput,
    onChangeText,
    backgroundColor,
    error,
    value,
    inputStyle,
  } = props;

  const [currentInput, setCurrentInput] = useState<string>((value !== undefined && value !== null) ? value.toString() : '0');

  const { theme } = useTheme();

  function handleContentText(value: string) {
    let currentValue = value;

    onChangeText(parseInt(currentValue));
    setCurrentInput(value);
  }

  const styleIndicator = useMemo((): StyleProp<ViewStyle> => {
    return !!error ? {
      borderColor: theme.error,
      borderWidth: 0.8,
    } : {};
  }, [error])


  const handleDecrementValue = useCallback(() => {
    setCurrentInput((valueStg) => {
      if (valueStg <= '0') {
        return valueStg;
      }

      const newValue = parseInt(valueStg) - 1;
      onChangeText(newValue);
      return newValue.toString();
    })
  }, [])

  const handleIncrementValue = useCallback(() => {
    setCurrentInput((valueStg) => {
      const newValue = parseInt(valueStg) + 1;
      onChangeText(newValue);
      return newValue.toString();
    })
  }, [])

  return (
    <View style={style}>
      <View style={[styles.container, { backgroundColor: backgroundColor || theme.inputBg }, inputStyle, styleIndicator]}>
        <DefaultText
          style={styles.textLabel}
          color={theme.primaryTextDefault}
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
              { color: !disabled ? color || theme.primaryTextDefault : theme.textDisabled },
              styleTextInput
            ]}
            onChangeText={handleContentText}
            keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
            value={currentInput}
            editable={!disabled ? true : false}
          />
          <DefaultIconButton
            style={{ borderRadius: 30 }}
            icon="plus"
            backgroundColor={theme.success}
            onPress={handleIncrementValue}
          />
        </View>
      </View>
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
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {},
  icon: {
    marginRight: 8
  },
  textInput: {
    height: '100%',
    width: 30,
    textAlign: 'center'
  },
  cleanButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorMessageContainer: {
    height: 15,
  },
  errorMessage: {
    marginLeft: 10,
  }
})