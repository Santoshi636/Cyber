
import pandas as pd
from sklearn.ensemble import IsolationForest

# Load security logs
data = pd.read_csv("datasets/sample_logs.csv")

# 1. Machine Learning Anomaly Detection
features = data[
    ["login_attempts", "failed_logins", "bytes_sent", "port"]
]

model = IsolationForest(
    contamination=0.3,
    random_state=42
)

data["anomaly_result"] = model.fit_predict(features)

data["anomaly_status"] = data["anomaly_result"].map({
    1: "Normal",
    -1: "Unusual"
})

# 2. Threat Detection
def detect_threat(row):
    if row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
        return "Possible Brute Force Attack"

    elif row["bytes_sent"] > 5000:
        return "Unusually High Data Transfer"

    return "No Known Threat Detected"

data["threat_type"] = data.apply(detect_threat, axis=1)

# 3. Severity Detection
def check_severity(row):
    if row["login_attempts"] >= 30 and row["failed_logins"] >= 25:
        return "Critical"

    elif row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
        return "High"

    elif row["login_attempts"] >= 5 and row["failed_logins"] >= 3:
        return "Medium"

    return "Low"

data["severity"] = data.apply(check_severity, axis=1)

# 4. Generate explanation
def generate_reason(row):
    if row["threat_type"] == "Possible Brute Force Attack":
        return (
            f'{row["failed_logins"]} failed login attempts '
            f'out of {row["login_attempts"]} attempts'
        )

    elif row["threat_type"] == "Unusually High Data Transfer":
        return "Unusually high amount of data transferred"

    elif row["anomaly_status"] == "Unusual":
        return "Machine learning detected an unusual pattern"

    return "No suspicious behaviour identified by current checks"

data["reason"] = data.apply(generate_reason, axis=1)

# 5. Display combined results
print("\n===== CYBERSENTINEL AI =====")
print("COMBINED SECURITY ANALYSIS\n")

columns = [
    "event_id",
    "anomaly_status",
    "threat_type",
    "severity",
    "reason"
]

print(data[columns].to_string(index=False))

# Save results
data.to_csv("analysis_results.csv", index=False)

print("\nAnalysis completed!")
print("Results saved to analysis_results.csv")
