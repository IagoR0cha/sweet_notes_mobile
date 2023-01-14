import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DefaultBottomSheet, { useBottomSheetRef } from "../_shared/default_bottom_sheet_components/DefaultBottomSheet";
import { useTheme } from "../../providers/main/theme";
import { DefaultText } from "../_shared/DefaultText";
import { DefaultButton } from "../_shared/DefaultButton";
import { OrderIndexParams, StatusOrder } from "../../types/Order.type";
import { DefaultTextInput } from "../_shared/DefaultTextInput";
import { DateFilterButton } from "./DateFilterButton";
import { TypeInterval } from "../_shared/DefaultDateTimePicker";
import { useDebounce } from "../../helpers/useDebounce";
import dayjs from "dayjs";

type Props = {
  style?: StyleProp<ViewStyle>;
  onChangerFilter: (filter: OrderIndexParams) => void;
}

type StatusButtonMap = {
  [key in test]: StatusButtonData;
}

type StatusButtonData = {
  key: test;
  label: string;
  backgroundColor: string;
}

type test = StatusOrder | 'open-pending_payment';

export function OrderFilter({ style, onChangerFilter }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [filterParams, setFilterParams] = useState<OrderIndexParams>({
    start_at: dayjs(new Date).subtract(1, 'week').toDate(),
    final_at: dayjs(new Date).add(1, 'week').toDate(),
    status: ['open', 'pending_payment']
  });

  const bottomSheetRef = useBottomSheetRef();
  const { theme } = useTheme();

  const statusButtonMap: StatusButtonMap = {
    open: { key: 'open', label: 'Aberto', backgroundColor: theme.success },
    pending_payment: { key: 'pending_payment', label: 'Aguardando sinal', backgroundColor: theme.warning },
    close: { key: 'close', label: 'Fechado', backgroundColor: theme.danger },
    "open-pending_payment": { key: 'open-pending_payment', label: 'Aberto e Aguardando Sinal', backgroundColor: theme.info }
  }

  const handleOpenFilter =() => {
    setIsOpen(true);
    bottomSheetRef.current?.expand();
  }

  const handleChangeFilter = useCallback((data: OrderIndexParams) => {
    setFilterParams((params) => ({ ...params, ...data }));
  }, [])

  const handleToggleStatus = useCallback(() => {
    const { status } = filterParams;
    let newStatus = status;

    switch(status?.join('-')) {
      case 'open-pending_payment':
        newStatus = ['open'];
        break
      case 'open':
        newStatus = ['pending_payment'];
        break;
      case 'pending_payment':
        newStatus = ['close'];
        break;
      case 'close':
        newStatus = ['open', 'pending_payment'];
        break;
      default:
        newStatus = ['open', 'pending_payment'];
        break;
    }

    handleChangeFilter({ status: newStatus });
  }, [filterParams])

  const handleCleanFilter = useCallback(() => {
    const newParams: OrderIndexParams = {
      start_at: dayjs(new Date).subtract(1, 'week').toDate(),
      final_at: dayjs(new Date).add(1, 'week').toDate(),
      status: ['open']
    }

    onChangerFilter(newParams);
    bottomSheetRef.current?.snapToIndex(0);
    setIsOpen(false);
  }, [])

  const buttonStatusController = useMemo((): StatusButtonData => {

    return filterParams.status && filterParams.status.join('-') ?
      (statusButtonMap as any)[filterParams.status.join('-')] : {
        backgroundColor: theme.success,
        key: 'open',
        label: 'Aberto'
      }
  }, [filterParams])

  const handleChangeClientName = useDebounce((value: string) => {
    if (!value) {
      return setFilterParams((params) => {
        const currentParams = { ...params };
        delete currentParams.client;

        return currentParams;
      })
    }

    setFilterParams((params) => ({ ...params, client: value }));
  }, 500)

  function intervalController(type: TypeInterval, kind: 'start' | 'final') {
    if (type === 'min' && kind === 'final') {
      return filterParams.start_at;
    } else if (type === 'max' && kind === 'start') {
      return filterParams.final_at;
    }
  }

  const handleApplyFilter = useCallback(() => {
    onChangerFilter(filterParams);
  }, [filterParams])

  return (
    <>
      <TouchableHighlight
        style={[style, styles.buttonContainer]}
        onPress={handleOpenFilter}
      >
        <View style={[styles.buttonContainer, { backgroundColor: theme.secondary }]}>
          <MaterialCommunityIcons name="filter" size={32} color={theme.primaryTextLight} />
        </View>
      </TouchableHighlight>
      <DefaultBottomSheet
        ref={bottomSheetRef}
        index={0}
        enablePanDownToClose
        onDismiss={() => setIsOpen(false)}
      >
        {isOpen &&
          <View style={styles.bottomSheetContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <MaterialCommunityIcons name="filter-outline" size={32} color={theme.secondaryTextDefault} />
                <DefaultText
                  style={[styles.titleText]}
                  fontSize={20}
                  fontWeight='bold'
                  color={theme.secondaryTextDefault}
                >
                  Filtro de Pedidos
                </DefaultText>
              </View>
              <DefaultButton
                label="Aplicar"
                backgroundColor={theme.success}
                color={theme.secondaryTextDefault}
                onPress={handleApplyFilter}
              />
            </View>
            <DefaultButton
              style={styles.spacingVertical}
              label={`Status: ${buttonStatusController.label}`}
              backgroundColor={buttonStatusController.backgroundColor}
              color={theme.secondaryTextDefault}
              fontSize={16}
              onPress={handleToggleStatus}
            />
            <DefaultTextInput
              style={styles.spacingVertical}
              placeholder="Nome do cliente"
              onChangeText={handleChangeClientName}
              value={filterParams.client}
            />
            <View style={[styles.dateContainer, styles.spacingVertical]}>
              <DateFilterButton
                style={{ marginRight: 5 }}
                onChangeDate={(value) => handleChangeFilter({ start_at: value })}
                label='Data inicial'
                icon='calendar-today'
                intervalController={(type) => intervalController(type, 'start')}
                initialValue={filterParams.start_at}
              />
              <DateFilterButton
                style={{ marginLeft: 5 }}
                onChangeDate={(value) => handleChangeFilter({ final_at: value })}
                label='Data final'
                icon="calendar"
                intervalController={(type) => intervalController(type, 'final')}
                initialValue={filterParams.final_at}
              />
            </View>
            <DefaultButton
              style={styles.spacingVertical}
              label='Limpar filtros'
              startIcon="close"
              backgroundColor={theme.main}
              color={theme.primaryTextLight}
              fontSize={16}
              onPress={handleCleanFilter}
            />
          </View>
        }
      </DefaultBottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    paddingBottom: 8,
    paddingHorizontal: 16
  },
  buttonContainer: {
    height: 70,
    width: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    overflow: "hidden"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 8
  },
  spacingVertical: {
    marginVertical: 5
  },
  spacingHorizontal: {
    marginHorizontal: 5
  },
  dateContainer: {
    flexDirection: 'row',
  }
})