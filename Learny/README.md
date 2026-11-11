# Learny（Flask + SQLite）

## セットアップ（Windows / VSCode）
1. Pythonをインストール: https://www.python.org/downloads/windows/
2. ZIPを展開して、`Learny` フォルダをVSCodeで開く。
3. VSCodeのターミナルで `py -m pip install flask` を実行（`py` が使えなければ `python -m pip install flask`）。
4. `py app.py` を実行（`py` が使えなければ `python app.py`）。
5. ブラウザで http://127.0.0.1:5000/ を開く。停止するときは Ctrl+C。

## ページ
- `/` ホーム
- `/recipes4` 食材4つ以内のレシピ一覧（30件）
- `/recipe/egg-udon` 卵焼きうどんの詳細
- `/recipe/oyakodon` 親子丼の詳細

## 編集
- 料理名・材料・作り方: `recipes.py`
- デザイン: `static/css/style.css`
- ホームの動き: `static/js/script.js`
- レビューの表示・投稿: `static/js/review.js`
- 写真: `static/images/` に `recipes.py` の `image` と同じファイル名で配置。画像がなくても絵文字で代替表示。
- ライオン: `static/images/lion.jpg`
- ファビコン: `static/images/キャラデザ（ファビコン用）.png`

## レビュー
SQLiteの `reviews.db` が初回起動時に自動生成されます。各レビューは `recipe_id` と紐づくので、ほかの料理に混ざりません。別の端末から同じFlaskサーバーにアクセスすれば同じレビューを閲覧できますが、**自分のPCで動かしただけではインターネットに公開されません**。公開にはサーバーへのデプロイが必要です。

※ このコードは学習用の基本構成です。一般公開する際は、投稿の連投対策、管理・削除機能、運用環境での `debug=False`、バックアップなどを追加してください。
※ 材料は「主要な食材・調味料を合わせて4項目以内」で登録したサンプルです。ごはんを別途使うレシピなどは、必要に応じて材料の数え方を調整してください。
