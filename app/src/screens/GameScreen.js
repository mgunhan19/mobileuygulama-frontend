import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

export default function GameScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Redux'tan giriş yapmış olan kullanıcıyı alıyoruz
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      
      const response = await fetch('http://192.168.127.1:3000/questions');
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

    if (isCorrect) {
      newScore = score + 10;
      setScore(newScore);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Oyun bitti, skoru gönder
      saveScoreToDB(newScore);
      Alert.alert("Oyun Bitti", `Toplam Puanın: ${newScore}`, [
        { text: "Ana Menüye Dön", onPress: () => navigation.navigate('MainMenu') }
      ]);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4e8cff" style={{ flex: 1 }} />;
  if (questions.length === 0) return <Text>Soru bulunamadı.</Text>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Puan: {score}</Text>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {['A', 'B', 'C', 'D'].map((opt) => (
          <TouchableOpacity key={opt} style={styles.optionButton} onPress={() => handleAnswer(opt)}>
            <Text style={styles.optionText}>{currentQuestion[`option${opt}`]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7', justifyContent: 'center' },
  scoreText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#4CAF50' },
  questionCard: { backgroundColor: 'white', padding: 30, borderRadius: 15, elevation: 5, marginBottom: 20 },
  questionText: { fontSize: 18, textAlign: 'center' },
  optionsContainer: { gap: 10 },
  optionButton: { backgroundColor: '#4e8cff', padding: 15, borderRadius: 10, alignItems: 'center' },
  optionText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});