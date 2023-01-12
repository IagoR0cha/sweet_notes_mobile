import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../../providers/main/theme';
import { DefaultFooterButton } from '../DefaultFooterButton';

interface Props {
  acceptButton: ButtonData;
  rejectButton: ButtonData;
}

export type ButtonData = {
  label?: string;
  backgroundColor?: string;
  color?: string;
  isLoading?: boolean;
  onPress: () => void;
}

export function AcceptRejectButtons({ acceptButton, rejectButton }: Props) {
  const { theme } = useTheme();

  const defaultValue = {
    acceptButton: {
      label: 'OK',
      backgroundColor: theme.secondary,
      color: theme.primaryTextLight,
      onPress: acceptButton.onPress
    },
    rejectButton: {
      label: 'Cancelar',
      backgroundColor: theme.textDisabled,
      color: theme.secondaryTextDefault,
      onPress: rejectButton.onPress
    }
  }

  return (
    <View style={styles.footerButtonContainer}>
      <DefaultFooterButton
        style={styles.footerButton}
        name={acceptButton.label || defaultValue.acceptButton.label}
        backgroundColor={acceptButton.backgroundColor || defaultValue.acceptButton.backgroundColor}
        color={acceptButton.color || defaultValue.acceptButton.color}
        textSize={16}
        onPress={acceptButton.onPress}
        enableIndicator={acceptButton.isLoading}
      />
      <DefaultFooterButton
        style={styles.footerButton}
        name={rejectButton.label || defaultValue.rejectButton.label}
        backgroundColor={rejectButton.backgroundColor || defaultValue.rejectButton.backgroundColor}
        color={rejectButton.color || defaultValue.rejectButton.color}
        textSize={16}
        onPress={rejectButton.onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  footerButtonContainer: {
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1
  },
});