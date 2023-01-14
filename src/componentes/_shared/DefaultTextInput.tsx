import { useCallback, useMemo, useState } from "react";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { MaterialIconName } from "../../@types/materialIcon";
import { DefaultText } from "./DefaultText";
import { FontWeight } from "../../types/Font.type";
import { DefaultButton } from "./DefaultButton";
import { useTheme } from "../../providers/main/theme";

type Props = {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label?: string;
  multiline?: boolean;
  startIcon?: MaterialIconName;
  color?: string;
  colorIcon?: string;
  disabled?: boolean;
  styleTextInput?: StyleProp<TextStyle>;
  isOnlyNumber?: boolean;
  onChangeText: (value: string | number) => void;
  placeholderTextColor?: string;
  backgroundColor?: string;
  fontWeight?: FontWeight;
  error?: string;
  enableCleanButton?: boolean;
  value?: string | number;
} & Omit<TextInputProps, 'value'>;

type StyleIfCleanButton = {
  textInput: StyleProp<TextStyle>;
}

export function DefaultTextInput(props: Props) {
  const {
    label,
    style,
    multiline,
    startIcon,
    color,
    colorIcon,
    disabled,
    styleTextInput,
    isOnlyNumber,
    onChangeText,
    placeholderTextColor,
    backgroundColor,
    fontWeight,
    error,
    enableCleanButton,
    inputStyle,
    value,
    ...all
  } = props;

  const [currentInputText, setCurrentInputText] = useState(typeof value === 'number' ? value.toString() : value);

  const { theme } = useTheme();

  function handleContentText(value: string) {
    let currentValue: string | number  = value;
    if (isOnlyNumber) {
      currentValue = parseFloat(currentValue.replace(/[^0-9\.,]/g, ''));
    }

    onChangeText(currentValue);
    setCurrentInputText(value);
  }

  const heightControl = useCallback((): StyleProp<ViewStyle> => {
    if (multiline) {
      return { minHeight: 80, maxHeight: 120 };
    }

    return { height: 52 };
  }, [multiline]);

  const styleIfCleanButton = useMemo((): StyleIfCleanButton => {
    if (enableCleanButton) {
      return { textInput: { width: '80%' } }
    }

    return { textInput: { width: '100%' } }
  }, [enableCleanButton])

  const styleIndicator = useMemo((): StyleProp<ViewStyle> => {
    return !!error ? {
      borderColor: theme.error,
      borderWidth: 0.8,
    } : {};
  }, [error])

  const handleCleanInput = useCallback(() => {
    handleContentText('');
  }, [])

  return (
    <View style={style}>
      <View style={[styles.container, { backgroundColor: backgroundColor || theme.inputBg }, inputStyle, styleIndicator]}>
        {label &&
          <DefaultText
            style={styles.textLabel}
            color={!error ? theme.primaryTextDefault : theme.error}
            fontSize={12}
            fontWeight='regular'
          >
            { label }
          </DefaultText>
        }
        <View style={[styles.contentContainer, heightControl()]}>
          {startIcon && <MaterialCommunityIcons style={styles.icon} name={startIcon} size={24} color={colorIcon || color} />}
          <TextInput
            { ...all }
            style={[
              styles.textInput,
              styleIfCleanButton.textInput,
              {
                color: !disabled ? color || theme.primaryTextDefault : theme.textDisabled,
              },
              styleTextInput
            ]}
            onChangeText={handleContentText}
            placeholderTextColor={placeholderTextColor || theme.placeholder}
            value={currentInputText}
            multiline={multiline}
            cursorColor={theme.secondary}
            editable={!disabled ? true : false}
          />
          {enableCleanButton && !!currentInputText &&
            <DefaultButton
              style={[styles.cleanButton]}
              activeOpacity={0.5}
              onPress={handleCleanInput}
              backgroundColor={theme.secondaryTextDefault}
            >
              <MaterialCommunityIcons name="close" size={20} color="black" />
            </DefaultButton>
          }
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
    overflow: 'hidden',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    marginTop: 8,
    marginLeft: -5,
    marginBottom: -10
  },
  icon: {
    marginRight: 8
  },
  textInput: {
    height: '100%',
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