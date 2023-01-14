import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../../providers/main/theme";
import { DefaultText } from "./DefaultText";

type Props = {
  status: StatusPillKind;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export type StatusPillKind = 'warning' | 'success' | 'error';

type StatusKindMap = {
  [key in StatusPillKind]: {
    backgroundColor: string;
  }
}

export function DefaultPill({ status, label, style }: Props) {
  const { theme } = useTheme();

  const statusKindMap: StatusKindMap = {
    success: { backgroundColor: theme.success },
    error: { backgroundColor: theme.danger },
    warning: { backgroundColor: theme.warning },
  }

  const statusKindController = useMemo(() => {
    return statusKindMap[status];
  }, [status])

  return (
    <View style={[styles.container, { backgroundColor: statusKindController.backgroundColor }, style]}>
      <DefaultText
        fontSize={12}
        fontWeight='regular'
        color={theme.secondaryTextDefault}
      >
        { label }
      </DefaultText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 10
  }
})