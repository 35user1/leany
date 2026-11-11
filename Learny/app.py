from pathlib import Path
import sqlite3
from flask import Flask, abort, jsonify, render_template, request
from recipes import RECIPES

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'reviews.db'
app = Flask(__name__)


def db_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with db_connection() as db:
        db.execute('''CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id TEXT NOT NULL,
            name TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            comment TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours'))
        )''')
        db.execute('CREATE INDEX IF NOT EXISTS idx_reviews_recipe ON reviews(recipe_id)')


@app.route('/')
def home():
    featured = [RECIPES[key] | {'id': key} for key in ['tomato-pasta', 'tamagoyaki', 'roll-cabbage']]
    return render_template('index.html', featured=featured)


@app.route('/recipes4')
def recipes4():
    return render_template('recipes4.html', recipes=RECIPES)


@app.route('/recipe/<recipe_id>')
def recipe_detail(recipe_id):
    recipe = RECIPES.get(recipe_id)
    if recipe is None:
        abort(404)
    return render_template('recipe.html', recipe=recipe, recipe_id=recipe_id)


@app.get('/api/recipes/<recipe_id>/reviews')
def get_reviews(recipe_id):
    if recipe_id not in RECIPES:
        abort(404)
    with db_connection() as db:
        rows = db.execute('SELECT id, name, rating, comment, created_at FROM reviews WHERE recipe_id=? ORDER BY id DESC', (recipe_id,)).fetchall()
    reviews = [dict(row) for row in rows]
    count = len(reviews)
    average = round(sum(r['rating'] for r in reviews) / count, 1) if count else 0
    return jsonify({'reviews': reviews, 'count': count, 'average': average})


@app.post('/api/recipes/<recipe_id>/reviews')
def add_review(recipe_id):
    if recipe_id not in RECIPES:
        abort(404)
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'JSON形式で送信してください。'}), 400
    name = data.get('name')
    comment = data.get('comment')
    rating = data.get('rating')
    if not isinstance(name, str) or not isinstance(comment, str) or not isinstance(rating, int) or isinstance(rating, bool):
        return jsonify({'error': '入力内容を確認してください。'}), 400
    name, comment = name.strip(), comment.strip()
    if not 1 <= len(name) <= 30 or not 1 <= len(comment) <= 1000 or not 1 <= rating <= 5:
        return jsonify({'error': '名前は30文字以内、コメントは1000文字以内、評価は1〜5にしてください。'}), 400
    with db_connection() as db:
        db.execute('INSERT INTO reviews (recipe_id, name, rating, comment) VALUES (?, ?, ?, ?)', (recipe_id, name, rating, comment))
    return jsonify({'message': 'レビューを保存しました！'}), 201


init_db()

if __name__ == '__main__':
    app.run(debug=True)
