import random
from datetime import datetime, timedelta
from faker import Faker
try:
    from .database import get_db_connection, init_db
except ImportError:
    from database import get_db_connection, init_db

fake = Faker('en_IN')
random.seed(42)

STATE_MAP = [
    ("Delhi", "DL", ["New Delhi", "South Delhi", "North Delhi", "East Delhi"]),
    ("Maharashtra", "MH", ["Mumbai City", "Navi Mumbai", "Thane", "Pune"]),
    ("Karnataka", "KA", ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru"]),
    ("Uttar Pradesh", "UP", ["Gautam Buddha Nagar", "Ghaziabad", "Lucknow", "Kanpur"]),
    ("Haryana", "HR", ["Gurugram", "Faridabad", "Nuh", "Panipat"]),
    ("Telangana", "TS", ["Hyderabad", "Ranga Reddy", "Medchal", "Secunderabad"]),
    ("West Bengal", "WB", ["Kolkata", "Howrah", "North 24 Parganas", "Durgapur"]),
    ("Tamil Nadu", "TN", ["Chennai", "Coimbatore", "Madurai", "Salem"]),
    ("Rajasthan", "RJ", ["Jaipur", "Jodhpur", "Udaipur", "Kota"]),
    ("Gujarat", "GJ", ["Ahmedabad", "Surat", "Vadodara", "Rajkot"])
]

FRAUD_CATEGORIES = [
    "Digital Arrest Scam",
    "Part-Time Job Fraud",
    "UPI Phishing",
    "ATM Cash Layering",
    "Investment Fraud",
    "KYC Update Scam"
]

BANKS = ["SBI", "HDFC", "ICICI", "PNB", "Axis"]

STATUSES = [
    "New",
    "Under Investigation",
    "Escalated",
    "Resolved"
]

CLUSTERS = [
    {"name": "NCR Cluster", "lat": 28.6139, "lng": 77.2090, "state_idx": 0},
    {"name": "Mumbai Cluster", "lat": 19.0760, "lng": 72.8777, "state_idx": 1},
    {"name": "Bengaluru Cluster", "lat": 12.9716, "lng": 77.5946, "state_idx": 2},
    {"name": "Kolkata Cluster", "lat": 22.5726, "lng": 88.3639, "state_idx": 6},
    {"name": "Hyderabad Cluster", "lat": 17.3850, "lng": 78.4867, "state_idx": 5}
]

SYNDICATES = [
    "Mewat Grid-04 (Digital Arrest)",
    "Jamtara Cyber Cell-09",
    "Alwar Syndicate Grid",
    "Noida Tech Park Module",
    "Bengaluru Mule Network",
    "Cyberabad Phishing Cell"
]

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM complaints;")
    count = cursor.fetchone()[0]
    if count >= 150:
        print(f"Database already seeded with {count} complaints.")
        conn.close()
        return

    # Clear table to ensure fresh 150 realistic rows
    cursor.execute("DELETE FROM complaints;")

    now = datetime.now()
    records = []
    used_case_refs = set()

    for i in range(150):
        # Pick geographic cluster
        cluster = CLUSTERS[i % len(CLUSTERS)]
        state_name, state_code, districts = STATE_MAP[cluster["state_idx"]]
        district = random.choice(districts)

        # 5-digit number
        num = random.randint(10000, 99999)
        case_ref = f"I4C/2026/{state_code}/{num}"
        while case_ref in used_case_refs:
            num = random.randint(10000, 99999)
            case_ref = f"I4C/2026/{state_code}/{num}"
        used_case_refs.add(case_ref)

        # Date time in last 30 days
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        dt = now - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
        date_time_str = dt.strftime("%Y-%m-%d %H:%M:%S")

        fraud_category = random.choice(FRAUD_CATEGORIES)
        bank = random.choice(BANKS)
        status = random.choice(STATUSES)
        
        # Dense gaussian offset around cluster centroid
        w_lat = cluster["lat"] + random.gauss(0, 0.04)
        w_lng = cluster["lng"] + random.gauss(0, 0.04)
        v_lat = w_lat + random.uniform(-0.1, 0.1)
        v_lng = w_lng + random.uniform(-0.1, 0.1)

        delay_hours = round(random.gauss(4.5, 1.8), 1)
        if delay_hours < 0.5:
            delay_hours = 0.5

        risk_score = random.randint(45, 98)
        victim_amount = round(random.uniform(25000, 1500000), 2)
        account_ref = f"ACC{random.randint(100000000, 999999999)}"
        mule_branch_city = f"{district} Central"
        atm_target_location = f"{district} Commercial ATM #{random.randint(10, 99)}"
        
        # Predicted time window representation
        window_start = dt + timedelta(hours=delay_hours)
        window_end = window_start + timedelta(hours=1.5)
        predicted_window = f"{window_start.strftime('%H:%M')} - {window_end.strftime('%H:%M')} IST"

        linked_imei = f"86429{random.randint(1000000000, 9999999999)}"
        ip_address = f"{random.randint(49, 185)}.{random.randint(10, 200)}.{random.randint(1, 250)}.{random.randint(1, 250)}"
        syndicate = random.choice(SYNDICATES)

        records.append((
            case_ref,
            date_time_str,
            fraud_category,
            state_name,
            district,
            account_ref,
            risk_score,
            status,
            round(v_lat, 6),
            round(v_lng, 6),
            round(w_lat, 6),
            round(w_lng, 6),
            delay_hours,
            bank,
            victim_amount,
            mule_branch_city,
            atm_target_location,
            predicted_window,
            linked_imei,
            ip_address,
            syndicate
        ))

    cursor.executemany("""
    INSERT INTO complaints (
        case_reference_no, date_time, fraud_category, state_ut, district,
        linked_account_reference, risk_score, status, victim_lat, victim_lng,
        withdrawal_lat, withdrawal_lng, withdrawal_delay_hours, bank_name,
        victim_amount, mule_branch_city, atm_target_location, predicted_time_window,
        linked_imei, ip_address, associated_syndicate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, records)

    conn.commit()
    print(f"Successfully seeded {len(records)} complaint rows into database.")
    conn.close()

if __name__ == "__main__":
    seed_database()
