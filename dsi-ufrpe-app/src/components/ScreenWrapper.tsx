import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface ScreenWrapperProps {
  children: React.ReactNode;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
  backgroundColor?: string;
}

export default function ScreenWrapper({ 
  children, 
  statusBarStyle = 'light',
  backgroundColor = 'transparent'
}: ScreenWrapperProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={statusBarStyle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});