# 🚀 Emoji-Tabanlı ve NLP Destekli Güvenli Şifre Üretim Sistemi

Bu proje, **doğal dil işleme (NLP)** ve **anlamsal emoji eşleştirme** kullanarak güvenli ve hatırlaması kolay şifreler üretmeyi amaçlayan bir sistemdir.  
Kullanıcı cümleleri analiz edilerek **özne, fiil ve nesne** belirlenir ve her bileşene semantik olarak uygun **emojiler** atanır.  
Ayrıca klasik karakter setleriyle (harfler, sayılar, semboller) **emojisiz şifre** üretme özelliği de mevcuttur.

---

## 📜 Özellikler

- **NLP ile Gramer Analizi** – Cümledeki özne, fiil ve nesneyi tespit eder.
- **Anlamsal Emoji Eşleştirme** – Tespit edilen bileşenlere ilgili emojileri ekler.
- **Klasik Şifre Desteği** – Harf, rakam ve sembollerden oluşan güçlü şifreler üretir.
- **Rastgelelik Testleri**
  - Monobit Testi
  - Runs Testi
  - Cumulative Sums Testi
  - Serial Test
- **Brute-force Dayanıklılık Analizi** – Tahmini kırılma süresini hesaplar.
- **Web Arayüzü** – Flask tabanlı API ile tarayıcı üzerinden erişim.
- **Alternatif Öneriler** – Hem emoji destekli hem de klasik şifre önerileri sunar.

---

## 📂 Proje Yapısı

```
├── backend.py                               # Ana API ve şifre üretim mantığı
├── bruteforce.py                            # Brute-force saldırı simülasyonu
├── bruteforce_best_guess.py                 # Brute-force en yakın tahmin analizi
├── emoji-categories.md                      # Emoji kategori listesi
├── emojis.json                              # Temel emoji ve eş anlamlı veri seti
├── tum_emoji_categories_synonyms_cleaned2.json # Temizlenmiş emoji veri seti
├── tum_emoji_categories_updated.json        # Güncellenmiş emoji veri seti
├── ConferencePaper_...pdf                   # Akademik bildiri
├── Report_...pdf                            # Proje raporu
```

---

## 🛠 Kurulum

### 1️⃣ Depoyu Klonla
```bash
git clone https://github.com/KULLANICI_ADI/REPO_ADI.git
cd REPO_ADI
```

### 2️⃣ Gerekli Kütüphaneleri Kur
```bash
pip install -r requirements.txt
pip install flask flask-cors spacy nltk rapidfuzz regex
python -m spacy download en_core_web_sm
```

---

## 🔌 API Kullanımı

### İstek
```http
POST /generate-password
Content-Type: application/json
```
```json
{
    "text": "The cat eats fish",
    "length": 12,
    "use_emojis": true
}
```

### Yanıt
```json
{
    "password": "🐱🍽🐟X7@aB",
    "randomness_tests": {
        "monobit": "Passed",
        "runs": "Passed"
    },
    "bruteforce_time": "2.5 years"
}
```

---

## 📊 Testler

- **Monobit Testi** – 1 ve 0 bitlerinin dağılımını kontrol eder.
- **Runs Testi** – Bit dizilerinde ardışık tekrarların dengesini ölçer.
- **Cumulative Sums ve Serial Testleri** – Şifrenin rastgelelik seviyesini analiz eder.
- **Brute-force Simülasyonu** – Şifrenin tahmini kırılma süresini hesaplar.

---

## 📄 Lisans
Bu proje **MIT lisansı** ile lisanslanmıştır.

---

## 👩‍💻 Yazarlar

- Hayal İldeniz İnanç  
- Özge Küçükbayram  
- Bilge Demir  

---

## 🗺️ Sistem Mimarisi
```mermaid
flowchart LR
    A[👩‍💻 Kullanıcı / Web UI] -->|İstek (metin, uzunluk, seçenekler)| B[🌐 Flask API]
    subgraph S[NLP & Şifre Üretim Çekirdeği]
      B --> C[🧠 NLP (spaCy)\nÖzne-Fiil-Nesne çıkarımı]
      C --> D[🔎 Anlamsal Eşleştirme\n(emoji sözlüğü + eş anlamlılar)]
      D --> E[🔐 Şifre Üretici\n(emoji + klasik karakterler)]
      E --> F[🎲 Rastgelelik Testleri\nMonobit • Runs • CumSums • Serial]
      E --> G[🛡️ Brute-force Simülasyonu\n(süre/deneme tahmini)]
    end
    F --> H[📤 Yanıt]
    G --> H
    H -->|JSON| A
```
