import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_URL } from '../../../constants/config';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: E-posta gir, 2: Kod ve Yeni Şifre gir
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Başarılı", "Sıfırlama kodu e-postanıza gönderildi.");
        setStep(2);
      } else {
        Alert.alert("Hata", data.message || "Kod gönderilemedi.");
      }
    } catch (e) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.");
        navigation.navigate('Login');
      } else {
        Alert.alert("Hata", data.message || "Şifre sıfırlanamadı.");
      }
    } catch (e) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>ŞİFRE SIFIRLAMA</Text>
          <Text style={styles.subtitle}>
            {step === 1 ? 'Kayıtlı e-posta adresinizi girin' : 'E-postanıza gelen kodu girin'}
          </Text>
        </View>

        <View style={styles.inputCard}>
          {step === 1 ? (
            <>
              <TextInput 
                placeholder="E-posta Adresi" 
                placeholderTextColor="#666"
                style={styles.input} 
                onChangeText={setEmail} 
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity 
                style={[styles.customButton, isLoading && {opacity: 0.7}]} 
                onPress={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>KOD GÖNDER</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput 
                placeholder="6 Haneli Onay Kodu" 
                placeholderTextColor="#666"
                style={styles.input} 
                onChangeText={setCode} 
                value={code}
                keyboardType="numeric"
              />
              <TextInput 
                placeholder="Yeni Şifre" 
                placeholderTextColor="#666"
                secureTextEntry 
                style={styles.input} 
                onChangeText={setNewPassword} 
                value={newPassword}
              />
              <TouchableOpacity 
                style={[styles.customButton, isLoading && {opacity: 0.7}]} 
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ŞİFREYİ GÜNCELLE</Text>}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backText}>Giriş Ekranına Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {alignItems: 'center', marginBottom: 40},
  title: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: 2 },
  subtitle: {fontSize: 14, color: '#fff', marginTop: 10, opacity: 0.9},
  inputCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 25, borderRadius: 25, marginHorizontal: 20, elevation: 15 },
  input: { backgroundColor: '#f0f2f5', padding: 15, borderRadius: 12, marginBottom: 15, color: '#333', fontSize: 16, borderWidth: 1, borderColor: '#e1e4e8' },
  customButton: { backgroundColor: '#4e8cff', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 5 },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  backText: {color: '#444', textAlign: 'center', fontWeight: 'bold'}
});
