import { useCallback, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";

import { DefaultBackground } from "../../componentes/_shared/DefaultBackground";
import { DefaultButton } from "../../componentes/_shared/DefaultButton";
import { DefaultIncrement } from "../../componentes/_shared/DefaultIncrement";
import { DefaultTextInput } from "../../componentes/_shared/DefaultTextInput";
import { useValidator } from "../../helpers/useValidator";
import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";
import { MainNavigatorParamList } from "../../routes/main_routes/_MainNavigator.routes";
import * as Api from "../../service/api";
import { Product, ProductApi, ProductChanged } from "../../types/Product.type";

type Props = {
  route: RouteProp<MainNavigatorParamList, 'CreateEditProducts'>;
  navigation: any;
}

type InputMap = {
  key: keyof Omit<Product, 'id'>;
  label: string;
  placeholder: string;
  typeNumber?: boolean;
}

export function CreateEditProductScreen({ route }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product>({
    name: null,
    description: null,
    make_price: null,
    sale_price: null,
    weight: null
  } as unknown as Product);

  const [errors, isValid, handleError] = useValidator(product, {
    name: { message: 'Informe o nome do produto' },
    make_price: { message: 'Informe o preço de produção' },
    sale_price: { message: 'Informe o preço de venda' },
    weight: { message: 'Informe o peso de produção' },
  })

  const inputMap: InputMap[] = [
    { key: "name", label: "Nome", placeholder: "Insira o nome do produto" },
    { key: "make_price", label: "Preço de produção", placeholder: "Insira o preço de produção", typeNumber: true },
    { key: "sale_price", label: "Preço de venda", placeholder: "Insira o preço de venda", typeNumber: true },
  ]

  const toast = useToast();
  const navigation = useNavigation();
  const { theme } = useTheme();

  async function getDataFromApi() {
    if (!route.params || !route.params.id) return setIsLoading(false);

    try {
      const response = await Api.Product.show(route.params.id).then(({ data }) => data);
      setProduct(response);
      setIsLoading(false);
    } catch(error) {
      toast.show('Erro ao editar o produto. Tente novamente!', 'error');
      navigation.goBack();
    }
  }

  const handleChangeProduct = useCallback((productChanged: ProductChanged) => {
    setProduct((params) => ({ ...params, ...productChanged }));
  }, [])

  function handleSave() {
    isValid(save);
  }

  async function save() {
    try {
      if (product.id) {
        await Api.Product.update(product as ProductApi);
      } else {
        await Api.Product.create(product);
      }

      toast.show('Produto salvo com sucesso!', 'success');
      navigation.goBack();
    } catch(error) {
      toast.show('Erro ao salvar o produto... Tente novamente!', 'error', 'long');
    }
  }

  useEffect(() => {
    getDataFromApi();
  }, [])


  useEffect(() => {
    navigation.setOptions({
      title: (route.params && route.params.title) || 'Novo produto',
      headerRight: () => (
        <DefaultButton
          label='Salvar'
          backgroundColor={theme.success}
          onPress={handleSave}
        />
      )
    })
  }, [product])

  return (
    <DefaultBackground isLoading={isLoading}>
      <ScrollView>
        <View style={{ paddingVertical: 8 }}>
          {inputMap.map(({ key, label, placeholder, typeNumber }) => (
            <DefaultTextInput
              key={key}
              inputStyle={styles.input}
              style={styles.inputContainer}
              label={label}
              placeholder={placeholder}
              value={product[key]}
              error={errors[key]}
              isOnlyNumber={typeNumber}
              keyboardType={typeNumber ? (Platform.OS === 'android' ? "numeric" : "number-pad") : 'default'}
              onChangeText={(value) => handleChangeProduct({ [`${key}`]: value })}
              onFocus={() => handleError(null, key)}
            />
          ))}
          <DefaultIncrement
            inputStyle={styles.input}
            style={styles.inputContainer}
            label="Peso de produção"
            value={product.weight}
            error={errors.weight}
            onChangeText={(value) => {
              handleError(null, 'weight')
              handleChangeProduct({ weight: value })
            }}
          />
          <DefaultTextInput
            inputStyle={styles.input}
            style={styles.inputContainer}
            label='Descrição'
            placeholder='Insira uma descrição (Opcional)'
            value={product['description']}
            error={errors.description}
            multiline
            onChangeText={(value) => handleChangeProduct({ description: value as string })}
          />
        </View>
      </ScrollView>
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
  }
})