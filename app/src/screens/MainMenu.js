import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../store/authSlice'; 
import { LinearGradient } from 'expo-linear-gradient'; 

export default function MainMenu({ navigation }) 
{
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigation.navigate('Login'); 
  };
  
  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Hoş Geldin,</Text>
        <Text style={styles.usernameText}>{user?.username || 'Oyuncu'}!</Text>
      </View>

      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Game')}>
          <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>OYUNU BAŞLAT</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => Alert.alert("Bilgi", "Liderlik tablosu hazırlanıyor.")}
        >
          <LinearGradient colors={['#FFB74D', '#FFA726']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>SKOR TABLOSU</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <LinearGradient colors={['#EF5350', '#E53935']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>ÇIKIŞ YAP</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>Bildin Bildin v1.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerContainer: {alignItems: 'center', marginBottom: 50},
  welcomeText: {fontSize: 20, color: '#fff', opacity: 0.9},
  usernameText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff', 
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  menuCard:
  {
    width: '90%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',// Arka plana uyumlu şeffaf açık kart
    alignItems: 'center',
  },
  menuButton:
  { 
    width: '100%', 
    marginBottom: 15, 
    borderRadius: 15, 
    overflow: 'hidden', 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  buttonGradient:
  {
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1},
  footerText: {
    position: 'absolute',
    bottom: 30,
    color: '#fff',
    opacity: 0.6,
    fontSize: 12
  }
});