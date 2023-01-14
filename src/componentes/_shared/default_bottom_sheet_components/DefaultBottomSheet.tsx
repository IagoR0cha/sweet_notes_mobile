import React, { ReactNode, Ref, useMemo, useRef } from 'react';
import { StyleSheet, View } from "react-native";
import { BottomSheetProps, BottomSheetModal, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';

import { SheetHandle } from './SheetHandle';


interface Props extends Omit<BottomSheetProps, 'snapPoints'> {
  snapPoints?: (string | number)[];
  children: ReactNode;
  onDismiss?: () => void;
}

function DefaultBottomSheet(props: Props, ref: Ref<BottomSheetModal> ) {
  const {
    children,
    snapPoints = [],
    onDismiss
  } = props;

  const initialSnapPoints = useMemo(() => [...snapPoints, 'CONTENT_HEIGHT', 'CONTENT_HEIGHT'], [snapPoints]);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <BottomSheet
      { ...props }
      ref={ref}
      index={props.index || -1}
      backgroundStyle={{ backgroundColor: '#fff', borderRadius: 0 }}
      handleComponent={() => <SheetHandle />}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enableContentPanningGesture={true}
      onClose={onDismiss}
    >
      <View onLayout={handleContentLayout}>
        { children }
      </View>
    </BottomSheet>
  );
}

export default React.forwardRef(DefaultBottomSheet);

export function useBottomSheetRef() {
  return useRef<BottomSheetModal>(null);
}

const styles = StyleSheet.create({

})