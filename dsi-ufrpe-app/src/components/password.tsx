import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInputProps, TouchableOpacity, View } from "react-native";
import InputText from "./input";


type Props = TextInputProps & {
  label?: string;
  leftIcon?: React.ReactNode;
};

const PasswordInput = ({ label = "Senha", leftIcon, ...rest }: Props) => {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.inputContainer}>
      <InputText placeholder={label} secureTextEntry={secure} leftIcon={leftIcon} {...rest}></InputText>
      <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.iconEye}>
        <Ionicons
          name={secure ? "eye-off" : "eye"}
          size={22}
          color={secure ? "#C4C4C4" : "#0162B3"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
  },
  iconEye: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 6,
  },
});

export default PasswordInput;
