import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Hafta 1: Performans için memoization
  const handleRegister = useCallback(async () => {
    if (!username || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    
    try {
      // API isteği buraya gelecek (Back-end hazır olduğunda)
      console.log("Kayıt verisi:", username, password);
      Alert.alert("Başarılı", "Kayıt tamamlandı, giriş yapabilirsiniz.");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Hata", "Kayıt başarısız.");
    }
  }, [username, password]);

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Kullanıcı Adı" 
        style={styles.input} 
        onChangeText={setUsername} 
      />
      <TextInput 
        placeholder="Şifre" 
        secureTextEntry 
        style={styles.input} 
        onChangeText={setPassword} 
      />
      <Button title="Kayıt Ol" onPress={handleRegister} color="#4e8cff" />
      <Button title="Giriş Ekranına Dön" onPress={() => navigation.navigate('Login')} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 }
});