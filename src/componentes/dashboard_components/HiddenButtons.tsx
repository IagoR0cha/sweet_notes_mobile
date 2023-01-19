import { StyleSheet, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { MaterialIconName } from "../../@types/materialIcon";
import { useTheme } from "../../providers/main/theme"
import { OrderApi, StatusOrder } from "../../types/Order.type";
import { DefaultButton } from "../_shared/DefaultButton";
import { DefaultText } from "../_shared/DefaultText";
import { useCallback, useMemo } from "react";
import { Order } from "../../service/api";
import { useToast } from "../../providers/main/toast";

type Props = {
  data: OrderApi;
  index: number;
  onChangeItem: (item: OrderApi, index: number) => void;
}

type PropsButton = {
  onPress: () => void;
  label: string;
  icon: MaterialIconName;
  backgroundColor: string;
  color: string;
}

type RightKindButton = 'open' | 'pending_payment'

type RightKindButtonMap = {
  [key in RightKindButton]: PropsButton
}

export function HiddenButtons(props: Props) {
  const { data, onChangeItem, index } = props;
  const { id, status } = data;

  const { theme } = useTheme();
  const toast = useToast();

  const handleChangeStatusOrder = useCallback(async (status: StatusOrder) => {
    try {
      const response = await Order.update({ id, status }).then(({ data }) => data);
      onChangeItem(response, index);

      toast.show('Ação concluída com sucesso!', 'success');
    } catch(error) {
      toast.show('Erro ao realizar ação. Tente novamente!', 'error', 'long');
    }
  }, [id])

  const rightKindButtonMap: RightKindButtonMap = {
    pending_payment: {
      label: 'Abrir pedido',
      backgroundColor: theme.success,
      color: theme.secondaryTextDefault,
      icon: 'check-all',
      onPress: () => handleChangeStatusOrder('open')
    },
    open: {
      label: 'Aguardando sinal',
      backgroundColor: theme.warning,
      color: theme.secondaryTextDefault,
      icon: 'check',
      onPress: () => handleChangeStatusOrder('pending_payment')
    }
  }

  const kindButtonController = useMemo(() => {
    if (status === 'close') return null;

    return rightKindButtonMap[status];
  }, [status])

  if (!kindButtonController) {
    return null;
  }

  return (
    <View style={[styles.rowBack]}>
      <DefaultButton
        style={[styles.leftBtn, { backgroundColor: kindButtonController.backgroundColor }]}
        onPress={kindButtonController.onPress}
      >
        <MaterialCommunityIcons
          name={kindButtonController.icon} size={24}
          color={kindButtonController.color}
        />
        <DefaultText
          fontSize={12} fontWeight='medium'
          color={kindButtonController.color}
        >
          { kindButtonController.label }
        </DefaultText>
      </DefaultButton>
      <DefaultButton
        style={[styles.rightBtn, { backgroundColor: theme.info }]}
        backgroundColor={theme.danger}
        color={theme.secondaryTextDefault}
        onPress={() => handleChangeStatusOrder('close')}
      >
        <MaterialCommunityIcons
          name={'package-variant-closed'} size={24}
          color={theme.secondaryTextDefault}
        />
        <DefaultText
          fontSize={12} fontWeight='medium'
          color={theme.secondaryTextDefault}
        >
          Fechar pedido
        </DefaultText>
      </DefaultButton>
    </View>
  )
}

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    borderRadius: 10,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  leftBtn: {
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: 120,
  },
  rightBtn: {
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    width: 120,
  },

})
// import { StyleSheet, View } from "react-native"
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// import { MaterialIconName } from "../../@types/materialIcon";
// import { useTheme } from "../../providers/main/theme"
// import { OrderApi } from "../../types/Order.type";
// import { DefaultButton } from "../_shared/DefaultButton";
// import { DefaultText } from "../_shared/DefaultText";

// type Props = {
//   data: OrderApi;
//   leftButton: PropsButton;
//   rightButton: PropsButton;
// }

// type PropsButton = {
//   onPress: (id: number) => void;
//   label: string;
//   icon: MaterialIconName;
//   backgroundColor: string;
//   color: string;
// }

// export function HiddenButtons(props: Props) {
//   const { leftButton, rightButton, data } = props;
//   const { id } = data;

//   const { theme } = useTheme();

//   return (
//     <View style={[styles.rowBack]}>
//       <DefaultButton
//         style={[styles.leftBtn]}
//         backgroundColor={leftButton.backgroundColor || theme.info}
//         color={leftButton.color || theme.secondaryTextDefault}
//         onPress={() => leftButton.onPress(id)}
//       >
//         <MaterialCommunityIcons
//           name={leftButton.icon} size={30}
//           color={leftButton.color || theme.secondaryTextDefault}
//         />
//         <DefaultText
//           fontSize={16} fontWeight='medium'
//           color={leftButton.color || theme.secondaryTextDefault}
//         >
//           { leftButton.label }
//         </DefaultText>
//       </DefaultButton>
//       <DefaultButton
//         style={[styles.rightBtn]}
//         backgroundColor={rightButton.backgroundColor || theme.info}
//         color={rightButton.color || theme.secondaryTextDefault}
//         onPress={() => rightButton.onPress(id)}
//       >
//         <MaterialCommunityIcons
//           name={rightButton.icon} size={30}
//           color={rightButton.color || theme.secondaryTextDefault}
//         />
//         <DefaultText
//           fontSize={16} fontWeight='medium'
//           color={rightButton.color || theme.secondaryTextDefault}
//         >
//           { rightButton.label }
//         </DefaultText>
//       </DefaultButton>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   rowBack: {
//     flex: 1,
//     borderRadius: 10,
//     marginVertical: 4,
//     overflow: 'hidden',
//   },
//   leftBtn: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'flex-start',
//     justifyContent: 'center'
//   },
//   rightBtn: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'flex-end',
//     justifyContent: 'center'
//   },
// })