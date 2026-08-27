import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "intelligence.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_reference_no TEXT UNIQUE NOT NULL,
        date_time TEXT NOT NULL,
        fraud_category TEXT NOT NULL,
        state_ut TEXT NOT NULL,
        district TEXT,
        linked_account_reference TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        victim_lat REAL NOT NULL,
        victim_lng REAL NOT NULL,
        withdrawal_lat REAL NOT NULL,
        withdrawal_lng REAL NOT NULL,
        withdrawal_delay_hours REAL NOT NULL,
        bank_name TEXT NOT NULL,
        victim_amount REAL DEFAULT 0,
        mule_branch_city TEXT,
        atm_target_location TEXT,
        predicted_time_window TEXT,
        linked_imei TEXT,
        ip_address TEXT,
        associated_syndicate TEXT
    );
    """)
    conn.commit()
    conn.close()
