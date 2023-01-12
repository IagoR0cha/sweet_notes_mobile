import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";

import { DefaultDateTimePicker } from "./DefaultDateTimePicker";

import 'dayjs/locale/pt-br';

type Props = {
  setShowPicker: (status: boolean) => void;
  showPicker: boolean;
  onChange: (date: Date) => void;
}

type PickerMap = {
  mode:  "time" | "date",
  key:  "time" | "date",
}

type DateData = {
  date: Date;
  time: Date;
}

export function DatetimePicker({ setShowPicker, showPicker, onChange }: Props) {
  const [stagePicker, setStagePicker] = useState(0);
  const [dateData, setDateData] = useState({} as DateData);

  const pickerMap: PickerMap[] = [
    { key: 'date', mode: 'date' },
    { key: 'time', mode: 'time' }
  ]

  const pickerController = useMemo(() => {
    return pickerMap[stagePicker];
  }, [stagePicker])

  const handleChangeDateData = useCallback((key: keyof DateData, value: Date) => {
    setDateData((props) => ({ ...props, [`${key}`]: value }));

    if (stagePicker + 1 < pickerMap.length) {
      setStagePicker((currentValue) => currentValue + 1);
      setShowPicker(false);
      setShowPicker(true);

      return;
    }

    setStagePicker(0);
    setShowPicker(false);

    const hour = dayjs(value).hour();
    const minute = dayjs(value).minute();

    // onChange(dayjs(dateData.date).hour(hour).minute(minute).subtract(3, 'hour').toDate());
    onChange(dayjs(dateData.date).hour(hour).minute(minute).toDate());
  }, [stagePicker, dateData])

  return (
    <DefaultDateTimePicker
      mode={pickerController.mode}
      onChangeDate={(value) => handleChangeDateData(pickerController.key, value)}
      setShowPicker={setShowPicker}
      showPicker={showPicker}
    />
  )
}