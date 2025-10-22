import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  duration = 3000,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset progress
      progressAnim.setValue(0);
      
      // Slide down animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, slideAnim, progressAnim, onHide]);

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          iconColor: '#FFFFFF',
          iconName: 'checkmark-circle' as const,
          progressColor: '#059669',
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          iconColor: '#FFFFFF',
          iconName: 'close-circle' as const,
          progressColor: '#DC2626',
        };
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          iconColor: '#FFFFFF',
          iconName: 'information-circle' as const,
          progressColor: '#2563EB',
        };
      default:
        return {
          backgroundColor: '#6B7280',
          iconColor: '#FFFFFF',
          iconName: 'information-circle' as const,
          progressColor: '#4B5563',
        };
    }
  };

  const toastStyle = getToastStyle();
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: toastStyle.backgroundColor,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={toastStyle.iconName}
          size={28}
          color={toastStyle.iconColor}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: toastStyle.progressColor,
            width: progressWidth,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 80,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
  },
});

export default Toast;
