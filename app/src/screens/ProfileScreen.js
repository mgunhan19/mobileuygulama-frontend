import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'; // Fotoğraf seçmek için ekledik
import AsyncStorage from '@react-native-async-storage/async-storage'; // Fotoğrafı cihazda saklamak için

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.auth.user);
  const [profileImage, setProfileImage] = useState(null);

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
    // Galeriden izin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni vermeniz gerekiyor.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Kare şeklinde kesme
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      // Fotoğrafı cihaza kalıcı olarak kaydet (sen değiştirene kadar durur)
      await AsyncStorage.setItem(`profile_image_${user?.id}`, imageUri);
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

          <Text style={styles.label}>Öğrenci No</Text>
          <Text style={styles.value}>23020021049</Text> 

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
    alignItems: 'center'
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  footerText: { position: 'absolute', bottom: 20, color: '#fff', opacity: 0.6 }
});