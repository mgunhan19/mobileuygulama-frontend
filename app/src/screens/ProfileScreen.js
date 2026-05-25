import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { updateUserEmail } from '../store/authSlice';
import { API_URL } from '../../../constants/config';
import * as ImagePicker from 'expo-image-picker'; // Fotoğraf seçmek için ekledik
import AsyncStorage from '@react-native-async-storage/async-storage'; // Fotoğrafı cihazda saklamak için

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  
  // E-Posta Doğrulama State'leri
  const [verifyCode, setVerifyCode] = useState('');
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Uygulama her açıldığında kaydedilen fotoğrafı yükle
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(`profile_image_${user?.id}`);
      if (savedImage) setProfileImage(savedImage);
    } catch (error) {
      console.log("Fotoğraf yüklenemedi", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni vermeniz gerekiyor.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem(`profile_image_${user?.id}`, imageUri);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.includes('@')) {
      Alert.alert("Geçersiz", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    setIsUpdatingEmail(true);
    try {
      const response = await fetch(`${API_URL}/auth/add-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, email: newEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setShowEmailVerify(true); // Direkt değiştirmek yerine onay kodunu sor
        Alert.alert("Doğrulama Kodu Gönderildi", "Lütfen e-postanıza gelen 6 haneli kodu girin.");
      } else {
        Alert.alert("Hata", data.message || "E-posta güncellenemedi.");
      }
    } catch (e) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verifyCode) {
      Alert.alert("Geçersiz", "Lütfen onay kodunu girin.");
      return;
    }
    setIsVerifyingEmail(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, code: verifyCode })
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateUserEmail(newEmail));
        setShowEmailVerify(false);
        setVerifyCode('');
        Alert.alert("Başarılı", "E-posta adresiniz doğrulandı ve kaydedildi!");
      } else {
        Alert.alert("Hata", data.message || "Onay kodu hatalı.");
      }
    } catch (e) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>PROFİL</Text>
      </View>

      <View style={styles.profileCard}>
        {/* PROFİL FOTOĞRAFI SEÇME ALANI */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={{fontSize: 50}}>👤</Text>
              <Text style={styles.addText}>Ekle</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <Text style={styles.value}>{user?.username || 'Oyuncu'}</Text>
          
          <View style={styles.divider} />

          <Text style={styles.label}>E-Posta</Text>
          <View style={styles.emailContainer}>
            <TextInput
              style={styles.emailInput}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="E-posta ekle/değiştir"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!showEmailVerify}
            />
            <TouchableOpacity style={styles.emailSaveBtn} onPress={handleUpdateEmail} disabled={isUpdatingEmail || showEmailVerify}>
              {isUpdatingEmail ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.emailSaveText}>Kod Gönder</Text>}
            </TouchableOpacity>
          </View>

          {showEmailVerify && (
            <View style={styles.emailContainer}>
              <TextInput
                style={[styles.emailInput, { backgroundColor: '#eef2ff', borderColor: '#6772e5', borderWidth: 1 }]}
                value={verifyCode}
                onChangeText={setVerifyCode}
                placeholder="6 Haneli Kodu Girin"
                keyboardType="numeric"
              />
              <TouchableOpacity style={[styles.emailSaveBtn, { backgroundColor: '#6772e5' }]} onPress={handleVerifyEmail} disabled={isVerifyingEmail}>
                {isVerifyingEmail ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.emailSaveText}>Onayla</Text>}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />

          {/* EN YÜKSEK SKOR GÖSTERİMİ */}
          <View style={styles.scoreBox}>
            <Text style={styles.label}>En Yüksek Skor</Text>
            <Text style={styles.highScoreValue}>{user?.score || 0}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>ANA MENÜYE DÖN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Bildin Bildin v1.1 | Mehmet Günhan</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerContainer: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  profileCard: { 
    width: '85%', 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center',
    elevation: 15,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#6772e5',
    overflow: 'hidden'
  },
  avatarImage: { width: '100%', height: '100%' },
  placeholderAvatar: { alignItems: 'center' },
  addText: { fontSize: 10, color: '#6772e5', fontWeight: 'bold' },
  infoSection: { width: '100%', marginBottom: 20 },
  label: { fontSize: 12, color: '#aaa', fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 18, color: '#333', fontWeight: '600', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 12 },
  scoreBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  highScoreValue: { fontSize: 32, color: '#4CAF50', fontWeight: '900' },
  backButton: {
    backgroundColor: '#6772e5',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  footerText: { position: 'absolute', bottom: 20, color: '#fff', opacity: 0.6 },
  emailContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  emailInput: { flex: 1, backgroundColor: '#f0f2f5', padding: 10, borderRadius: 8, marginRight: 10, color: '#333' },
  emailSaveBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, justifyContent: 'center', minWidth: 70, alignItems: 'center' },
  emailSaveText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});