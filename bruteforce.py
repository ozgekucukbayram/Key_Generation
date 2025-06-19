from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
import json
import os
import time
import itertools  # Sistematik brute-force için
import regex as re  # pip install regex


app = Flask(__name__)
CORS(app)

# Emojileri yükleyen yardımcı fonksiyon (başka yerde kullanılırsa hazır)
def load_emojis_from_json(file_path):
    emojis = []
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        for category, subcategories in data.items():
            for subcat in subcategories:
                for item in subcat["emojis"]:
                    emojis.append(item["emoji"])
    return emojis

# Emoji listesi sadece ilerideki kullanımlar için hazır tutulur
emoji_list = []
json_path = r"C:\Users\ozgek\OneDrive\Desktop\Hello.py\tum_emoji_categories_synonyms_cleaned2.json"
if os.path.exists(json_path):
    emoji_list = load_emojis_from_json(json_path)

# Brute-force saldırısını başlatan API endpointi
@app.route("/custom-bruteforce", methods=["POST"])
def custom_bruteforce():
    data = request.get_json()
    password = data.get("password", "")

    password_length = len(re.findall(r'\X', password))
    print(f"🎯The attack has started. Password length: {password_length}")

    # Saldırganın klasik karakter havuzu (emoji yok)
    attacker_charset = (
        string.ascii_lowercase +
        string.ascii_uppercase +
        string.digits +
        "!@#$%^&*()-_=+{}[]<>?/~|"
    )

    max_duration = 30  # Maksimum süre (saniye)
    start_time = time.time()
    attempts = 0

    try:
        # Sistematik kombinasyon denemesi
        for guess_tuple in itertools.product(attacker_charset, repeat=password_length):
            if time.time() - start_time > max_duration:
                print("⏱ Time is up, attack is stopped.")
                break

            try:
                guess = ''.join(guess_tuple)
            except Exception as e:
                print("🛑 Prediction generation error:", e)
                continue

            attempts += 1

            try:
                # Unicode uyumlu karşılaştırma
                if guess.encode("utf-8") == password.encode("utf-8"):
                    print(f"🎉 Password found! {guess} ({attempts} attempts)")
                    return jsonify({
                        "found": True,
                        "attempts": attempts,
                        "guess": guess,
                        "time_elapsed": round(time.time() - start_time, 2)
                    })
            except Exception as e:
                print(f"🛑 Comparison error (guess='{guess}'): {e}")
                continue

    except Exception as outer_error:
        print("🚨 Unexpected error outside the loop:", outer_error)

    print(f"❌ Password not found. Total attempts: {attempts}")
    return jsonify({
        "found": False,
        "attempts": attempts,
        "time_elapsed": round(time.time() - start_time, 2)
    })

if __name__ == "_main_":
    app.run(port=5002, debug=True)