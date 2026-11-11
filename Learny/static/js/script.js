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
document.querySelectorAll('.filter').forEach(button=>{button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');const value=button.dataset.filter;document.querySelectorAll('.recipe-card').forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value;});});});
const menu=document.getElementById('menu');menu.addEventListener('click',()=>{const open=document.getElementById('nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});


/*れびゆー*/
document.addEventListener("DOMContentLoaded", () => {
 
    const reviewButton = document.querySelector("#review-submit");
    const reviewItems = document.querySelector("#review-items");
 
    if (!reviewButton || !reviewItems) return;
 
    // このレシピ専用の保存場所
    const recipeId = "egg-udon";
    const storageKey = "reviews-" + recipeId;
 
    // 保存されたレビューを読み込む
    let reviews = [];
 
    try {
        reviews = JSON.parse(localStorage.getItem(storageKey)) || [];
        if (!Array.isArray(reviews)) reviews = [];
    } catch (error) {
        reviews = [];
    }
 
    // レビューを画面に表示
    function showReviews() {
        reviewItems.innerHTML = "";
 
        reviews.forEach((review) => {
            const item = document.createElement("div");
            item.className = "review-item";
 
            const name = document.createElement("strong");
            name.textContent = review.name;
 
            const stars = document.createElement("p");
            stars.className = "stars";
            stars.textContent =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);
 
            const comment = document.createElement("p");
            comment.textContent = review.comment;
 
            const date = document.createElement("small");
            date.textContent = review.date;
 
            item.append(name, stars, comment, date);
            reviewItems.appendChild(item);
        });
    }
 
    // 最初に保存済みレビューを表示
    showReviews();
 
    // 投稿ボタンを押したとき
    reviewButton.addEventListener("click", () => {
 
        const name = document.querySelector("#review-name").value.trim();
        const rating = Number(
            document.querySelector("#review-rating").value
        );
        const comment = document.querySelector("#review-comment").value.trim();
 
        if (!name || !comment) {
            alert("名前とコメントを入力してください！");
            return;
        }
 
        // 新しいレビュー
        const newReview = {
            name: name,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString("ja-JP")
        };
 
        // レビュー一覧に追加
        reviews.unshift(newReview);
 
        // ブラウザに保存
        try {
            localStorage.setItem(storageKey, JSON.stringify(reviews));
        } catch (error) {
            reviews.shift();
            alert("保存できませんでした。ブラウザの設定を確認してください。");
            return;
        }
 
        // 画面更新
        showReviews();
 
        // 入力欄を空にする
        document.querySelector("#review-name").value = "";
        document.querySelector("#review-comment").value = "";
 
        alert("レビューを保存しました♡");
    });
 
});
