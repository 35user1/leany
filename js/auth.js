// 事前に js/script.js で db（Supabaseクライアント）が作られていることが前提です

const guestArea = document.getElementById("guest-area");
const userArea = document.getElementById("user-area");
const userEmail = document.getElementById("user-email");
const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordHint = document.getElementById("password-hint");
const showPassword = document.getElementById("show-password");
const submitButton = document.getElementById("submit-button");
const messageEl = document.getElementById("message");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const title = document.getElementById("auth-title");

let mode = "login"; // "login" か "signup"

// ----- 表示まわり -----

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.dataset.type = type || "";
  messageEl.hidden = !text;
}

function setMode(next) {
  mode = next;
  const isLogin = mode === "login";

  tabLogin.setAttribute("aria-selected", String(isLogin));
  tabSignup.setAttribute("aria-selected", String(!isLogin));
  title.textContent = isLogin ? "ログイン" : "新規登録";
  submitButton.textContent = isLogin ? "ログインする" : "登録する";
  passwordHint.hidden = isLogin;
  passwordInput.autocomplete = isLogin ? "current-password" : "new-password";
  showMessage("");
}

function showState(session) {
  const loggedIn = !!session;
  guestArea.hidden = loggedIn;
  userArea.hidden = !loggedIn;
  if (loggedIn) userEmail.textContent = session.user.email;
}

// Supabaseの英語エラーを、わかりやすい日本語にする
function toJapanese(error) {
  const m = (error && error.message) || "";
  if (m.includes("Invalid login credentials")) {
    return "メールアドレスかパスワードが違います。";
  }
  if (m.includes("Email not confirmed")) {
    return "メールアドレスの確認が済んでいません。届いたメールのリンクを開いてください。";
  }
  if (m.includes("already registered")) {
    return "このメールアドレスはすでに登録されています。ログインしてください。";
  }
  if (m.includes("at least 6")) {
    return "パスワードは6文字以上で入力してください。";
  }
  if (m.includes("rate limit")) {
    return "メールの送信回数が上限に達しました。しばらく待ってからもう一度お試しください。";
  }
  if (m.includes("invalid format") || m.includes("Unable to validate email")) {
    return "メールアドレスの形式を確認してください。";
  }
  return "うまくいきませんでした。（" + m + "）";
}

// ----- 操作 -----

tabLogin.addEventListener("click", () => setMode("login"));
tabSignup.addEventListener("click", () => setMode("signup"));

showPassword.addEventListener("change", () => {
  passwordInput.type = showPassword.checked ? "text" : "password";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("メールアドレスとパスワードを入力してください。", "error");
    return;
  }
  if (mode === "signup" && password.length < 6) {
    showMessage("パスワードは6文字以上で入力してください。", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("");

  if (mode === "login") {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) showMessage(toJapanese(error), "error");
    // 成功すると onAuthStateChange が呼ばれて、画面が切り替わります
  } else {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: location.origin + location.pathname }
    });

    if (error) {
      showMessage(toJapanese(error), "error");
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // メール確認がオンのとき、登録済みのアドレスだとこの形で返ってきます
      showMessage("このメールアドレスはすでに登録されています。ログインしてください。", "error");
    } else if (!data.session) {
      showMessage("確認メールを送りました。メール内のリンクを開くと登録が完了します。", "success");
    }
    // メール確認がオフなら、そのままログイン状態になります
  }

  submitButton.disabled = false;
});

document.getElementById("logout-button").addEventListener("click", async () => {
  await db.auth.signOut();
  setMode("login");
  showMessage("ログアウトしました。", "success");
});

// ログイン状態が変わるたびに（ページを開いた時にも）画面を切り替える
db.auth.onAuthStateChange((event, session) => {
  showState(session);
});