import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnimOption, setSelectedAnimOption] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1); // Level takibi için eklendi

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchQuestions(currentLevel); // Level'e göre soru çek
  }, [currentLevel]); // Level her değiştiğinde soruları yenile

  const fetchQuestions = async (level) => { 
    try {
      setLoading(true);
      // URL'ye level parametresi eklendi
      const response = await fetch(`http://192.168.127.1:3000/questions?level=${level}`);
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Hata", "Sorular yüklenemedi.");
      setLoading(false);
    }
  };

  const saveScoreToDB = async (finalScore) => {
    try {
      await fetch('http://192.168.127.1:3000/auth/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, score: finalScore }),
      });
      console.log("Skor başarıyla veri tabanına yazıldı.");
    } catch (error) {
      console.log("Skor kaydedilemedi:", error);
    }
  };

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    let newScore = score;

    setSelectedAnimOption(selectedOption);

    if (isCorrect) {
      newScore = score + 10;
      setScore(newScore);
    }

    setTimeout(() => {
      setSelectedAnimOption(null);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // MEKANİZMA: Eğer seviyedeki tüm sorular bittiyse ve başarılıysa level atlat
        Alert.alert(
          "Level Tamamlandı!", 
          `Puanın: ${newScore}. Bir sonraki seviyeye geçmek ister misin?`, 
          [
            { 
              text: "Sonraki Seviye", 
              onPress: () => {
                setCurrentLevel(currentLevel + 1);
                setCurrentQuestionIndex(0);
                saveScoreToDB(newScore);
              } 
            },
            { 
              text: "Çıkış", 
              onPress: () => {
                saveScoreToDB(newScore);
                navigation.navigate('MainMenu');
              } 
            }
          ]
        );
      }
    }, 600);
  };

  if (loading) return (
    <LinearGradient colors={['#a07cf0', '#6772e5']} style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{color: '#fff', marginTop: 10}}>Seviye {currentLevel} Soruları Yükleniyor...</Text>
    </LinearGradient>
  );

  if (questions.length === 0) return (
    <LinearGradient colors={['#a07cf0', '#6772e5']} style={styles.loaderContainer}>
      <Text style={{color: '#fff'}}>Bu seviyede soru bulunamadı.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('MainMenu')} style={{marginTop: 20}}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Geri Dön</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionStyle = (opt) => {
    if (selectedAnimOption === null) return styles.optionButton;
    if (opt === currentQuestion.correctAnswer) return [styles.optionButton, { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }];
    if (opt === selectedAnimOption && opt !== currentQuestion.correctAnswer) return [styles.optionButton, { backgroundColor: '#f44336', borderColor: '#f44336' }];
    return styles.optionButton;
  };

  const getLetterStyle = (opt) => {
      if (selectedAnimOption !== null && (opt === currentQuestion.correctAnswer || opt === selectedAnimOption)) {
          return [styles.optionLetterContainer, { backgroundColor: 'rgba(255,255,255,0.3)' }];
      }
      return styles.optionLetterContainer;
  }

  return (
    <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>PUAN</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.questionCounter}>
          {/* Level Bilgisi eklendi */}
          <Text style={styles.counterText}>Seviye {currentLevel} - Soru {currentQuestionIndex + 1}/{questions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <TouchableOpacity 
              key={opt} 
              style={getOptionStyle(opt)} 
              onPress={() => handleAnswer(opt)}
              disabled={selectedAnimOption !== null}
            >
              <View style={getLetterStyle(opt)}>
                <Text style={styles.optionLetterText}>{opt}</Text>
              </View>
              <Text style={[styles.optionText, selectedAnimOption !== null && (opt === currentQuestion.correctAnswer || opt === selectedAnimOption) ? {color: '#fff'} : {}]}>
                {currentQuestion[`option${opt}`]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  scoreBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, alignItems: 'center' },
  scoreLabel: { color: '#fff', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  scoreValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  questionCounter: { backgroundColor: 'rgba(0, 0, 0, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  counterText: { color: '#fff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  questionCard: { backgroundColor: '#fff', padding: 30, borderRadius: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 30, minHeight: 150, justifyContent: 'center' },
  questionText: { fontSize: 20, textAlign: 'center', color: '#333', fontWeight: '600', lineHeight: 28 },
  optionsContainer: { gap: 15 },
  optionButton: { backgroundColor: 'rgba(255, 255, 255, 0.9)', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, borderWidth: 2, borderColor: 'transparent' },
  optionLetterContainer: { backgroundColor: '#6772e5', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionLetterText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  optionText: { color: '#444', fontSize: 16, fontWeight: '500', flex: 1 }
});