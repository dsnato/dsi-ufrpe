import ButtonPoint from '@/src/components/button';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/src/components/ToastContext';
import { translateAuthError } from '@/src/utils/errorMessages';

const ConfirmacaoEmailScreen: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();
  
  // Animação de loading (pulsação)
  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);

  // Animação de pulsação contínua
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Animação de rotação contínua
  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    rotate.start();

    return () => rotate.stop();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    if (canResend) {
      // Voltar para tela anterior para reenviar
      router.back();
    }
  };

  const handleContinue = async () => {
    router.push({
        pathname: '/screens/RecuperacaoSenha/email-verificado',
        params: { email }
    });
    // setLoading(true);
    // try {
    //     const { error } = await supabase.auth.updateUser({
    //     });

    //     if (error) {
    //     if (
    //         error.message &&
    //         error.message.toLowerCase().includes('auth session missing')
    //     ) {
    //         showError('Você ainda não verificou seu email. Por favor, verifique seu email e tente novamente.');
    //     } else {
    //         showError(translateAuthError(error.message));
    //     }
    //     } else {
    //     // Navegar para tela de sucesso
    //     router.push('/screens/RecuperacaoSenha/sucesso');
    //     }
    // } catch (err) {
    //     showError('Erro ao atualizar senha');
    // } finally {
    //     setLoading(false);
    // }
    }


  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Recuperação de Senha</Text>

      {/* Ícone de email */}
      <View style={styles.iconContainer}>
        <View style={styles.emailIconWrapper}>
          <FontAwesome name="at" size={70} color="#00A8E8" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </View>
      </View>

      {/* Mensagem */}
      <Text style={styles.message}>
        Enviamos um link de recuperação para{' '}
        <Text style={styles.emailText}>{email || 'seu email'}</Text>
      </Text>

      {/* Loading Animado */}
      <View style={styles.loadingContainer}>
        <Animated.View 
          style={[
            styles.loadingCircle,
            { transform: [{ rotate: spin }] }
          ]}
        >
          <View style={styles.loadingInner}>
            <FontAwesome name="envelope-o" size={30} color="#00A8E8" />
          </View>
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.waitingText,
            { opacity: pulseAnim }
          ]}
        >
          Aguardando confirmação...
        </Animated.Text>
      </View>

      {/* Texto de reenvio */}
      <TouchableOpacity 
        onPress={handleResend}
        disabled={!canResend}
      >
        <Text style={styles.resendText}>
          Não recebeu o email?{' '}
          <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
            Reenviar ({countdown}s)
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Botão Enviar */}
      <View style={styles.buttonContainer}>
        <ButtonPoint
          label="Enviar"
          onPress={handleContinue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF0',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 32,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00A8E8',
    marginTop: 60,
    marginBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emailIconWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4E9F7',
    borderRadius: 60,
  },
  emailIcon: {
    width: 70,
    height: 70,
    tintColor: '#00A8E8',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF4D6D',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
    lineHeight: 20,
  },
  emailText: {
    color: '#00A8E8',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
    gap: 20,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#00A8E8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 16,
    color: '#00A8E8',
    fontWeight: '600',
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  resendLink: {
    color: '#00A8E8',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#999',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});

export default ConfirmacaoEmailScreen;
