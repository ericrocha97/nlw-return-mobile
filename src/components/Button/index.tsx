import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
} from "react-native";
import { theme } from "../../theme";

import { styles } from "./styles";

interface Props extends TouchableOpacityProps {
  isLoading: boolean;
  isDisabled?: boolean;
}

export function Button({ isLoading, isDisabled, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, isDisabled && styles.disabled]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.text_on_brand_color}
        />
      ) : (
        <Text style={styles.title}>Enviar feedback</Text>
      )}
    </TouchableOpacity>
  );
}
