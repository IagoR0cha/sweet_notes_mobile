import { useMemo } from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

import { useTheme } from "../../providers/main/theme";
import { FontMap, FontWeight } from "../../types/Font.type";


type Props = {
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  fontWeight?: FontWeight;
  style?: StyleProp<TextStyle>;
} & TextProps;

export function DefaultText(props: Props) {
  const {
    children,
    fontWeight,
    fontSize,
    color,
    style,
    ...allProps
  } = props;

  const { theme } = useTheme();

  const fontMap: FontMap = {
    bold: 'Roboto_700Bold',
    medium: 'Roboto_500Medium',
    regular: 'Roboto_400Regular'
  }

  const fontControl = useMemo(() => {
    return fontWeight ? fontMap[fontWeight] : fontMap['regular'];
  }, [fontWeight])

  return (
    <Text
      { ...allProps }
      style={[
        {
          fontFamily: fontControl,
          fontSize: fontSize || 14,
          color: color || theme.primaryTextDefault,
          flexWrap: 'wrap',
        },
        style
      ]}
    >
      { children }
    </Text>
  );
}