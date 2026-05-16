# 🎮 Bildin Bildin - Mobil Bilgi Yarışması Oyunu

**Bildin Bildin**, Starklar Game tarafından geliştirilen, kullanıcıların zamana karşı yarıştığı, dinamik animasyonlar ve ses efektleriyle zenginleştirilmiş modern bir mobil bilgi yarışması oyunudur. Proje, full-stack (React Native & NestJS) bir mimariye sahiptir.

---

## 🚀 Özellikler

* **Dinamik Seviye (Level) Sistemi:** Kullanıcılar her seviyede farklı zorlukta sorularla karşılaşır. Seviye tamamlandığında skorları güncellenir.
* **Zamana Karşı Yarış:** Her soru için oyuncunun 15 saniyesi vardır. Süre bittiğinde otomatik olarak yanlış cevap sayılır.
* **Game Feel & Akıcı Animasyonlar (`React-Native-Reanimated`):** * Sorular ekrana soldan hızla kayarak girer.
    * Doğru cevap verildiğinde soru kartı yeşil olur ve geri dönüt vermiş olur.
    * Yanlış cevapta kart iki yana sallanarak (Shake efekti) kullanıcıya geri bildirim verir.
* **Ses Efektleri (`Expo-AV`):** Doğru/yanlış cevap tınıları ve oyun içi arka plan müziği ile zenginleştirilmiş ses tasarımı.
* **Merkezi State Yönetimi (`Redux Toolkit`):** Kullanıcı giriş durumu ve skor bilgileri yerel hafızada anlık olarak senkronize edilir, profil sayfasında anında güncellenir.
* **Canlı Liderlik Tablosu (Leaderboard):** Tüm oyuncuların `highScore` (en yüksek skor) verilerini veri tabanından çekerek ilk 10 oyuncuyu sıralar.

---

## 🛠️ Kullanılan Teknolojiler

### Frontend (Mobil Uygulama)
* **React Native** & **Expo**
* **Redux Toolkit** (State Yönetimi)
* **React Navigation** (Stack Navigator)
* **React Native Reanimated v3** (Performanslı Animasyonlar)
* **Expo AV** (Ses Yönetimi)
* **Expo Linear Gradient** (Görsel Tasarım)

### Backend (API & Veri Tabanı)
* **NestJS** (Node.js Framework)
* **TypeORM** (Veri Tabanı ORM)
* **PostgreSQL** & **pgAdmin 4** (İlişkisel Veri Tabanı)

---

## 📂 Proje Yapısı

### Backend (NestJS)
```text
src/
├── auth/
│   └── (Giriş/Kayıt servisleri)
├── user/
│   ├── user.controller.ts  # Leaderboard, Profile, Score API uçları
│   ├── user.service.ts     # SQL sorguları ve skor güncelleme mantığı
│   ├── user.entity.ts      # PostgreSQL Kullanıcı Tablosu Yapısı
│   └── questions/          # Soru yönetim modülü
└── main.ts
Frontend (React Native)
Plaintext
src/
├── assets/sounds/         # bg_music, correct, wrong ses dosyaları
├── navigation/
│   └── AppNavigator.js    # Ekran geçiş rotaları
├── store/
│   └── authSlice.js       # Global kullanıcı ve skor state'i
└── screens/
    ├── MainMenu.js        # Ana Menü
    ├── GameScreen.js      # Oyun Ekranı ve Animasyonlar
    ├── ProfileScreen.js   # Kullanıcı Profil Sayfası
    └── LeaderboardScreen.js # Canlı Skor Tablosu

👥 Geliştiriciler
Starklar Game Team

Mehmet Günhan

⭐ Bu projeyi beğendiyseniz yıldız (star) vermeyi unutmayın!
