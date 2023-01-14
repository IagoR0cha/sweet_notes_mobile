import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "../../providers/main/theme";
import { DefaultIconButton } from "./DefaultIconButton";
import { DefaultPill } from "./DefaultPill";
import { DefaultText } from "./DefaultText";

type Props = {
  title: string;
  subTitle?: string;
  centerText?: string;
  onEdit: () => void;
  pillData?: ComponentProps<typeof DefaultPill>
}

export function DefaultListItem(props: Props) {
  const { title, subTitle, onEdit, centerText, pillData } = props;

  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBg }]}>
      <View style={styles.titleContainer}>
        <DefaultText style={styles.capitalizeText} fontSize={16} fontWeight='regular'>
          { title }
        </DefaultText>
        {!!subTitle &&
          <DefaultText style={styles.capitalizeText} fontSize={12}>
            { subTitle }
          </DefaultText>
        }
        {pillData &&
          <DefaultPill style={{ marginTop: 8 }} { ...pillData } />
        }
      </View>
      {!!centerText &&
        <View style={styles.centerContainer}>
        <DefaultText>
            { centerText }
          </DefaultText>
        </View>
      }
      <DefaultIconButton
        icon="pencil"
        colorIcon={theme.primaryTextLight}
        onPress={onEdit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginVertical: 4,
    elevation: 5
  },
  titleContainer: {
    alignItems: 'flex-start'
  },
  centerContainer: {

  },
  capitalizeText: {
    textTransform: 'capitalize',
  }
})