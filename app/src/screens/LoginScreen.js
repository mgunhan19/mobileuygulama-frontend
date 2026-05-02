import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/authSlice'; // Hafta 2: Redux aksiyonu

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  // Hafta 1: Performans için memoization
  const handleLogin = useCallback(async () => {
  try {
    // Kendi IP adresini buraya yazmayı unutma
    const apiUrl = 'http://192.168.127.1:3000/auth/login'; 
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      //  Giriş yapan kullanıcıyı Redux'a kaydediyoruz
      dispatch(loginAction(data)); 
      
      Alert.alert("Başarılı", "Hoş geldin " + username);
      // navigation.navigate('MainMenu'); // Ana menü hazır olduğunda burayı açacağız
      navigation.navigate('MainMenu'); // Yönlendirme
    } else {
      Alert.alert("Hata", data.message || "Giriş bilgileri hatalı.");
    }
  } catch (error) {
    console.log("Giriş Hatası:", error);
    Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor.");
  }
}, [username, password, navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildin Bildin'e Giriş Yap</Text>
      
      <TextInput 
        placeholder="Kullanıcı Adı" 
        style={styles.input} 
        onChangeText={setUsername} 
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Şifre" 
        secureTextEntry 
        style={styles.input} 
        onChangeText={setPassword} 
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Giriş Yap" onPress={handleLogin} color="#4CAF50" />
        <View style={{ marginVertical: 5 }} />
        <Button 
          title="Hesabın Yok mu? Kayıt Ol" 
          onPress={() => navigation.navigate('Register')} 
          color="#2196F3" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  buttonContainer: { marginTop: 10 }
});