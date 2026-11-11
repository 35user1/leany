// ヘッダーの右上に「ログイン中か、そうでないか」を表示する（全ページ共通）
// 前提：supabase-client.js を先に読み込んでいること（db が使える）
// 使い方：ヘッダーに <div id="auth-status" data-auth-url="auth.html"></div> を置く
//   ・data-auth-url … そのページから見た auth.html の場所（recipe/ のページなら ../auth.html）

(function () {
  const box = document.getElementById("auth-status");
  if (!box) return;

  if (typeof db === "undefined") {
    console.warn("auth-status: db が見つかりません。supabase-client.js の読み込み順を確認してください。");
    return;
  }

  const authUrl = box.dataset.authUrl || "auth.html";

  function showLoggedOut() {
    const link = document.createElement("a");
    link.className = "auth-status-link";
    link.href = authUrl;
    link.textContent = "ログイン";
    box.replaceChildren(link);
  }

  function showLoggedIn(user) {
    const badge = document.createElement("span");
    badge.className = "auth-status-badge";
    badge.textContent = "ログイン中";
    badge.title = user.email || "";

    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "auth-status-logout";
    logout.textContent = "ログアウト";
    logout.addEventListener("click", () => {
      db.auth.signOut(); // 完了すると下の onAuthStateChange が呼ばれて表示が戻る
    });

    box.replaceChildren(badge, logout);
  }

  // ページを開いた時と、ログイン／ログアウトした時に呼ばれる
  db.auth.onAuthStateChange((event, session) => {
    if (session) showLoggedIn(session.user);
    else showLoggedOut();
  });
})();
