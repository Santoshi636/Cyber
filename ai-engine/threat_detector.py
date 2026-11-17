
import pandas as pd

# Load security logs
data = pd.read_csv("datasets/sample_logs.csv")

# Function to identify possible threats
def detect_threat(row):

    if row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
        return "Possible Brute Force Attack"

    elif row["bytes_sent"] > 5000:
        return "Unusually High Data Transfer"

    else:
        return "No Known Threat Detected"


# Apply threat detection
data["threat_type"] = data.apply(detect_threat, axis=1)

# Display results
print("\nCYBERSENTINEL AI - THREAT DETECTION")

print(data[[
    "event_id",
    "login_attempts",
    "failed_logins",
    "threat_type"
]].to_string(index=False))

# Detection summary
print("\nThreat Summary:")
print(data["threat_type"].value_counts())