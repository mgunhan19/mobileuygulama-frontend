import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_URL } from '../../../constants/config';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/authSlice';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${API_URL}/auth/login`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok) {
        dispatch(loginAction(data));
        Alert.alert("Başarılı", "Hoş geldin " + username);
        navigation.navigate('MainMenu');
      } else {
        Alert.alert("Hata", data.message || "Giriş bilgileri hatalı.");
      }
    } catch (error) {
      console.log("Giriş Hatası:", error);
      if (error.name === 'AbortError') {
        Alert.alert("Zaman Aşımı", "Sunucu şu an uyanıyor olabilir, lütfen birazdan tekrar deneyin.");
      } else {
        Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, navigation, dispatch]);

  return (
    <LinearGradient colors={['#4e8cff', '#6772e5', '#a07cf0']} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>BİLDİN BİLDİN</Text>
          <Text style={styles.subtitle}>Bilgine güveniyorsan içeri gel!</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            placeholder="Kullanıcı Adı"
            placeholderTextColor="#666"
            style={styles.input}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Şifre"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.customLoginButton, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>GİRİŞ YAP</Text>
              )}
            </TouchableOpacity>

            <View style={{ marginVertical: 10 }} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Hesabın Yok mu? <Text style={styles.registerLink}>Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create(
  {
    container: { flex: 1 },
    headerContainer: { alignItems: 'center', marginBottom: 40 },
    title:
    {
      fontSize: 36,
      fontWeight: '900',
      textAlign: 'center',
      color: '#fff',
      letterSpacing: 2,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 5,
    },
    subtitle: { fontSize: 16, color: '#fff', marginTop: 10, opacity: 0.9 },
    inputCard:
    {
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Daha şeffaf ve açık kart
      padding: 25,
      borderRadius: 25,
      marginHorizontal: 20,
      elevation: 15,
    },
    input:
    {
      backgroundColor: '#f0f2f5',
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      color: '#333',
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#e1e4e8'
    },
    buttonContainer: { marginTop: 10 },
    customLoginButton: {
      backgroundColor: '#6772e5',
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#6772e5',
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 5
    },
    loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    registerText: { color: '#444', textAlign: 'center' },
    registerLink: { color: '#6772e5', fontWeight: 'bold' }
  });