document.addEventListener('DOMContentLoaded', () => {
 const loadingScreen = document.getElementById('loading-screen');
 const homeScreen = document.getElementById('home-screen');
 const loadingTextElem = document.getElementById('loading-text');
 const hamburgerBtn = document.getElementById('hamburger-btn');
 const slideMenu = document.getElementById('slide-menu');
 const menuOverlay = document.getElementById('menu-overlay');
 const message = "読み込み中...";
 let charIndex = 0;
 const speed = 150; // 1文字あたりのスピード
 // ① 1文字ずつタイピング表示
 function typeWriter() {
   if (charIndex < message.length) {
     loadingTextElem.textContent += message.charAt(charIndex);
     charIndex++;
     setTimeout(typeWriter, speed);
   } else {
     //タイピングが終わったらホーム画面へ遷移
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
 //三本線メニューの開閉処理
 function toggleMenu() {
   hamburgerBtn.classList.toggle('active');
   slideMenu.classList.toggle('active');
   menuOverlay.classList.toggle('active');
 }
 hamburgerBtn.addEventListener('click', toggleMenu);
 menuOverlay.addEventListener('click', toggleMenu);
 //おすすめレシピ スライダー
 const slides = document.querySelectorAll('.slide-card');
 const dots = document.querySelectorAll('.dot');
 const prevBtn = document.getElementById('prev-btn');
 const nextBtn = document.getElementById('next-btn');
 let currentSlide = 0;
 function showSlide(index) {
   if (slides.length === 0) return;
   if (index < 0) currentSlide = slides.length - 1;
   else if (index >= slides.length) currentSlide = 0;
   else currentSlide = index;
   slides.forEach(slide => slide.classList.remove('active'));
   dots.forEach(dot => dot.classList.remove('active'));
   slides[currentSlide].classList.add('active');
   if (dots[currentSlide]) {
     dots[currentSlide].classList.add('active');
   }
 }
 if (prevBtn && nextBtn) {
   prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
   nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
 }
 dots.forEach((dot, idx) => {
   dot.addEventListener('click', () => showSlide(idx));
 });
 // スタート
 typeWriter();
});


/*------------!!追加部分!!----------*/
 
// 1. レシピの絞り込み（フィルター）機能
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
 
    // すべてのボタンからactiveを削除
    document.querySelectorAll('.filter').forEach(b => {
      b.classList.remove('active');
    });
 
    // クリックしたボタンにactiveを追加
    button.classList.add('active');
 
    // 選択したカテゴリーを取得
    const value = button.dataset.filter;
 
    // レシピの外側のリンクごと非表示にする
    document.querySelectorAll('.recipe-link').forEach(link => {
      const card = link.querySelector('.recipe-card');
 
      link.hidden = value !== 'all' &&
                    card.dataset.category !== value;
    });
 
  });
});

// ===== 野菜検索（ひらがな・カタカナ・漢字対応） =====
 
document.addEventListener("DOMContentLoaded", () => {
 
  const searchInput = document.getElementById("vegetable-search");
  const cards = document.querySelectorAll(".vegetable-card");
  const emptyMessage = document.getElementById("search-empty");
 
  if (!searchInput) return;
 
  // カタカナをひらがなに変換
  function normalizeText(text) {
    return text
      .normalize("NFKC")
      .replace(/[\u30A1-\u30F6]/g, char =>
        String.fromCharCode(char.charCodeAt(0) - 0x60)
      )
      .toLowerCase()
      .replace(/\s+/g, "");
  }
 
  searchInput.addEventListener("input", () => {
 
    const keyword = normalizeText(searchInput.value);
    let count = 0;
 
    cards.forEach(card => {
 
      const name = normalizeText(card.dataset.name || "");
      const kana = normalizeText(card.dataset.kana || "");
 
      // 漢字・ひらがな・カタカナで検索
      const matched =
        name.includes(keyword) ||
        kana.includes(keyword);
 
      card.style.display = matched ? "" : "none";
 
      if (matched) count++;
    });
 
    if (emptyMessage) {
      emptyMessage.style.display =
        count === 0 ? "block" : "none";
    }
 
  });
 
});



// 2. モバイルナビゲーションの開閉（ハンバーガーメニュー）機能
const menu = document.getElementById('menu');
menu.addEventListener('click', () => {
  // #nav 要素に「open」クラスがあれば削除、なければ追加し、その状態（true/false）を取得
  const open = document.getElementById('nav').classList.toggle('open');
  // アクセシビリティ（支援技術）のために aria-expanded 属性を更新
  menu.setAttribute('aria-expanded', String(open));
});
