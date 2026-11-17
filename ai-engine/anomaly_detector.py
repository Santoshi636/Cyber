
import pandas as pd
from sklearn.ensemble import IsolationForest

# Load security logs
data = pd.read_csv("datasets/sample_logs.csv")

# Select numerical features
features = data[
    ["login_attempts", "failed_logins", "bytes_sent", "port"]
]

# Create Isolation Forest model
model = IsolationForest(
    contamination=0.3,
    random_state=42
)

# Train and detect anomalies
data["anomaly_result"] = model.fit_predict(features)

# Convert results into readable labels
data["status"] = data["anomaly_result"].map({
    1: "Normal",
    -1: "Suspicious"
})

# Display results
print("\nCYBERSENTINEL AI - ANOMALY DETECTION")
print(data[["event_id", "login_attempts", "failed_logins", "status"]])

# Count results
print("\nDetection Summary:")
print(data["status"].value_counts())
