import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_URL } from '../../../constants/config';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(async () => {
    
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setIsLoading(true);

    try {

      const apiUrl = `${API_URL}/auth/register`; 
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const textData = await response.text(); 
      const data = textData ? JSON.parse(textData) : {};

      if (response.ok) {
        Alert.alert("Başarılı", "Kayıt tamamlandı!");
        navigation.navigate('Login');
      } else {
        Alert.alert("Hata", data.message || "Kayıt yapılamadı.");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        Alert.alert("Zaman Aşımı", "Sunucu şu an uyanıyor olabilir, lütfen birazdan tekrar deneyin.");
      } else {
        Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, navigation]);

  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>YENİ HESAP</Text>
          <Text style={styles.subtitle}>Bildin Bildin dünyasına katıl!</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput 
            placeholder="Kullanıcı Adı" 
            placeholderTextColor="#666"
            style={styles.input} 
            onChangeText={setUsername} 
            value={username}
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Şifre" 
            placeholderTextColor="#666"
            secureTextEntry 
            style={styles.input} 
            onChangeText={setPassword} 
            value={password}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.customRegisterButton, isLoading && {opacity: 0.7}]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>KAYIT OL</Text>
              )}
            </TouchableOpacity>
            
            <View style={{ height: 15 }} />
            
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginBackText}>
                Zaten hesabın var mı? <Text style={styles.loginBackLink}>Giriş Yap</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {alignItems: 'center', marginBottom: 40},
  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    textAlign: 'center', 
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {fontSize: 16, color: '#fff', marginTop: 10, opacity: 0.9},
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 25,
    borderRadius: 25,
    marginHorizontal: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  input: { 
    backgroundColor: '#f0f2f5', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    color: '#333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8'
  },
  buttonContainer: {marginTop: 10},
  customRegisterButton: {
    backgroundColor: '#4e8cff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  loginBackText: {color: '#444', textAlign: 'center'},
  loginBackLink: {color: '#4e8cff', fontWeight: 'bold'}
});