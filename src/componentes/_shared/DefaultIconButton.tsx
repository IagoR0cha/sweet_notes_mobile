import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { MaterialIconName } from "../../@types/materialIcon";
import { ComponentProps } from "react";
import { useTheme } from "../../providers/main/theme";

type Props = {
  icon: MaterialIconName;
  sizeIcon?: number;
  colorIcon?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
} & Omit<ComponentProps<typeof TouchableOpacity>, 'style'>;

export function DefaultIconButton(props: Props) {
  const {
    icon,
    sizeIcon,
    colorIcon,
    backgroundColor,
    style,
    ...buttonProps
  } = props

  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: backgroundColor || theme.secondary }, style]} { ...buttonProps }>
      <MaterialCommunityIcons name={icon} size={sizeIcon || 28} color={colorIcon || theme.primaryTextDefault} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10
  }
})