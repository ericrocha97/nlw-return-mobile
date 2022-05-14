import { Camera, Trash } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View, Image, ActivityIndicator } from "react-native";

import { styles } from "./styles";
import { theme } from "../../theme";

interface Props {
  screenshot: string | null;
  isLoading: boolean;
  onTakeShot: () => void;
  onRemoveShot: () => void;
}

export function ScreenshotButton({
  screenshot,
  onRemoveShot,
  onTakeShot,
  isLoading,
}: Props) {
  return (
    <TouchableOpacity
      onPress={screenshot ? onRemoveShot : onTakeShot}
      style={styles.container}
    >
      {screenshot ? (
        <View>
          <Image style={styles.image} source={{ uri: screenshot }} />
          <Trash
            size={16}
            color={theme.colors.text_secondary}
            weight="fill"
            style={styles.removeIcon}
          />
        </View>
      ) : (
        <>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.text_primary} />
          ) : (
            <Camera size={24} color={theme.colors.text_primary} weight="bold" />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
