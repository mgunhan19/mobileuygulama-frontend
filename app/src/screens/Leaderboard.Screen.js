import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LeaderboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Backend IP adresini kendi yerel IP'n ile güncellemeyi unutma
      const response = await fetch('http://192.168.127.1:3000/auth/leaderboard');
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error("Liderlik tablosu çekilemedi:", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.rankItem}>
      <View style={[styles.rankNumberContainer, index < 3 && { backgroundColor: '#FFD700' }]}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.scoreText}>{item.score} Puan</Text>
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
            ListEmptyComponent={<Text style={styles.emptyText}>Henüz skor bulunamadı.</Text>}
          />
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>GERİ DÖN</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  rankNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6772e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  rankNumber: { color: '#fff', fontWeight: 'bold' },
  username: { flex: 1, fontSize: 16, color: '#333', fontWeight: '600' },
  scoreText: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#aaa' },
  backButton: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff'
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' }
});v