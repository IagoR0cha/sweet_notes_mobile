import { StyleSheet, View } from "react-native";

import { Shadow } from 'react-native-shadow-2';

export function SheetHandle() {
  const RADIUS = 20;

  return (
    <Shadow
      sides={{ top: true, bottom: false, end: false, start: false }}
      corners={{ bottomEnd: false, bottomStart: false, topEnd: true, topStart: true }}
      distance={15}
      startColor='#00000011'
      style={styles.shadowContainer}
    >
      <View style={[styles.handleContainer, {
        borderTopLeftRadius: RADIUS,
        borderTopRightRadius: RADIUS,
      }]}>
        <View style={styles.handle} />
      </View>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
    borderRadius: 20
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 30,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 4,
  },
})