import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../store/authSlice'; // Hafta 2: Redux Çıkış işlemi

export default function MainMenu({ navigation }) {
  // Hafta 2: Redux'tan giriş yapan kullanıcının adını alıyoruz
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigation.navigate('Login'); // Hafta 6: Navigasyon
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş Geldin, {user?.username || 'Oyuncu'}!</Text>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => Alert.alert("Bilgi", "Oyun yakında başlıyor!")}
      >
        <Text style={styles.buttonText}>OYUNU BAŞLAT</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.menuButton, { backgroundColor: '#FF9800' }]} 
        onPress={() => Alert.alert("Bilgi", "Liderlik tablosu hazırlanıyor.")}
      >
        <Text style={styles.buttonText}>SKOR TABLOSU</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.menuButton, { backgroundColor: '#f44336' }]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>ÇIKIŞ YAP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f7' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  menuButton: { 
    width: '80%', 
    padding: 15, 
    backgroundColor: '#4CAF50', 
    borderRadius: 10, 
    marginBottom: 15, 
    alignItems: 'center' 
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});