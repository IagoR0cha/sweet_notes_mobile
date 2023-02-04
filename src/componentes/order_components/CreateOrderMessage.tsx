import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { MaterialIconName } from "../../@types/materialIcon";
import { useTheme } from '../../providers/main/theme';
import { AlertKind, TodayProductionData } from '../../types/Production.type';
import { DefaultText } from '../_shared/DefaultText';
import { DefaultModal } from "../_shared/default_modal_components/DefaultModal";

type Props = {
  productionData: TodayProductionData;
  onSubmit: () => void;
  visible: boolean;
}

type ContentMap = {
  [key in AlertKind]: {
    icon: MaterialIconName;
    message: string;
    iconColor: string;
  }
}

export function CreateOrderMessage({ productionData, onSubmit, visible }: Props) {
  const { alert_kind } = productionData;

  const { theme } = useTheme();

  const contentMap: ContentMap = {
    'warning_massage': {
      icon: 'information-outline',
      iconColor: '#F4E136',
      message: 'Atenção! Seu valor de produção está chegando perto do limite!',
    },
    'limit_massage': {
      icon: 'alert-outline',
      iconColor: theme.error,
      message: 'Atenção! Seu valor de produção ultrapassou o limite!',
    },
  }

  const contentController = useMemo(() => {
    return alert_kind ? contentMap[alert_kind] : null;
  }, [productionData])

  return (
    <DefaultModal
      visible={visible && !!contentController}
      disableHeader
      submit={onSubmit}
      enableFooterButton
      footerButtonTitle="OK"
      footerButtonBackgroundColor={theme.primary}
    >
      {contentController &&
        <View style={styles.container}>
          <MaterialCommunityIcons name={contentController.icon} size={120} color={contentController.iconColor} />
          <DefaultText style={{ textAlign: 'center' }} fontSize={20} fontWeight='medium' color={theme.secondaryTextDefault}>
            { contentController.message }
          </DefaultText>
        </View>
      }
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16
  }
})