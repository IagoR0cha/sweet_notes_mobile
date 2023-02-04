import { RouteProp, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react"
import { ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DefaultBackground } from "../../componentes/_shared/DefaultBackground";
import { DefaultTextInput } from "../../componentes/_shared/DefaultTextInput";
import { useValidator } from "../../helpers/useValidator";
import { MainNavigatorParamList } from "../../routes/main_routes/_MainNavigator.routes";
import { CreateOrder, Order, OrderChanged, StatusOrder } from "../../types/Order.type"
import * as Api from "../../service/api";
import { useToast } from "../../providers/main/toast";
import { useTheme } from "../../providers/main/theme";
import { DefaultButton } from "../../componentes/_shared/DefaultButton";
import { DefaultPicker } from "../../componentes/_shared/DefaultPicker";
import { DefaultText } from "../../componentes/_shared/DefaultText";
import { useTransformDate } from "../../helpers/transform_date";
import { DatetimePicker } from "../../componentes/_shared/DatetimePicker";
import { ItemsPicker } from "../../componentes/create_edit_order_components/items_picker_components/ItemsPicker";
import { Item } from "../../types/Item.type";
import { CreateOrderMessage } from "../../componentes/order_components/CreateOrderMessage";
import { TodayProductionData } from "../../types/Production.type";

type Props = {
  route: RouteProp<MainNavigatorParamList, 'CreateEditOrder'>;
  navigation: any;
}

type StatusMap = {
  label: string;
  value: StatusOrder;
}

export function CreateEditOrderScreen({ route }: Props) {
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order>({
    client: null,
    description: null,
    order_date: new Date(),
    status: 'open'
  } as unknown as Order);
  const [items, setItems] = useState<Item[]>([]);
  const [currentProductionData, setCurrentProductionData] = useState<{data: TodayProductionData, isShow: boolean} | { isShow: false }>({ isShow: false });

  const toast = useToast();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const statusMap: StatusMap[] = [
    { label: 'Aberto', value: 'open' },
    { label: 'Fechado', value: 'close' },
    { label: 'Aguardando sinal', value: 'pending_payment' },
  ]

  const [errors, isValid, handleError] = useValidator(order, {
    client: { message: 'Informe o nome do cliente' },
    order_date: { message: 'Informe a data de entrega' }
  })

  async function getDataFromApi() {
    if (!route.params || !route.params.id) return setIsLoading(false);

    try {
      const response = await Api.Order.show(route.params.id).then(({ data }) => data);
      setOrder(response);
      setItems(response.items)
      setIsLoading(false);
    } catch(error) {
      toast.show('Erro ao editar o pedido. Tente novamente!', 'error', 'long');
      navigation.goBack();
    }
  }

  const handleChangeProduct = useCallback((orderChanged: OrderChanged) => {
    setOrder((params) => ({ ...params, ...orderChanged }));
  }, [])

  function handleSave() {
    isValid(save);
  }

  async function save() {
    try {
      if (order.id) {
        await Api.Order.update({
          ...order,
          itemizations_attributes: items
        } as CreateOrder);

        toast.show('Pedido salvo com sucesso!', 'success');
        navigation.goBack();
      } else {
        const { production } = await Api.Order.create({
          ...order,
          itemizations_attributes: items
        }).then(({ data }) => data);

        if (production.alert_kind) {
          setCurrentProductionData({ data: production, isShow: true });
        } else {
          toast.show('Pedido salvo com sucesso!', 'success');
          navigation.goBack();
        }
      }
    } catch(error) {
      toast.show('Erro ao salvar o pedido... Tente novamente!', 'error', 'long');
    }
  }

  const handleShowDatePicker = useCallback(() => {
    setIsShowDatePicker(true);
  }, [])

  const handleSubmit = useCallback(() => {
    toast.show('Pedido salvo com sucesso!', 'success');
    navigation.goBack();
  }, [])

  useEffect(() => {
    navigation.setOptions({
      title: (route.params && route.params.title) || 'Novo pedido',
      headerRight: () => (
        <DefaultButton
          label='Salvar'
          backgroundColor={theme.success}
          onPress={handleSave}
        />
      )
    })
  }, [order, items])

  useEffect(() => {
    getDataFromApi();
  }, [])

  return (
    <DefaultBackground isLoading={isLoading}>
      <ScrollView>
        <View style={{ paddingVertical: 16 }}>
          <DefaultTextInput
            inputStyle={styles.input}
            style={styles.inputContainer}
            label='Cliente'
            placeholder='Insira o nome do cliente'
            value={order.client}
            error={errors.client}
            onChangeText={(value) => handleChangeProduct({ client: value as string })}
            onFocus={() => handleError(null, 'client')}
          />
          <DefaultPicker
            style={[styles.input]}
            containerStyle={styles.inputContainer}
            label="Status"
            data={statusMap}
            placeholder='Selecione o status'
            onItemSelect={(value) => handleChangeProduct({ status: value as StatusOrder })}
            initialValue={statusMap[0]}
            keyToLabel={'label'}
          />
          <>
            <TouchableHighlight
              style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderRadius: 10, }]}
              onPress={handleShowDatePicker}
            >
              <View style={[styles.button, {
                backgroundColor: theme.inputBg,
              }, styles.input]}>
                <DefaultText
                  style={styles.textLabel}
                  color={theme.secondaryTextDefault}
                  fontSize={12}
                  fontWeight='regular'
                >
                  Data de entrega
                </DefaultText>
                <View style={styles.buttonContainer}>
                <DefaultText
                  fontSize={14}
                  color={theme.primaryTextDefault}
                >
                  { useTransformDate(order.order_date, 'DD/MM/YYYY HH:mm') }
                </DefaultText>
                <View style={{ flex: 1 }}>
                  <MaterialCommunityIcons
                    style={{ alignSelf: 'flex-end' }}
                    name={'chevron-down'}
                    size={24}
                    color={theme.primaryTextDefault}
                  />
                </View>
              </View>
              </View>
            </TouchableHighlight>
            <DatetimePicker
              showPicker={isShowDatePicker}
              setShowPicker={setIsShowDatePicker}
              onChange={(value) => handleChangeProduct({ order_date: value })}
            />
          </>
          <DefaultTextInput
            inputStyle={styles.input}
            style={styles.inputContainer}
            label='Descrição'
            placeholder='Insira uma descrição (Opcional)'
            value={order.description}
            error={errors.description}
            multiline
            onChangeText={(value) => handleChangeProduct({ description: value as string })}
          />
          <ItemsPicker
            style={[styles.inputContainer, styles.input]}
            itemsValue={items}
            onChangeItem={setItems}
          />
        </View>
      </ScrollView>
      {currentProductionData.isShow &&
        <CreateOrderMessage
          visible={currentProductionData.isShow}
          productionData={currentProductionData.data}
          onSubmit={handleSubmit}
        />
      }
    </DefaultBackground>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 16,
    marginVertical: 5
  },
  input: {
    elevation: 4,
  },
  button: {
    paddingVertical: 16,
    elevation: 0,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  textLabel: {
    marginLeft: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
})