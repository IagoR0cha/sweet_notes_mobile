import React, { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, ViewStyle, StyleProp, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootSiblingParent } from 'react-native-root-siblings';

import { useTheme } from '../../../providers/main/theme';
import { DefaultFooterButton } from '../DefaultFooterButton';

interface Props {
  title?: string;
  children: ReactNode;
  visible: boolean;
  closeModal?: (status: boolean) => void;
  style?: StyleProp<ViewStyle>;
  submit?: () => void;
  enableFooterButton?: boolean;
  header?: ReactNode;
  styleBody?: StyleProp<ViewStyle>;
  styleHeader?: StyleProp<ViewStyle>;
  closeButtonColor?: string;
  enableFullScreen?: boolean;
  animationType?: ComponentProps<typeof Modal>['animationType'];
  childrenFooter?: ReactNode | null;
  disableHeader?: boolean;
  footerButtonTitle?: string;
  inactiveRootSiblingParent?: boolean;
  footerButtonBackgroundColor?: string;
}

type FullScreen = {
  modalPaddingHorizontal: number;
  modalHeight: string | number;
  borderRadiusModal: number;
  paddingTopHeader?: number;
}

export function DefaultModal(props: Props) {
  const {
    visible,
    title,
    children,
    closeModal,
    style,
    submit,
    enableFooterButton = false,
    header,
    styleBody,
    styleHeader,
    closeButtonColor,
    enableFullScreen,
    animationType,
    childrenFooter,
    disableHeader,
    footerButtonTitle,
    inactiveRootSiblingParent,
    footerButtonBackgroundColor
  } = props;

  const { theme } = useTheme();

  function fullScreenController(): FullScreen {
    if (enableFullScreen) {
      return {
        modalPaddingHorizontal: 0,
        modalHeight: '100%',
        borderRadiusModal: 0,
        paddingTopHeader: Platform.OS === 'ios' ? 28 : 16
      }
    }

    return {
      modalPaddingHorizontal: 20,
      modalHeight: 'auto',
      borderRadiusModal: 10,
    }
  }

  return (
    <Modal
      animationType={animationType || 'fade'}
      transparent={true}
      visible={visible}
      supportedOrientations={['portrait', 'landscape']}
    >
      <RootSiblingParent inactive={inactiveRootSiblingParent}>
        <View
          style={[styles.modalContainer, {
            backgroundColor: theme.backgroundDarkTransparent,
            paddingHorizontal: fullScreenController().modalPaddingHorizontal
          }]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.card,
                justifyContent: enableFooterButton ? 'space-between' : 'flex-start',
                height: fullScreenController().modalHeight,
                borderRadius: fullScreenController().borderRadiusModal
              },
              style
            ]}
          >
            {!disableHeader &&
              <View style={[styles.modalHeader, {
                backgroundColor: theme.main,
                paddingTop: fullScreenController().paddingTopHeader
                }, styleHeader]}>
                {header ||
                  <Text style={[styles.textTitle, { color: theme.primaryTextLight }]} >
                    { title }
                  </Text>
                }
                <TouchableOpacity onPress={() => closeModal && closeModal(false)}>
                  <MaterialCommunityIcons
                    name="window-close"
                    size={24}
                    color={closeButtonColor || theme.primaryTextLight}
                    />
                </TouchableOpacity>
              </View>
            }
            <View style={[styles.modalBody, styleBody]}>
              { children }
            </View>
            <View style={styles.modalFooter}>
              {enableFooterButton ?
                <DefaultFooterButton
                  name={footerButtonTitle || 'OK'}
                  onPress={submit!}
                  backgroundColor={footerButtonBackgroundColor || theme.tertiary}
                  color={theme.primaryTextDefault}
                />
                :
                !!childrenFooter && childrenFooter
              }
            </View>
          </View>
        </View>
      </RootSiblingParent>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButtonContainer: {
    padding: 10,
  },
  textTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    fontWeight: '600'
  },
  modalBody: {
    paddingHorizontal: 8,
  },
  modalFooter: {
    marginBottom: -1,
  }
});