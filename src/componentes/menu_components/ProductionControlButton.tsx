import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from "../../providers/main/theme";
import { useToast } from "../../providers/main/toast";
import { Production } from "../../service/api";
import { ProductionApi } from "../../types/Production.type";
import { DefaultButton } from "../_shared/DefaultButton";
import { DefaultText } from "../_shared/DefaultText";
import { DefaultTextInput } from "../_shared/DefaultTextInput";
import { DefaultModal } from "../_shared/default_modal_components/DefaultModal";

type ProductionDataMap = {
  label: string;
  key: keyof Omit<ProductionApi, 'id'>;
}

export function ProductionControlButton() {
  const [isLoading, setIsLoading] = useState(true);
  const [production, setProduction] = useState<ProductionApi>({} as ProductionApi);
  const [productionEdited, setProductionEdited] = useState<ProductionApi>({} as ProductionApi);
  const [modalIsShow, setModalIsShow] = useState(false);

  const { theme } = useTheme();
  const toast = useToast();

  const productionDataMap = useMemo((): ProductionDataMap[] => {
    if (!Object.keys(production).length) return [];

    return [
      { label: 'Valor para alerta', key: 'warning_value' },
      { label: 'Valor de limite', key: 'limit_value' },
    ]
  }, [production])

  const handleChangeProductionData = useCallback((data: Partial<ProductionApi>) => {
    setProductionEdited((params) => ({ ...params, ...data }));
  }, [])

  async function getDataFromApi() {
    setIsLoading(true);

    try {
      const response = await Production.show().then(({ data }) => data);

      setProduction(response);
      setProductionEdited(response);
    } catch(error) {
      toast.show('Erro ao carregar dados de produção. Tente novamente!', 'error', 'long');
    }

    setIsLoading(false);
  }

  const handleSave = useCallback(async () => {
    try {
      const response = await Production.update(productionEdited).then(({ data }) => data);
      setProduction(response);
      setModalIsShow(false);
    } catch(error) {
      toast.show('Erro ao salvar os dados de produção. Tente novamente!', 'error', 'long');
    }
  }, [productionEdited])

  useEffect(() => {
    getDataFromApi();
  }, [])

  return (
    <>
      <DefaultButton
        style={[styles.container, { backgroundColor: theme.primary }]}
        onPress={() => setModalIsShow(true)}
      >
        <>
          <View style={[styles.header, { backgroundColor: theme.main }]}>
            <DefaultText fontSize={16} fontWeight='bold' color={theme.primaryTextLight} >
              Produção diária
            </DefaultText>
            <MaterialCommunityIcons name="arrow-right" size={32} color={theme.primaryTextLight} />
          </View>
          <View style={styles.body}>
            {productionDataMap.map(({ label, key }, index) => (
                <View key={index} style={styles.dataContainer}>
                  <DefaultText fontSize={14} fontWeight='medium' color={theme.secondaryTextDefault}>
                    { label }
                  </DefaultText>
                  {!isLoading ?
                    <DefaultText fontSize={16} fontWeight='bold'>
                      { production[key] }
                    </DefaultText>
                    :
                    <ActivityIndicator color={theme.tertiary} size={'small'} />
                  }
                </View>
            ))}
          </View>
        </>
      </DefaultButton>
      <DefaultModal
        visible={modalIsShow}
        closeModal={setModalIsShow}
        title='Editar dados de produção diária'
        styleBody={{ paddingHorizontal: 20, paddingVertical: 16 }}
        enableFooterButton
        footerButtonBackgroundColor={theme.success}
        footerButtonTitle='Salvar'
        submit={handleSave}
      >
        {productionDataMap.map(({ key, label }) => (
          <DefaultTextInput
            key={key}
            style={{ marginVertical: 4 }}
            label={label}
            value={productionEdited[key]}
            isOnlyNumber
            keyboardType={Platform.OS === 'android' ? "numeric" : "number-pad"}
            onChangeText={(value) => handleChangeProductionData({ [`${key}`]: value })}
          />
        ))}
      </DefaultModal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    elevation: 4,
    marginHorizontal: 16,
    overflow: 'hidden'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 16,
    marginVertical: 2
  }
})