import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LeaderboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Kendi bilgisayarının yerel IP adresini buraya yazmalısın
      const response = await fetch('http://192.168.127.1:3000/auth/leaderboard');
      const json = await response.json();
      
      // Backend'den gelen veriyi state'e atıyoruz
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error("Liderlik tablosu hatası:", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.rankItem}>
      {/* Sıralama Numarası */}
      <View style={[styles.rankNumberContainer, index < 3 && styles.topThreeBackground]}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      
      {/* Kullanıcı Adı */}
      <Text style={styles.username}>{item.username}</Text>
      
      {/* KRİTİK NOKTA: Burası backend'deki user.entity içindeki isimle (highScore) aynı olmalı */}
      <Text style={styles.scoreText}>{item.highScore ?? 0} Puan</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>LİDERLİK TABLOSU</Text>
      </View>

      <View style={styles.listCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#6772e5" />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Henüz kayıtlı skor bulunamadı.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Geri Dön Butonu */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>ANA MENÜYE DÖN</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  headerContainer: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  listCard: { 
    width: '90%', 
    height: '65%',
    backgroundColor: '#fff', 
    borderRadius: 30, 
    padding: 20, 
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  rankItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  rankNumberContainer: { 
    width: 35, 
    height: 35, 
    borderRadius: 10, 
    backgroundColor: '#6772e5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  topThreeBackground: { backgroundColor: '#FFB74D' }, // İlk 3 kişi için farklı renk
  rankNumber: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  username: { flex: 1, fontSize: 17, color: '#333', fontWeight: '600' },
  scoreText: { fontSize: 17, color: '#4CAF50', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#aaa', fontSize: 16 },
  backButton: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff'
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});