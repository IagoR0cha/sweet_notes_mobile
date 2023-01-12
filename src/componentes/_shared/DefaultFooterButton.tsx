import React, { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, StyleProp, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../providers/main/theme';

interface Props {
  name: string;
  onPress: () => void;
  startIcon?: ComponentProps<typeof MaterialCommunityIcons>['name'] | null;
  endIcon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  backgroundColor?: string;
  color?: string;
  sizeIcon?: number;
  textSize?: number;
  disabled?: boolean;
  upperCase?: boolean;
  fontFamily?: string;
  activeOpacity?: number;
  bold?: boolean;
  styleText?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  enableIndicator?: boolean;
  sizeIndication?: ComponentProps<typeof ActivityIndicator>['size'];
}

export function DefaultFooterButton(props: Props) {
  const { theme } = useTheme();

  const {
    onPress,
    backgroundColor,
    color,
    endIcon,
    sizeIcon,
    startIcon,
    textSize,
    disabled,
    name,
    upperCase,
    fontFamily,
    activeOpacity,
    bold,
    styleText,
    style,
    enableIndicator,
    sizeIndication
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={style}
    >
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: !disabled ? backgroundColor : theme.textDisabled },
        ]}
      >
        { startIcon && !enableIndicator ?
            <MaterialCommunityIcons
              name={startIcon}
              size={sizeIcon}
              color={!disabled ? color : theme.secondaryTextDefault}
            />
          : null
        }
        {!enableIndicator ?
          <Text
            style={[
              styleText,
              {
                color: !disabled ? color : theme.secondaryTextDefault,
                fontSize: textSize || 18,
                textTransform: upperCase ? 'uppercase' : 'none',
                fontWeight: '600'
              }
            ]}
          >
            { name }
          </Text>
          :
          <ActivityIndicator size={sizeIndication || 'large'} color={color} />
        }
        { endIcon && !enableIndicator ?
            <MaterialCommunityIcons
              name={endIcon}
              size={sizeIcon}
              color={!disabled ? color : theme.secondaryTextDefault}
            />
          : null
        }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 47,
  }
});