import sqlite3

DB_PATH = "memory.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        role TEXT,
        message TEXT
    )
    """)

    conn.commit()
    conn.close()


def add_message(user_id, role, message):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO messages (user_id, role, message) VALUES (?, ?, ?)",
        (user_id, role, message)
    )

    conn.commit()
    conn.close()


def get_history(user_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT role, message FROM messages WHERE user_id=? ORDER BY id ASC",
        (user_id,)
    )

    rows = cur.fetchall()
    conn.close()

    # FIXED FORMAT for Groq/OpenAI
    return [{"role": r, "content": m} for r, m in rows]