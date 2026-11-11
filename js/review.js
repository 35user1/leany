// 事前に js/script.js で db（Supabaseクライアント）が作られていることが前提です

const section = document.getElementById("review-section");
const recipeKey = section.dataset.recipeId; // レシピごとの名前
const BUCKET = "cook-photos";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

const form = document.getElementById("review-form");
const nameInput = document.getElementById("review-name");
const ratingSelect = document.getElementById("review-rating");
const commentInput = document.getElementById("review-comment");
const photoInput = document.getElementById("review-photo");
const submitButton = document.getElementById("review-submit");
const messageEl = document.getElementById("review-message");
const loginNote = document.getElementById("review-login-note");
const itemsEl = document.getElementById("review-items");
const avgStarsEl = document.getElementById("average-stars");
const avgTextEl = document.getElementById("review-average");
const countEl = document.getElementById("review-count");

let currentUser = null;

// ----- 表示まわり -----

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.dataset.type = type || "";
  messageEl.hidden = !text;
}

function stars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function photoUrl(path) {
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// 平均の星・件数を更新する
function renderSummary(reviews) {
  if (reviews.length === 0) {
    avgStarsEl.textContent = stars(0);
    avgTextEl.textContent = "まだ評価はありません";
    countEl.textContent = "レビュー 0件";
    return;
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  avgStarsEl.textContent = stars(Math.round(avg));
  avgTextEl.textContent = avg.toFixed(1) + " / 5";
  countEl.textContent = "レビュー " + reviews.length + "件";
}

function renderReviews(reviews) {
  renderSummary(reviews);
  itemsEl.replaceChildren();

  if (reviews.length === 0) {
    const p = document.createElement("p");
    p.textContent = "まだレビューがありません。最初のレビューを書いてみましょう。";
    itemsEl.appendChild(p);
    return;
  }

  reviews.forEach((r) => {
    const item = document.createElement("article");
    item.className = "rv-item";

    const head = document.createElement("div");
    head.className = "rv-head";

    const name = document.createElement("strong");
    name.textContent = r.nickname; // textContentなので、入力した文字がそのまま表示される
    head.appendChild(name);

    const rating = document.createElement("span");
    rating.className = "rv-stars";
    rating.textContent = stars(r.rating);
    rating.setAttribute("aria-label", "5段階中" + r.rating);
    head.appendChild(rating);

    const date = document.createElement("span");
    date.className = "rv-date";
    date.textContent = new Date(r.created_at).toLocaleDateString("ja-JP");
    head.appendChild(date);

    item.appendChild(head);

    const comment = document.createElement("p");
    comment.className = "rv-comment";
    comment.textContent = r.comment;
    item.appendChild(comment);

    if (r.image_path) {
      const img = document.createElement("img");
      img.className = "rv-photo";
      img.src = photoUrl(r.image_path);
      img.alt = r.nickname + "さんが作った料理の写真";
      img.loading = "lazy";
      item.appendChild(img);
    }

    // 自分の投稿にだけ、削除ボタンを出す
    if (currentUser && r.user_id === currentUser.id) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "rv-delete";
      del.textContent = "削除する";
      del.addEventListener("click", () => deleteReview(r));
      item.appendChild(del);
    }

    itemsEl.appendChild(item);
  });
}

// ----- データの取得・追加・削除 -----

async function loadReviews() {
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("recipe_key", recipeKey)
    .order("created_at", { ascending: false });

  if (error) {
    itemsEl.textContent = "レビューを読み込めませんでした。（" + error.message + "）";
    return;
  }
  renderReviews(data);
}

async function deleteReview(r) {
  if (!confirm("このレビューを削除しますか？")) return;

  const { error } = await db.from("reviews").delete().eq("id", r.id);
  if (error) {
    showMessage("削除できませんでした。（" + error.message + "）", "error");
    return;
  }
  if (r.image_path) await db.storage.from(BUCKET).remove([r.image_path]);
  showMessage("レビューを削除しました。", "success");
  loadReviews();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const nickname = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const file = photoInput.files[0];

  if (!nickname || !comment) {
    showMessage("お名前とコメントを入力してください。", "error");
    return;
  }
  if (file && !EXT[file.type]) {
    showMessage("JPEG・PNG・WebP・GIFの画像を選んでください。", "error");
    return;
  }
  if (file && file.size > MAX_SIZE) {
    showMessage("写真は5MBまでです。小さいサイズの写真を選んでください。", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("");

  // 写真があれば先に送る（保存先は「ユーザーID/日時-乱数.拡張子」）
  let path = null;
  if (file) {
    path =
      currentUser.id + "/" + Date.now() + "-" +
      Math.random().toString(36).slice(2, 8) + "." + EXT[file.type];

    const upload = await db.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    if (upload.error) {
      showMessage("写真を送れませんでした。（" + upload.error.message + "）", "error");
      submitButton.disabled = false;
      return;
    }
  }

  const { error } = await db.from("reviews").insert({
    recipe_key: recipeKey,
    nickname,
    rating: Number(ratingSelect.value),
    comment,
    image_path: path
  });

  if (error) {
    if (path) await db.storage.from(BUCKET).remove([path]); // 記録に失敗したら写真も消す
    showMessage("投稿できませんでした。（" + error.message + "）", "error");
  } else {
    const keepName = nameInput.value; // 次回も同じ名前を使えるように残す
    form.reset();
    nameInput.value = keepName;
    showMessage("レビューを投稿しました。", "success");
    loadReviews();
  }
  submitButton.disabled = false;
});

// ----- ログイン状態に合わせて表示を切り替える -----

db.auth.onAuthStateChange((event, session) => {
  const nextUser = session ? session.user : null;
  const changed = (nextUser && nextUser.id) !== (currentUser && currentUser.id);
  currentUser = nextUser;

  form.hidden = !currentUser;
  loginNote.hidden = !!currentUser;

  // コールバックの中で直接Supabaseを呼ぶと止まることがあるので、少し後に実行する
  if (changed || event === "INITIAL_SESSION") {
    setTimeout(loadReviews, 0);
  }
});