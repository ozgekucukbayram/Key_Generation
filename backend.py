from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
from nltk.stem import PorterStemmer
import os
from rapidfuzz import process
import spacy
import hashlib
import math

app = Flask(__name__)
CORS(app)
# spaCy model yükleme
nlp = spacy.load("en_core_web_sm")

# JSON dosya yolu
json_file_path = r"C:\Users\ozgek\OneDrive\Desktop\emojigenerator.py\emojis.json"

# Emoji sözlüğünü yükleyip all_words listesine tüm anahtar kelimeleri ekliyoruz
emoji_dict = {}
all_words = []
if os.path.exists(json_file_path):
    with open(json_file_path, "r", encoding="utf-8") as f:
        emoji_data = json.load(f)

    for category, subcategories in emoji_data.items():
        for subcategory_data in subcategories:
            for item in subcategory_data["emojis"]:
                all_keys = [item["name"]] + item.get("synonyms", [])
                for key in all_keys:
                    lower_key = key.lower()
                    emoji_dict.setdefault(lower_key, []).append(item["emoji"])
                    all_words.append(lower_key)
else:
    print(f"Hata: JSON dosyası bulunamadı -> {json_file_path}")

# Stemmer (kök bulucu) başlatma
stemmer = PorterStemmer()

# Fisher-Yates Shuffle Algoritması
def fisher_yates_shuffle(emoji_list):
    shuffled = emoji_list[:]
    for i in range(len(shuffled) - 1, 0, -1):
        j = random.randint(0, i)
        shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
    return shuffled

# Kullanıcı girdisine en yakın kelimeyi all_words listesinden bulan fonksiyon
def find_closest_word(word):
    match, score, _ = process.extractOne(word, all_words, score_cutoff=80)
    return match if match else word

# Kullanıcı cümlesini subject-verb-object (özne-fiil-nesne) olarak ayırır
def parse_sentence(text):
    doc = nlp(text)
    subject, verb, obj = None, None, None
    for token in doc:
        if "subj" in token.dep_:
            subject = token.text.lower()
        elif "obj" in token.dep_:
            obj = token.text.lower()
        elif token.pos_ == "VERB":
            verb = token.text.lower()
    return subject, verb, obj

# Bir string içinde emoji olup olmadığını kontrol eder
def contains_emoji(s):
    for ch in s:
        if ord(ch) > 127:
            return True
    return False

# Bir şifreyi SHA-256 algoritmasıyla hash'ler (kriptografik özetini çıkarır)
def hash_password(password):
    sha = hashlib.sha256()
    sha.update(password.encode('utf-8'))
    return sha.hexdigest()

# Monobit testi: Bit dizisindeki 1 ve 0 sayılarının dengesini test eder
def monobit_test(bitstring):
    ones = bitstring.count('1')
    zeros = bitstring.count('0')
    n = len(bitstring)
    s_obs = abs(ones - zeros)
    s = s_obs / math.sqrt(n)
    p_value = math.erfc(s / math.sqrt(2))
    return "Passed" if p_value > 0.01 else "Failed"

# Runs testi: Bit dizisinde ardışık aynı bitlerin (run'ların) düzenini ve dengesini test eder
def runs_test(bitstring):
    n = len(bitstring)
    ones = bitstring.count('1')
    pi = ones / n
    if abs(pi - 0.5) > (2 / math.sqrt(n)):
        return "Failed"
    v_n_obs = 1
    for i in range(1, n):
        if bitstring[i] != bitstring[i-1]:
            v_n_obs += 1
    p_value = math.erfc(abs(v_n_obs - (2 * n * pi * (1 - pi))) / (2 * math.sqrt(2 * n) * pi * (1 - pi)))
    return "Passed" if p_value > 0.01 else "Failed"

# Cumulative Sums testi: Bit dizisinin kümülatif toplam sapmasını test eder
def cumulative_sums_test(bitstring):
    s = 0
    max_abs_s = 0
    for bit in bitstring:
        s += 1 if bit == '1' else -1
        if abs(s) > max_abs_s:
            max_abs_s = abs(s)

    n = len(bitstring)
    p_value = math.erfc(max_abs_s / (math.sqrt(n) * math.sqrt(2)))
    return "Passed" if p_value > 0.01 else "Failed"

# Serial testi: Bit dizisindeki belirli uzunluktaki patternlerin (örüntülerin) frekansını test eder
def serial_test(bitstring, pattern_size=2):
    n = len(bitstring)
    if n < pattern_size:
        return "Failed"

    patterns = {}
    for i in range(n - pattern_size + 1):
        pattern = bitstring[i:i+pattern_size]
        patterns[pattern] = patterns.get(pattern, 0) + 1

    expected = (n - pattern_size + 1) / (2 ** pattern_size)
    chi_squared = sum((count - expected) ** 2 / expected for count in patterns.values())
    p_value = math.exp(-chi_squared / 2)
    return "Passed" if p_value > 0.01 else "Failed"

