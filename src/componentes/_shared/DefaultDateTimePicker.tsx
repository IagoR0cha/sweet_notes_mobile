import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { DefaultModal } from './default_modal_components/DefaultModal';
import dayjs from 'dayjs';
import { useTheme } from '../../providers/main/theme';

type Props = {
  showPicker: boolean;
  onChangeDate: (selectedDate: Date) => void;
  setShowPicker: (status: boolean) => void;
  intervalController?: (type: TypeInterval) => Date | undefined;
  initialValue?: Date;
  mode: 'time' | 'date'
}

export type TypeInterval = 'max' | 'min';

export function DefaultDateTimePicker(props: Props) {
  const [auxDate, setAuxDate] = useState(props.initialValue ? new Date(props.initialValue) : new Date);

  const { theme } = useTheme();

  const {
    showPicker,
    setShowPicker,
    intervalController,
    onChangeDate,
    mode
  } = props;

  function handleSetDate(event: DateTimePickerEvent, currentSelectedDate: any) {
    if (!currentSelectedDate || event.type === 'dismissed') {
      setShowPicker(false);
      return null;
    }

    const selectedDate = new Date(dayjs(currentSelectedDate).toISOString())

    if(Platform.OS === 'android') {
      setShowPicker(false);
      onChangeDate(selectedDate);
    }
    setAuxDate(currentSelectedDate);
  }

  function handleSubmitDateOnIOS() {
    setShowPicker(false);
    onChangeDate(auxDate);
  }

  return (
    <>
      {showPicker && Platform.OS === 'android' &&
        <DateTimePicker
          value={auxDate}
          onChange={handleSetDate}
          display="default"
          mode={mode}
          minimumDate={intervalController && intervalController('min')}
          maximumDate={intervalController && intervalController('max')}
          themeVariant={'light'}
        />
      }
      {Platform.OS === 'ios' &&
        <DefaultModal
          visible={showPicker && Platform.OS === 'ios'}
          closeModal={setShowPicker}
          enableFooterButton
          submit={handleSubmitDateOnIOS}
          footerButtonBackgroundColor={theme.success}
        >
          <View style={styles.modalContainer}>
            <DateTimePicker
              style={{ width: '100%'}}
              value={auxDate}
              onChange={handleSetDate}
              display={mode === 'date' ? 'inline' : 'spinner' }
              mode={mode}
              themeVariant={'light'}
              minimumDate={intervalController && intervalController('min')}
              maximumDate={intervalController && intervalController('max')}
            />
          </View>
        </DefaultModal>
      }
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
})