import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { updateUserScore } from '../store/authSlice';
import { Audio } from 'expo-av'; // EKLEME: Ses kütüphanesi
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnimOption, setSelectedAnimOption] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15); 

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // --- SES FONKSİYONU ---
  const playSound = async (type) => {
    const soundFiles = {
      correct: require('../../../assets/images/sounds/correct.mp3'),
      wrong: require('../../../assets/images/sounds/wrong.wav'),
      click: require('../../../assets/images/sounds/click.wav'),
    };
    const { sound } = await Audio.Sound.createAsync(soundFiles[type]);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => { if (status.didJustFinish) sound.unloadAsync(); });
  };

  // --- ARKA PLAN MÜZİĞİ ---
  useEffect(() => {
    let bgInstance = new Audio.Sound();
    const setupBg = async () => {
      try {
        await bgInstance.loadAsync(require('../../../assets/images/sounds/bg_music.wav'));
        await bgInstance.setIsLoopingAsync(true);
        await bgInstance.setVolumeAsync(0.3);
        await bgInstance.playAsync();
      } catch (e) { console.log("Müzik Hatası"); }
    };
    setupBg();
    return () => { bgInstance.stopAsync(); bgInstance.unloadAsync(); };
  }, []);

  const translateX = useSharedValue(-width);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  useEffect(() => { fetchQuestions(currentLevel); }, [currentLevel]);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      translateX.value = -width;
      translateY.value = 0;
      opacity.value = 0;
      translateX.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1)) });
      opacity.value = withTiming(1, { duration: 400 });
    }
  }, [currentQuestionIndex, loading]);

  useEffect(() => {
    if (loading || questions.length === 0 || selectedAnimOption !== null) return;
    if (timeLeft === 0) { handleAnswer(null); return; }
    const timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, questions, selectedAnimOption]);

  const fetchQuestions = async (level) => { 
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.127.1:3000/questions?level=${level}`);
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestionIndex(0); 
      setLoading(false);
      setTimeLeft(15); 
    } catch (error) {
      Alert.alert("Hata", "Sorular yüklenemedi.");
      setLoading(false);
    }
  };

  const saveScoreToDB = async (finalScore) => {
    try {
      const response = await fetch('http://192.168.127.1:3000/auth/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, score: finalScore }),
      });
      if (response.ok) { dispatch(updateUserScore(finalScore)); }
    } catch (error) { console.log("Skor kaydedilemedi:", error); }
  };

  const handleAnswer = (selectedOption) => {
    if (selectedAnimOption !== null) return;

    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnimOption(selectedOption === null ? "TIMEOUT" : selectedOption);

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // --- SES TETİKLEME ---
    if (selectedOption === null || !isCorrect) { playSound('wrong'); }
    else { playSound('correct'); }

    let newScore = score;
    if (isCorrect) {
      newScore = score + 10;
      setScore(newScore);
      translateY.value = withDelay(500, withTiming(-width * 1.5, { duration: 600, easing: Easing.in(Easing.exp) }));
      opacity.value = withDelay(700, withTiming(0, { duration: 300 }));
    } else {
      translateX.value = withSequence(
        withTiming(-20, { duration: 50 }), withTiming(20, { duration: 50 }),
        withTiming(-20, { duration: 50 }), withTiming(20, { duration: 50 }), withTiming(0, { duration: 50 })
      );
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setSelectedAnimOption(null);
        setTimeLeft(15); 
        setCurrentQuestionIndex(prev => prev + 1);
      } 
      else {
        saveScoreToDB(newScore);
        Alert.alert("Level Tamamlandı!", `Seviye ${currentLevel} bitti. Puanın: ${newScore}`, [
          { text: "Sonraki Seviye", onPress: () => { setSelectedAnimOption(null); setCurrentLevel(prev => prev + 1); } },
          { text: "Ana Menü", onPress: () => navigation.navigate('MainMenu') }
        ]);
      }
    }, 1200);
  };

  if (loading) return (
    <LinearGradient colors={['#a07cf0', '#6772e5']} style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#fff" />
    </LinearGradient>
  );

  if (!loading && questions.length === 0) {
    return (
      <LinearGradient colors={['#a07cf0', '#6772e5', '#4e8cff']} style={styles.loaderContainer}>
        <View style={styles.questionCard}>
          <Text style={[styles.questionText, {fontWeight: 'bold', color: '#e94560'}]}>TEBRİKLER!</Text>
          <Text style={[styles.questionText, {marginTop: 10, fontSize: 16}]}>Yeni sorular yakında yüklenecektir!</Text>
        </View>
        <TouchableOpacity style={[styles.optionButton, {backgroundColor: '#fff', width: '80%'}]} onPress={() => navigation.navigate('MainMenu')}>
          <Text style={[styles.optionText, {textAlign: 'center', color: '#6772e5'}]}>Ana Menüye Dön</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const getOptionStyle = (opt) => {
    if (selectedAnimOption === null) return styles.optionButton;
    if (opt === currentQuestion?.correctAnswer) return [styles.optionButton, { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }];
    if (opt === selectedAnimOption && opt !== currentQuestion?.correctAnswer) return [styles.optionButton, { backgroundColor: '#f44336', borderColor: '#f44336' }];
    return styles.optionButton;
  };

  const getLetterStyle = (opt) => {
    if (selectedAnimOption !== null && (opt === currentQuestion?.correctAnswer || opt === selectedAnimOption)) {
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
        <View style={[styles.timerBadge, timeLeft <= 5 && {backgroundColor: '#e94560'}]}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
        <View style={styles.questionCounter}>
          <Text style={styles.counterText}>Lvl {currentLevel} - {currentQuestionIndex + 1}/{questions.length}</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion?.text}</Text>
          </View>
          <View style={styles.optionsContainer}>
            {['A', 'B', 'C', 'D'].map((opt) => (
              <TouchableOpacity 
                key={opt} 
                style={getOptionStyle(opt)} 
                onPress={() => {
                  playSound('click'); // EKLEME: Tıklama sesi
                  handleAnswer(opt);
                }}
                disabled={selectedAnimOption !== null}
              >
                <View style={getLetterStyle(opt)}>
                  <Text style={styles.optionLetterText}>{opt}</Text>
                </View>
                <Text style={[styles.optionText, selectedAnimOption !== null && (opt === currentQuestion?.correctAnswer || opt === selectedAnimOption) ? {color: '#fff'} : {}]}>
                  {currentQuestion?.[`option${opt}`]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  topInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  scoreBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, alignItems: 'center' },
  scoreLabel: { color: '#fff', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  scoreValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  timerBadge: { backgroundColor: 'rgba(0, 0, 0, 0.2)', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  timerText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  questionCounter: { backgroundColor: 'rgba(0, 0, 0, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  counterText: { color: '#fff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  animatedWrapper: { width: '100%' },
  questionCard: { backgroundColor: '#fff', padding: 30, borderRadius: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 30, minHeight: 150, justifyContent: 'center', width: '100%' },
  questionText: { fontSize: 20, textAlign: 'center', color: '#333', fontWeight: '600', lineHeight: 28 },
  optionsContainer: { gap: 15, width: '100%' },
  optionButton: { backgroundColor: 'rgba(255, 255, 255, 0.9)', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, borderWidth: 2, borderColor: 'transparent' },
  optionLetterContainer: { backgroundColor: '#6772e5', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  optionLetterText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  optionText: { color: '#444', fontSize: 16, fontWeight: '500', flex: 1 }
});