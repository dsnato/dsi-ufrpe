import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = TextInputProps & {
  label?: string;
};

const PasswordInput = ({ value, onChangeText, placeholder, label = "Senha", ...rest }: Props) => {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#5aa3a3"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off" : "eye"}
            size={22}
            color="#0a7d7d"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#0a7d7d",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7f7",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: "#0a7d7d",
  },
});

export default PasswordInput;
