import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction, updateUserLevel } from '../store/authSlice'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av'; 
import { API_URL } from '../../../constants/config';

export default function MainMenu({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // EKLEME: Tıklama sesi fonksiyonu
  const playClick = async () => {
    try {
      // Ses dosyası yolunun doğruluğundan emin ol (../../../assets/images/sounds/click.wav)
      const { sound } = await Audio.Sound.createAsync(require('../../../assets/images/sounds/click.wav'));
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => { if (status.didJustFinish) sound.unloadAsync(); });
    } catch (error) {
      console.log("Ses çalma hatası:", error);
    }
  };

  const handleLogout = () => {
    playClick(); 
    dispatch(logoutAction());
    navigation.navigate('Login'); 
  };

  const handleResetLevel = () => {
    playClick();
    Alert.alert(
      "Seviyeyi Sıfırla",
      "Oyun seviyeniz 1'e dönecek. Emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sıfırla", 
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/auth/reset-level`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
              });
              if (response.ok) {
                dispatch(updateUserLevel(1));
                Alert.alert("Başarılı", "Seviyeniz 1'e sıfırlandı!");
              }
            } catch (error) {
              console.log("Seviye sıfırlama hatası:", error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Hoş Geldin,</Text>
        <Text style={styles.usernameText}>{user?.username || 'Oyuncu'}!</Text>
      </View>

      <View style={styles.menuCard}>
        {/* ANA AKSİYON BUTONU (AYRI DURUYOR) */}
        <TouchableOpacity 
          style={styles.mainActionButton} 
          onPress={() => { playClick(); navigation.navigate('Game'); }} 
        >
          <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.buttonGradient}>
            <Text style={styles.mainButtonText}>OYUNU BAŞLAT</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* AYIRICI ÇİZGİ VEYA BOŞLUK */}
        <View style={styles.spacer} />

        {/* YARDIMCI BUTONLAR GRUBU */}
        <View style={styles.secondaryButtonGroup}>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => { playClick(); navigation.navigate('Profile'); }} 
          >
            <LinearGradient colors={['#6772e5', '#5469d4']} style={styles.buttonGradient}>
              <Text style={styles.secondaryButtonText}>PROFİLİM</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* GÜNCELLENEN KISIM: Skor Tablosu artık Leaderboard sayfasına yönlendiriyor */}
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => { playClick(); navigation.navigate('Leaderboard'); }}
          >
            <LinearGradient colors={['#FFB74D', '#FFA726']} style={styles.buttonGradient}>
              <Text style={styles.secondaryButtonText}>SKOR TABLOSU</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleResetLevel}
          >
            <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.buttonGradient}>
              <Text style={styles.secondaryButtonText}>SEVİYEYİ SIFIRLA</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleLogout}
          >
            <LinearGradient colors={['#EF5350', '#E53935']} style={styles.buttonGradient}>
              <Text style={styles.secondaryButtonText}>ÇIKIŞ YAP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.footerText}>Bildin Bildin /STARKLAR GAME</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  welcomeText: { fontSize: 20, color: '#fff', opacity: 0.9 },
  usernameText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff', 
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  menuCard: {
    width: '90%',
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Şeffaf kart yapısı
    alignItems: 'center',
  },
  spacer: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginVertical: 20,
    borderRadius: 1
  },
  mainActionButton: { 
    width: '100%', 
    borderRadius: 18, 
    overflow: 'hidden', 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  secondaryButtonGroup: {
    width: '100%',
    gap: 12
  },
  secondaryButton: { 
    width: '100%', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 5 
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  mainButtonText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  secondaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: {
    position: 'absolute',
    bottom: 30,
    color: '#fff',
    opacity: 0.6,
    fontSize: 12
  }
});