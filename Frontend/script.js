document.addEventListener("DOMContentLoaded", () => {
    const inputTextGroup = document.getElementById("inputTextGroup");
    const emojiCheckbox = document.getElementById("includeEmojis");
    const counters = document.querySelectorAll(".count-input");
    const maxLengthInput = document.getElementById("length");
    maxLengthInput.addEventListener("input", () => {
   enforcePasswordLengthBounds();
updateRemaining();
        updateMinPasswordLength();  // ✅ min değeri güncelle

        bruteBox.style.display = "none";
        testResults.style.display = "none";
        passwordOutput.style.display = "none";
        document.getElementById("recommendedPassword").style.display = "none";
        generatedPassword = "";
    });
    
        // Şifre uzunluğu inputuna yazı yazıldığında çalışacak olay
    maxLengthInput.addEventListener("change", () => {
        enforcePasswordLengthBounds();
        updateRemaining();
        updateMinPasswordLength();  // ✅ min değeri güncelle

        // Şifre oluşturma ve test sonuçlarını gizle
        bruteBox.style.display = "none";
        testResults.style.display = "none";
        passwordOutput.style.display = "none";
        document.getElementById("recommendedPassword").style.display = "none";
        generatedPassword = "";
    });
         
    const remainingLabel = document.getElementById("remainingInfo");
    const passwordOutput = document.getElementById("password");
    const testResults = document.getElementById("testResults");
    const bruteBox = document.getElementById("bruteTime");

    updateRemaining(); // Sayfa ilk açıldığında da çalışması için
    updateMinPasswordLength();  // ✅ min değeri güncelle

    let generatedPassword = "";
    let seed = Date.now() & 0xffffffff;

    counters.forEach(input => {
        input.disabled = true;
        input.value = "";
    });

    // Her checkbox değiştiğinde yapılacak işlemler (harf, sayı, sembol, vs.)
    document.querySelectorAll(".checkbox-group input[type='checkbox']").forEach((checkbox, idx) => {
        checkbox.addEventListener("change", () => {
            updateMinPasswordLength(); // ✅ BURAYA EKLE

            const maxLength = parseInt(maxLengthInput.value);
            let total = 0;
            counters.forEach(input => total += parseInt(input.value) || 0);
            const remaining = maxLength - total;

            if (checkbox.checked) {
                // Eğer remaining zaten 0 ise checkbox'ı işaretlemeye izin verme
                if (remaining <= 0) {
                    checkbox.checked = false; // Geri kapat
                    return; // Input'u da açma
                } else {
                    counters[idx].disabled = false;
                    counters[idx].value = "1";
                }
            } else {
                counters[idx].disabled = true;
                counters[idx].value = "";
            }


            // Kalan karakter sayısını güncelleyen fonksiyon
            updateRemaining();
            bruteBox.style.display = "none";
            testResults.style.display = "none";
            passwordOutput.style.display = "none";
            document.getElementById("recommendedPassword").style.display = "none"; // ✅ burası
            generatedPassword = "";
        });
    });



    emojiCheckbox.addEventListener("change", () => {
        const inputText = document.getElementById("inputText");
        if (emojiCheckbox.checked) {
            inputTextGroup.style.display = "block";
        } else {
            inputTextGroup.style.display = "none";
            inputText.value = "";  // 🔥 Base Text kutusunu temizle
        }
    });
    

        // Kalan karakter sayısını güncelleyen fonksiyon
    function updateRemaining() {
        const maxLength = parseInt(maxLengthInput.value);
        let total = 0;
        counters.forEach(input => total += parseInt(input.value) || 0);
        let remaining = maxLength - total;

        remainingLabel.textContent = `Remaining: ${remaining >= 0 ? remaining : 0}`;

        counters.forEach((input, idx) => {
            const value = parseInt(input.value) || 0;
            const checkbox = document.querySelectorAll(".checkbox-group input[type='checkbox']")[idx];

            // Eğer toplam dolmuş ve bu sayaç sıfırsa: input'u devre dışı bırak ve checkbox'ı kaldır
            if (remaining <= 0 && value === 0) {
                input.disabled = true;
                checkbox.checked = false;
            }
            // Eğer checkbox seçiliyse: input aktif olsun
            else if (checkbox.checked) {
                input.disabled = false;
            }

            // Her input için max değer: kendi mevcut değeri + kalan kapasite
            input.max = value + remaining;
        });
        
    }

        // Minimum şifre uzunluğunu seçilen karakter tipine göre güncelle
    function updateMinPasswordLength() {
        const selectedTypes = document.querySelectorAll(".checkbox-group input[type='checkbox']:checked").length;
        maxLengthInput.min = selectedTypes;
    }

        // Şifre uzunluğunun sayaç toplamına göre sınırlandırılması
    function enforcePasswordLengthBounds() {
        const totalCount = [...counters].reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        let currentValue = parseInt(maxLengthInput.value) || 0;
    
        // Eğer Password Length sayaç toplamından küçükse otomatik eşitle
        if (currentValue < totalCount) {
            maxLengthInput.value = totalCount;
            currentValue = totalCount;
        }
    
        updateRemaining();
        updateMinPasswordLength();
    }
    
        // Karakter sayısı inputlarına değişiklik dinleyicisi ekle
    counters.forEach((input, idx) => {
        function handleCounterChange() {
            const value = parseInt(input.value) || 0;

            // Eğer 0'a çekildiyse → checkbox'ı da kapat
            if (value === 0) {
                const checkbox = document.querySelectorAll(".checkbox-group input[type='checkbox']")[idx];
                checkbox.checked = false;
                input.disabled = true;
                input.value = "";
            }

            updateRemaining();

            // Minimum uzunluğu sayaç toplamına eşitle
    const totalCount = [...counters].reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
    maxLengthInput.min = totalCount;  // min zaten bu
            bruteBox.style.display = "none";
            testResults.style.display = "none";
            passwordOutput.style.display = "none";
            document.getElementById("recommendedPassword").style.display = "none"; // ✅ EKLENDİ
            generatedPassword = "";
        }

        input.addEventListener("input", handleCounterChange);
        input.addEventListener("change", handleCounterChange);
    });

    updateRemaining();
    
    // Rastgele karakter üretmek için fonksiyon
    function generateRandomChars(count) {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const uppercases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}<>?";

        const allChars = letters + uppercases + numbers + symbols;
        let result = '';
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            result += allChars[randomIndex];
        }
        return result.split('');
    }

    // shuffleArray Fonksiyonu
    function shuffleArray(array) {
        return array.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }

        // Şifre oluştur butonuna tıklanınca çalışan fonksiyon (aşağıda kısmen)
    document.getElementById("generate").addEventListener("click", async () => {
        const text = document.getElementById("inputText").value;
        const lettersChecked = document.getElementById("includeLetters").checked;
        const uppercaseChecked = document.getElementById("includeUppercase").checked;
        const numbersChecked = document.getElementById("includeNumbers").checked;
        const symbolsChecked = document.getElementById("includeSymbols").checked;
        const emojisChecked = document.getElementById("includeEmojis").checked;

        if (!lettersChecked && !uppercaseChecked && !numbersChecked && !symbolsChecked && !emojisChecked) {
            alert("⚠️ Please select at least one character type before generating a password!");
            return;
        }

        const lettersCount = parseInt(document.getElementById("lettersCount").value) || 0;
        const uppercaseCount = parseInt(document.getElementById("uppercaseCount").value) || 0;
        const numbersCount = parseInt(document.getElementById("numbersCount").value) || 0;
        const symbolsCount = parseInt(document.getElementById("symbolsCount").value) || 0;
        const emojisCount = parseInt(document.getElementById("emojisCount").value) || 0;

        const totalSelected = lettersCount + uppercaseCount + numbersCount + symbolsCount + emojisCount;
        const passwordLength = parseInt(document.getElementById("length").value);

        // Password length is less than the total selected count
        if (passwordLength < totalSelected) {
            alert("⚠️ Password length is shorter than the total selected character count! Please adjust the length.");
            return;  // Password generation won't proceed
        }
        if (passwordLength > totalSelected) {
            alert("⚠️ Password length is longer than the selected character count, so it has been automatically completed.");
        }
        let emojis = [];

        if (emojiCheckbox.checked) {
            if (!text) {  // Eğer base text yoksa
                alert("Please enter base text for emojis!");
                return;
            }
            const response = await fetch("http://127.0.0.1:5000/get-emojis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text, count: emojisCount })
            });

            const data = await response.json();
            if (!data.emojis || data.emojis.length === 0) {  // Eğer gelen emoji listesi boşsa
                alert("No emojis found for the given text!");
                return;
            }
            emojis = data.emojis.slice(0, emojisCount);
        }


        const letters = "abcdefghijklmnopqrstuvwxyz";
        const uppercases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}<>?";

        const allCharsArray = [
            ...customRandomChars(letters, lettersCount),
            ...customRandomChars(uppercases, uppercaseCount),
            ...customRandomChars(numbers, numbersCount),
            ...customRandomChars(symbols, symbolsCount),
            ...emojis
        ];
        // Eksik karakterleri tamamla
        const remainingLength = passwordLength - allCharsArray.length;
        if (remainingLength > 0) {
            const missingChars = generateRandomChars(remainingLength);
            allCharsArray.push(...missingChars);
        }

        // Şifreyi karıştır
        generatedPassword = shuffleArray(allCharsArray).join('');
        passwordOutput.innerHTML = `<p>${generatedPassword}</p>`;
        passwordOutput.style.display = "block";
        bruteBox.style.display = "none";
        testResults.style.display = "none";

        const bitstring = textToBitstring(generatedPassword);
        let testsHtml = "<h3>Randomness Test Results:</h3><ul style='list-style: none; padding: 0;'>";

        const tests = {
            "Monobit": monobitTest(bitstring),
            "Runs": runsTest(bitstring),
            "Cumulative Sums": cumulativeSumsTest(bitstring),
            "Serial": serialTest(bitstring)
        };

        for (const [test, result] of Object.entries(tests)) {
            const icon = result === "Passed" ? "✔️" : "❌";
            const color = result === "Passed" ? "lightgreen" : "red";
            testsHtml += `<li style="color:${color}; margin-bottom:5px;">${icon} ${test}: ${result}</li>`;
        }

        testsHtml += "</ul>";
        testResults.innerHTML = testsHtml;
        if (emojiCheckbox.checked && remainingLength > 0 && text.trim()) {
            try {
                const emojiResponse = await fetch("http://127.0.0.1:5000/get-emojis", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: text, count: passwordLength })
                });
        
                const emojiData = await emojiResponse.json();
                const extraEmojis = emojiData.emojis || [];
        
                const lettersCount = parseInt(document.getElementById("lettersCount").value) || 0;
                const uppercaseCount = parseInt(document.getElementById("uppercaseCount").value) || 0;
                const numbersCount = parseInt(document.getElementById("numbersCount").value) || 0;
                const symbolsCount = parseInt(document.getElementById("symbolsCount").value) || 0;
                const emojisCount = parseInt(document.getElementById("emojisCount").value) || 0;
        
                const allCharsets = {
                    letters: { value: letters, count: lettersCount },
                    uppercases: { value: uppercases, count: uppercaseCount },
                    numbers: { value: numbers, count: numbersCount },
                    symbols: { value: symbols, count: symbolsCount }
                };
        
                let recommendedFill = [];
        
                for (const { value: charset, count } of Object.values(allCharsets)) {
                    if (count > 0) {
                        recommendedFill.push(...customRandomChars(charset, count));
                    }
                }
        
                const minEmojiCount = emojisCount + 1;
                const maxEmojiCount = Math.floor(passwordLength / 2);
                const emojiFillCount = Math.min(extraEmojis.length, Math.max(minEmojiCount, maxEmojiCount));
                const emojiFills = extraEmojis.slice(0, emojiFillCount);
                recommendedFill.push(...emojiFills);
        
                const stillMissing = passwordLength - recommendedFill.length;
                if (stillMissing > 0) {
                    const combinedCharset = letters + uppercases + numbers + symbols;
                    const filler = generateRandomChars(stillMissing);
                    recommendedFill.push(...filler);
                }
        
                const finalPasswordArray = shuffleArray(recommendedFill).slice(0, passwordLength);
                const recommendedPassword = finalPasswordArray.join('');
        
                if (recommendedPassword === generatedPassword) {
                    document.getElementById("recommendedPassword").style.display = "none";
                    return;
                }
        
                const emojiCountInPassword = (recommendedPassword.match(/[\p{Emoji_Presentation}\uFE0F]/gu) || []).length;
        
                if (emojiCountInPassword >= minEmojiCount) {
                    document.getElementById("recommendedPassword").innerHTML = `
                        <p><strong>🔒 This strong password is recommended for you:</strong><br>${recommendedPassword}</p>`;
                    document.getElementById("recommendedPassword").style.display = "block";
                } else {
                    document.getElementById("recommendedPassword").style.display = "none";
                }
        
            } catch (err) {
                console.warn("Emoji-based recommendation failed:", err);
                document.getElementById("recommendedPassword").style.display = "none";
            }
        } else {
            document.getElementById("recommendedPassword").style.display = "none";
        }
           });

    document.getElementById("copy").addEventListener("click", () => {
        const lettersChecked = document.getElementById("includeLetters").checked;
        const uppercaseChecked = document.getElementById("includeUppercase").checked;
        const numbersChecked = document.getElementById("includeNumbers").checked;
        const symbolsChecked = document.getElementById("includeSymbols").checked;
        const emojisChecked = document.getElementById("includeEmojis").checked;

        if (!lettersChecked && !uppercaseChecked && !numbersChecked && !symbolsChecked && !emojisChecked) {
            alert("⚠️ Please select at least one character type before copying the password!");
            return;
        }

        const field = document.getElementById("password");
        if (!generatedPassword.trim() || passwordOutput.style.display === "none") {
            alert("⚠️ Please generate a password first!");
            return;
        }

        navigator.clipboard.writeText(field.textContent.trim());
        alert("✅ Password copied!");
    });

    document.getElementById("showBrute").addEventListener("click", async () => {
        const lettersChecked = document.getElementById("includeLetters").checked;
        const uppercaseChecked = document.getElementById("includeUppercase").checked;
        const numbersChecked = document.getElementById("includeNumbers").checked;
        const symbolsChecked = document.getElementById("includeSymbols").checked;
        const emojisChecked = document.getElementById("includeEmojis").checked;

        if (!lettersChecked && !uppercaseChecked && !numbersChecked && !symbolsChecked && !emojisChecked) {
            alert("⚠️ Please select at least one character type before using Brute Force Test!");
            return;
        }
        // Şifre generate edilmemişse VEYA ekranda şifre gözükmüyorsa brute force başlamasın
        if (!generatedPassword.trim() || passwordOutput.style.display === "none") {
            alert("⚠️ Please generate a password first!");
            return;
        }

        try {
            const bruteResponse = await fetch("http://127.0.0.1:5002/custom-bruteforce", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: generatedPassword })
            });

            const bruteData = await bruteResponse.json();

            if (bruteData.found) {
                bruteBox.innerHTML = `
                    🧠 Password cracked successfully!<br>
                    🔍 Found Password: <strong>${bruteData.guess}</strong><br>
                    ⏱️ Attempts: <strong>${bruteData.attempts.toLocaleString()}</strong><br>
                    ⏳ Time Taken: <strong>${bruteData.time_elapsed} seconds</strong>
                `;
            } else {
                let mainMessage = "";
                if (bruteData.time_elapsed >= 30) {
                    mainMessage = "❌ Password could not be cracked within the time limit.";
                } else {
                    mainMessage = "🔍 Password could not be cracked — short length made the search complete quickly.";
                }

                bruteBox.innerHTML = `
                    ${mainMessage}<br>
                    ⏱️ Attempts Made: <strong>${bruteData.attempts.toLocaleString()}</strong><br>
                    ⏳ Time Taken: <strong>${bruteData.time_elapsed} seconds</strong>
                `;
            }

            bruteBox.style.display = "block";
            testResults.style.display = "none";
        } catch (err) {
            console.error("Brute force failed:", err);
            bruteBox.textContent = "⚠️ Could not estimate crack time.";
            bruteBox.style.display = "block";
        }
    });

    document.getElementById("showTests").addEventListener("click", () => {
        const lettersChecked = document.getElementById("includeLetters").checked;
        const uppercaseChecked = document.getElementById("includeUppercase").checked;
        const numbersChecked = document.getElementById("includeNumbers").checked;
        const symbolsChecked = document.getElementById("includeSymbols").checked;
        const emojisChecked = document.getElementById("includeEmojis").checked;

        if (!lettersChecked && !uppercaseChecked && !numbersChecked && !symbolsChecked && !emojisChecked) {
            alert("⚠️ Please select at least one character type before viewing Test Results!");
            return;
        }
        if (!generatedPassword.trim() || passwordOutput.style.display === "none") {
            alert("⚠️ Please generate a password first!");
            return;
        }

        testResults.style.display = "block";
        bruteBox.style.display = "none";
    });

    function textToBitstring(text) {
        return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    }

    function monobitTest(bitstring) {
        const ones = [...bitstring].filter(b => b === '1').length;
        const zeros = bitstring.length - ones;
        return Math.abs(ones - zeros) < (0.05 * bitstring.length) ? "Passed" : "Failed";
    }

    function runsTest(bitstring) {
        let runs = 1;
        for (let i = 1; i < bitstring.length; i++) {
            if (bitstring[i] !== bitstring[i - 1]) runs++;
        }
        return runs > bitstring.length * 0.4 ? "Passed" : "Failed";
    }

    function cumulativeSumsTest(bitstring) {
        let sum = 0, max = 0;
        for (let bit of bitstring) {
            sum += (bit === '1' ? 1 : -1);
            if (Math.abs(sum) > max) max = Math.abs(sum);
        }
        return max < (bitstring.length * 0.5) ? "Passed" : "Failed";
    }

    function serialTest(bitstring) {
        let patterns = {};
        for (let i = 0; i < bitstring.length - 1; i++) {
            const pair = bitstring.slice(i, i + 2);
            patterns[pair] = (patterns[pair] || 0) + 1;
        }
        return Object.keys(patterns).length > 2 ? "Passed" : "Failed";
    }

    function customRandomChars(charset, count) {
        let result = "";
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(xorshift() * charset.length);
            result += charset.charAt(idx);
        }
        return result;
    }

    function xorshift() {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (seed >>> 0) / Math.pow(2, 32);
    }

});