# Bir metni bit dizisine (binary string) çevirir
def text_to_bitstring(text):
    return ''.join(format(ord(c), '08b') for c in text)

# Bir kelime için en yakın eşleşen emoji(leri) getirir (limit kadar)
def get_emojis_from_word(word, limit=1):
    if not word:
        return []
    closest = find_closest_word(word)
    stemmed = stemmer.stem(closest)
    keys = [k for k in emoji_dict if stemmer.stem(k) == stemmed or k == closest]
    all_emojis = list({emoji for k in keys for emoji in emoji_dict[k]})  # Set ile tekrarları önle
    random.shuffle(all_emojis)

    if limit == 1:
        return [random.choice(all_emojis)] if all_emojis else []
    else:
        return all_emojis[:limit] if all_emojis else []

# Kullanıcı cümlesinden rastgele emoji listesi üretir (istenen sayıda)
def get_random_emojis(text, count):
    words = text.lower().split()
    word_count = len(words)
    used_emojis = set()
    result = []

    # Yardımcı fonksiyon: kullanılanları hariç tutarak eşsiz emoji seçer
    def pick_unique(emojis, max_pick):
        """Kümeyi koruyarak emoji seç"""
        unique = [e for e in emojis if e not in used_emojis]
        random.shuffle(unique)
        picked = unique[:max_pick]
        used_emojis.update(picked)
        return picked

    # Eğer istenen emoji sayısı kelime sayısından küçükse, her kelimeden 1 emoji seçer
    if count <= word_count:
        used_words = set()
        for word in words:
            if word in used_words:
                continue
            emojis = get_emojis_from_word(word, limit=3)
            picked = pick_unique(emojis, 1)
            if picked:
                result.extend(picked)
                used_words.add(word)

        while len(result) < count and used_emojis:
            # Tekrar kullanmadan ekleyecek başka yoksa mevcutlardan seç
            result.append(random.choice(list(used_emojis)))

        random.shuffle(result)
        return result[:count]

    # Ağırlıklı dağılımla emoji seçimi (öncelik: nesne > fiil > özne)
    subject, verb, obj = parse_sentence(text)

    max_obj = min(3, count)
    obj_emojis = get_emojis_from_word(obj, limit=5) if obj else []
    result.extend(pick_unique(obj_emojis, max_obj))
    remaining = count - len(result)

    max_verb = min(2, remaining)
    verb_emojis = get_emojis_from_word(verb, limit=4) if verb else []
    result.extend(pick_unique(verb_emojis, max_verb))
    remaining = count - len(result)

    max_subj = min(1, remaining)
    subj_emojis = get_emojis_from_word(subject, limit=3) if subject else []
    result.extend(pick_unique(subj_emojis, max_subj))
    remaining = count - len(result)

    # Kalan sayıyı doldurmak için diğer kelimelerden emoji seçer
    extras = []
    for word in words:
        extras.extend(get_emojis_from_word(word, limit=3))

    extras = [e for e in extras if e not in used_emojis]
    random.shuffle(extras)
    result.extend(extras[:remaining])
    used_emojis.update(result)

    # Yine de eksikse fallback emoji kullanır
    remaining = count - len(result)
    while len(result) < count:
        if used_emojis:
            result.append(random.choice(list(used_emojis)))
        else:
            result.append("❓")  # fallback emoji

    return result[:count]

# API Endpoint: /get-emojis → Kullanıcıdan POST isteği alır ve emoji tabanlı parola + randomness testlerini döner
@app.route("/get-emojis", methods=["POST"])
def get_emojis():
    data = request.get_json()
    if not data or "text" not in data or "count" not in data:
        return jsonify({"error": "Lütfen 'text' ve 'count' alanlarını içeren bir JSON gönderin."}), 400

    text = data["text"]
    count = data["count"]
    emojis = get_random_emojis(text, count)
    password = ''.join(emojis)

    # Emoji içeriyor mu kontrolü
    if contains_emoji(password):
        test_input = hash_password(password)
    else:
        test_input = password

    # Bitstringe çevir
    bitstring = text_to_bitstring(test_input)

    # 4 randomness testini çalıştır
    tests = {
        "monobit": monobit_test(bitstring),
        "runs": runs_test(bitstring),
        "cumulative_sums": cumulative_sums_test(bitstring),
        "serial": serial_test(bitstring)
    }

    return jsonify({
        "emojis": emojis,
        "password": password,
        "tests": tests
    })


@app.route("/")
def home():
    return "Flask Emoji API Çalışıyor!"


if __name__ == "__main__":
    app.run(debug=True)