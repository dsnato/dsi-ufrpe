import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={statusBarStyle} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});