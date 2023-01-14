import { useCallback, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTransformDate } from "../../helpers/transform_date";
import { useTheme } from "../../providers/main/theme";
import { DefaultButton } from "../_shared/DefaultButton";
import { DefaultDateTimePicker, TypeInterval } from "../_shared/DefaultDateTimePicker";
import { DefaultText } from "../_shared/DefaultText";
import { MaterialIconName } from "../../@types/materialIcon";

type Props = {
  onChangeDate: (value: Date) => void;
  style?: StyleProp<ViewStyle>;
  label: string;
  icon: MaterialIconName;
  intervalController?: ((type: TypeInterval) => Date | undefined) | undefined;
  initialValue?: Date;
}

export function DateFilterButton({ onChangeDate, style, label, icon, intervalController, initialValue }: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(initialValue || new Date());
  const [pickerIsVisible, setPickerIsVisible] = useState(false);

  const { theme } = useTheme();

  const handleChangeDate = useCallback((value: Date) => {
    setCurrentDate(value);
    onChangeDate(value);
  }, [])

  const handleOpenDatePicker = useCallback(() => {
    setPickerIsVisible(true);
  }, [])

  return (
    <>
      <DefaultButton
        style={[styles.container, { backgroundColor: theme.main }, style]}
        onPress={handleOpenDatePicker}
      >
        <MaterialCommunityIcons name={icon} size={30} color={theme.primaryTextLight} />
        <View style={styles.contentContainer}>
          <DefaultText
            style={{ marginBottom: 2 }}
            color={theme.primaryTextLight}
            fontSize={12}
            fontWeight='regular'
          >
            { label }
          </DefaultText>
          <DefaultText
            style={{ alignSelf: 'center' }}
            color={theme.primaryTextLight}
            fontWeight='bold'
            fontSize={16}
          >
            { useTransformDate(currentDate) }
          </DefaultText>
        </View>
      </DefaultButton>
      <DefaultDateTimePicker
        mode="date"
        onChangeDate={handleChangeDate}
        setShowPicker={setPickerIsVisible}
        showPicker={pickerIsVisible}
        intervalController={intervalController}
        initialValue={initialValue}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  }
})