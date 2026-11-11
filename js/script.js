const { createClient } = supabase;
const db = createClient(
  "https://ytypzmmspqcpsedduhli.supabase.co",
  "sb_publishable_6-ssT_OObqs1Ng9KOkEzcw_R8n1M2Tk"
);










document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const loadingTextElem = document.getElementById('loading-text');

  const message = "読み込み中...";
  let charIndex = 0;
  const speed = 150;

  // 必要なHTML要素があるか確認
  if (!loadingScreen || !homeScreen || !loadingTextElem) {
    console.error('読み込み画面に必要なHTML要素が見つかりません。');
    return;
  }

  // ① 1文字ずつタイピング表示
  function typeWriter() {
    if (charIndex < message.length) {
      loadingTextElem.textContent += message.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, speed);
    } else {
      // タイピング終了後、ホーム画面へ
      setTimeout(transitionToHome, 1000);
    }
  }

  // ② ローディング画面を消してホーム画面を表示
  function transitionToHome() {
    loadingScreen.style.opacity = '0';

    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      homeScreen.classList.remove('hidden');
    }, 500);
  }

  // ③ おすすめレシピのスライダー
  const slides = document.querySelectorAll('.slide-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentSlide = 0;

  function showSlide(index) {
    if (slides.length === 0) return;

    if (index < 0) {
      currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    slides.forEach(slide => {
      slide.classList.remove('active');
    });

    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.removeAttribute('aria-current');
    });

    slides[currentSlide].classList.add('active');

    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
      dots[currentSlide].setAttribute('aria-current', 'true');
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // ④ 読み込み開始
  typeWriter();
});
