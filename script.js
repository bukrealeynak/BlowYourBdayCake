document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  // Yazıyı sabitle
  function updateMessage() {
    candleCountDisplay.innerHTML = `      
      Happy Birthday! 🥳<br>
      No birthday should ever go cake-less! 🎂<br>
      Now close your eyes, make a wish, and give it a big blow... 🌬️<br>
      Okay, it’s not edible. But hey, it’s made with love! 😄<br>
      <strong>Love you so much! 💖</strong>
    `;
  }

  // Mum ekleme fonksiyonu
  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
  }

  // Sayfa yüklendiğinde 5 mum ekle
  function addInitialCandles() {
    const rect = cake.getBoundingClientRect();
    const cakeLeft = rect.left;
    const cakeWidth = rect.width;
    const y = 10;

    for (let i = 1; i <= 5; i++) {
      const x = (cakeWidth / 6) * i;
      addCandle(x, y);
    }

  }

  // Kullanıcının mum eklemesini devre dışı bırak
  // cake.addEventListener("click", function (event) { ... }); // Kaldırıldı

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40;
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  // Başlangıçta çağır
  addInitialCandles();
  updateMessage();
});
