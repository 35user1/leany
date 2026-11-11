
document.addEventListener('DOMContentLoaded', () => {

  // =====================================
  // ① ローディング画面
  // =====================================

  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const loadingTextElem = document.getElementById('loading-text');

  if (loadingScreen && homeScreen && loadingTextElem) {

    const message = "読み込み中...";
    let charIndex = 0;
    const speed = 150;

    loadingTextElem.textContent = '';

    function typeWriter() {

      if (charIndex < message.length) {

        loadingTextElem.textContent += message.charAt(charIndex);
        charIndex++;

        setTimeout(typeWriter, speed);

      } else {

        setTimeout(transitionToHome, 1000);

      }

    }

    function transitionToHome() {

      loadingScreen.style.opacity = '0';

      setTimeout(() => {

        loadingScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');

      }, 500);

    }

    typeWriter();

  }


  // =====================================
  // ② おすすめレシピスライダー
  // =====================================

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

      dots[currentSlide].setAttribute(
        'aria-current',
        'true'
      );

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


  // =====================================
  // ③ レシピの絞り込み機能
  // =====================================

  const filterButtons = document.querySelectorAll('.filter');
  const recipeLinks = document.querySelectorAll('.recipe-link');

  filterButtons.forEach(button => {

    button.addEventListener('click', () => {

      filterButtons.forEach(b => {
        b.classList.remove('active');
      });

      button.classList.add('active');

      const value = button.dataset.filter;

      recipeLinks.forEach(link => {

        const card = link.querySelector('.recipe-card');

        if (!card) return;

        const category = card.dataset.category;

        link.hidden =
          value !== 'all' && category !== value;

      });

    });

  });


  // =====================================
  // ④ 野菜検索機能
  // 漢字・ひらがな・カタカナ対応
  // =====================================

  const searchInput = document.getElementById('vegetable-search');

  const vegetableCards = document.querySelectorAll('.vegetable-card');

  const emptyMessage = document.getElementById('search-empty');


  if (searchInput) {

    // 文字を統一する関数
    function normalizeText(text) {

      return text

        .normalize('NFKC')

        // カタカナをひらがなに変換
        .replace(/[\u30A1-\u30F6]/g, char =>
          String.fromCharCode(char.charCodeAt(0) - 0x60)
        )

        .toLowerCase()

        // 空白を削除
        .replace(/\s+/g, '');

    }


    searchInput.addEventListener('input', () => {

      const keyword = normalizeText(searchInput.value);

      let count = 0;

      vegetableCards.forEach(card => {

        const name = normalizeText(
          card.dataset.name || ''
        );

        const kana = normalizeText(
          card.dataset.kana || ''
        );

        // 野菜の名前と読み方を検索
        const matched =
          keyword === '' ||
          name.includes(keyword) ||
          kana.includes(keyword);

        card.style.display = matched ? '' : 'none';

        if (matched) {
          count++;
        }

      });


      // 検索結果が0件の場合
      if (emptyMessage) {

        emptyMessage.style.display =
          count === 0 ? 'block' : 'none';

      }

    });

  }


  // =====================================
  // ⑤ サイト内検索ボタン
  // =====================================

  const globalSearchInput = document.getElementById('search-input');
  const globalSearchButton = document.getElementById('search-btn');

  if (globalSearchInput && globalSearchButton) {

    function executeGlobalSearch() {

      const keyword = globalSearchInput.value.trim();

      if (keyword === '') return;

      const searchUrl = '../index.html?search=' +
        encodeURIComponent(keyword);

      window.location.href = searchUrl;

    }

    globalSearchButton.addEventListener('click', executeGlobalSearch);

    globalSearchInput.addEventListener('keydown', event => {

      if (event.key === 'Enter') {
        executeGlobalSearch();
      }

    });

  }

});
