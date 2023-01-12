import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DefaultText } from "./DefaultText";
import { useTheme } from "../../providers/main/theme";

type Props<T> = {
  data: T;
  index: number;
  onDelete: (index: number, id?: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function DefaultDeleteButtonHidden<T extends { id?: number }>({ data, index, onDelete, style }: Props<T>) {
  const { theme } = useTheme();

  return (
    <View style={[styles.rowBack, { backgroundColor: theme.error }, style]}>
      <TouchableOpacity
        style={[styles.backRightBtn]}
        onPress={() => onDelete(index, data.id)}
      >
        <MaterialCommunityIcons name="delete" size={30} color={theme.primaryTextLight} />
        <DefaultText fontSize={16} fontWeight='medium' color={theme.primaryTextLight}>
          Deletar
        </DefaultText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    borderRadius: 10,
    marginVertical: 4,
    overflow: 'hidden',
  },
  backRightBtn: {
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    width: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})