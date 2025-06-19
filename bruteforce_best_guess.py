from flask import Flask, request, jsonify
from flask_cors import CORS
import string
import time
import itertools
import regex as re  # Unicode karakterleri düzgün saymak için
from rapidfuzz import fuzz  # Benzerlik skoru ölçmek için

app = Flask(__name__)
CORS(app)

@app.route("/custom-bruteforce", methods=["POST"])
def custom_bruteforce():
    data = request.get_json()
    password = data.get("password", "")

    # Unicode karakter sayısını al (emoji destekli)
    password_length = len(re.findall(r'\X', password))
    print(f"🎯 Saldırı başladı. Şifre uzunluğu: {password_length}")

    # Saldırganın klasik karakter havuzu (emoji içermiyor)
    attacker_charset = (
        string.ascii_lowercase +
        string.ascii_uppercase +
        string.digits +
        "!@#$%^&*()-_=+{}[]<>?/~|"
    )

    start_time = time.time()
    attempts = 0
    best_guess = ""
    best_score = 0

    try:
        # Tüm olası kombinasyonları sırayla dener
        for guess_tuple in itertools.product(attacker_charset, repeat=password_length):
            attempts += 1
            guess = ''.join(guess_tuple)

            # Şifre tam eşleşirse
            if guess.encode("utf-8") == password.encode("utf-8"):
                print(f"🎉 Şifre bulundu! {guess} ({attempts} denemede)")
                return jsonify({
                    "found": True,
                    "attempts": attempts,
                    "guess": guess,
                    "time_elapsed": round(time.time() - start_time, 2)
                })

            # Benzeme skorunu güncelle
            score = fuzz.ratio(guess, password)
            if score > best_score:
                best_score = score
                best_guess = guess

    except Exception as e:
        print("🚨 Brute-force sırasında hata:", e)

    print(f"❌ Şifre bulunamadı. En iyi tahmin: {best_guess} (%{best_score:.2f})")
    return jsonify({
        "found": False,
        "attempts": attempts,
        "time_elapsed": round(time.time() - start_time, 2),
        "best_guess": best_guess,
        "similarity": round(best_score, 2)
    })

if __name__ == "__main__":
    app.run(port=5002, debug=True)