import {
  TextInput,
  StyleSheet,
  View,
  Text,
  KeyboardTypeOptions,
  ViewStyle,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { COLORS } from "../utils";

type Props = {
  placeholder: string;
  currency?: boolean;
  multiline?: boolean;
  height: number;
  keyboardType?: KeyboardTypeOptions | undefined;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  containerStyle?: ViewStyle | any;
};

const AppTextInput: React.FC<Props> = ({
  placeholder,
  currency,
  multiline,
  height,
  keyboardType,
  value,
  containerStyle,
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View>
      <TextInput
        style={[
          styles.textInput,
          containerStyle,
          { height },
          isFocused && styles.textInputFocused,
        ]}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
      {currency && <Text style={styles.currencyText}>€</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  currencyText: {
    position: "absolute",
    right: 10,
    top: 20,
    fontSize: 18,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 18,
  },
  textInputFocused: {
    borderColor: COLORS.primary,
  },
});

export default AppTextInput;
