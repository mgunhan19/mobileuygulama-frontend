import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = useCallback(async () => {
    console.log("Kayıt denemesi başlatıldı:", username); // Butonun çalıştığını buradan anlarız

    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // DİKKAT: Buradaki IP'nin bilgisayarının IPv4 adresiyle AYNI olduğundan emin ol!
      const apiUrl = 'http://192.168.127.1:3000/auth/register'; 
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // Hafta 1: Hata yönetimi
      const textData = await response.text(); 
      const data = textData ? JSON.parse(textData) : {};

      if (response.ok) {
        Alert.alert("Başarılı", "Kayıt tamamlandı!");
        navigation.navigate('Login'); // Hafta 6: Navigasyon
      } else {
        Alert.alert("Hata", data.message || "Kayıt yapılamadı.");
      }
    } catch (error) {
      console.log("Detaylı Bağlantı Hatası:", error);
      Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamıyor. IP adresini ve Nest.js sunucunu kontrol et.");
    }
  }, [username, password, navigation]);

  return (
   <View style={styles.container}>
    <TextInput 
      placeholder="Kullanıcı Adı" 
      style={styles.input} 
      onChangeText={setUsername} 
      value={username}
    />
    <TextInput 
      placeholder="Şifre" 
      secureTextEntry 
      style={styles.input} 
      onChangeText={setPassword} 
      value={password}
    />
   
    <View style={{ gap: 10 }}>
      <Button title="Kayıt Ol" onPress={handleRegister} color="#4e8cff" />
      <Button 
        title="Giriş Ekranına Dön" 
        onPress={() => navigation.navigate('Login')} 
        color="gray" 
      />
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 }
});