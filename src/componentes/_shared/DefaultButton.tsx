import { ActivityIndicator, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { MaterialIconName } from "../../@types/materialIcon";
import { ElementType, ReactElement, ReactNode } from "react";
import { DefaultText } from "./DefaultText";
import { FontWeight } from "../../types/Font.type";
import { useTheme } from "../../providers/main/theme";

type Props = {
  startIcon?: MaterialIconName;
  endIcon?: MaterialIconName;
  isLoading?: boolean;
  sizeIcon?: number;
  disabled?: boolean;
  color?: string;
  styleText?: StyleProp<TextStyle>;
  fontSize?: number;
  upperCase?: boolean;
  label?: string;
  sizeIndication?: number;
  children?: ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  fontWeight?: FontWeight;
  heightButton?: number | string;
  activeOpacity?: number;
}

export function DefaultButton(props: Props) {
  const {
    isLoading,
    startIcon,
    endIcon,
    sizeIcon,
    disabled,
    color,
    styleText,
    fontSize,
    upperCase,
    label,
    sizeIndication,
    children,
    onPress,
    style,
    backgroundColor,
    fontWeight,
    heightButton,
    activeOpacity,
    onPressIn
  } = props;

  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      onPressIn={() => onPressIn && onPressIn()}
      disabled={disabled}
      activeOpacity={activeOpacity || 0.7}
    >
      { children ||
        <View style={[
          styles.contentContainer,
          { backgroundColor: backgroundColor, height: heightButton || 46}
        ]}>
          <View style={{ flex: 1 }}>
            {(startIcon && !isLoading) &&
              <MaterialCommunityIcons
                style={{ alignSelf: 'flex-start' }}
                name={startIcon}
                size={sizeIcon || 24}
                color={!disabled ? color : theme.textDisabled}
              />
            }
          </View>
          {!isLoading ?
            <DefaultText
              style={[
                styleText,
                {
                  textAlign: 'center',
                  textTransform: upperCase ? 'uppercase' : 'none'
                },
              ]}
              fontSize={fontSize || 16}
              fontWeight={fontWeight || 'medium'}
              color={color}
            >
              { label }
            </DefaultText>
            :
            <ActivityIndicator size={sizeIndication || 'large'} color={color} />
          }
          <View style={{ flex: 1 }}>
            {(endIcon && !isLoading) &&
              <MaterialCommunityIcons
                style={{ alignSelf: 'flex-end' }}
                name={endIcon}
                size={sizeIcon || 24}
                color={!disabled ? color : theme.textDisabled}
              />
            }
          </View>
        </View>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    borderRadius: 10,
    overflow: 'hidden'
  }
})