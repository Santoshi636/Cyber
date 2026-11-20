
import pandas as pd
from sklearn.ensemble import IsolationForest
from pathlib import Path


def analyze_logs(logs):

    # Load baseline dataset for anomaly detection
    dataset_path = Path(__file__).parent / "datasets" / "sample_logs.csv"
    baseline = pd.read_csv(dataset_path)

    features = [
        "login_attempts",
        "failed_logins",
        "bytes_sent",
        "port"
    ]

    # Prepare incoming logs
    data = pd.DataFrame(logs)

    # Check whether required AI fields are available
    for feature in features:
        if feature not in data.columns:
            raise ValueError(f"Missing required field: {feature}")

    if data[features].isnull().any().any():
        raise ValueError("AI feature fields cannot contain null values.")

    # Train anomaly detection model on baseline data
    model = IsolationForest(
        contamination=0.3,
        random_state=42
    )

    model.fit(baseline[features])

    # Analyse incoming logs
    predictions = model.predict(data[features])

    results = []

    for index, row in data.iterrows():

        anomaly_status = (
            "Normal" if predictions[index] == 1
            else "Unusual"
        )

        # Threat detection
        if row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
            threat_type = "Possible Brute Force Attack"

        elif row["bytes_sent"] > 5000:
            threat_type = "Unusually High Data Transfer"

        else:
            threat_type = "No Known Threat Detected"

        # Severity classification
        if row["login_attempts"] >= 30 and row["failed_logins"] >= 25:
            severity = "Critical"

        elif row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
            severity = "High"

        elif row["login_attempts"] >= 5 and row["failed_logins"] >= 3:
            severity = "Medium"

        else:
            severity = "Low"

        # Explanation
        if threat_type == "Possible Brute Force Attack":
            explanation = (
                f'{int(row["failed_logins"])} failed login attempts '
                f'out of {int(row["login_attempts"])} attempts'
            )

        elif threat_type == "Unusually High Data Transfer":
            explanation = "Unusually high amount of data transferred"

        elif anomaly_status == "Unusual":
            explanation = "Machine learning detected an unusual pattern"

        else:
            explanation = "No suspicious behaviour identified by current checks"

        # Risk scoring (heuristic, not probability)
        severity_scores = {
            "Low": 10,
            "Medium": 30,
            "High": 50,
            "Critical": 70
        }

        risk_score = severity_scores[severity]

        if anomaly_status == "Unusual":
            risk_score += 10

        if threat_type != "No Known Threat Detected":
            risk_score += 15

        if row["failed_logins"] >= 20:
            risk_score += 15

        risk_score = min(risk_score, 100)

        # Security recommendations
        recommendations = []

        if threat_type == "Possible Brute Force Attack":
            recommendations.extend([
                "Investigate the source IP address.",
                "Review authentication logs.",
                "Check whether any login attempts were successful."
            ])

        elif threat_type == "Unusually High Data Transfer":
            recommendations.extend([
                "Investigate the unusual data transfer.",
                "Review network traffic logs."
            ])

        if anomaly_status == "Unusual":
            recommendations.append(
                "Investigate the unusual activity pattern."
            )

        if not recommendations:
            recommendations.append(
                "Continue monitoring for suspicious activity."
            )

        results.append({
            "event_id": row.get("event_id", row.get("eventId", "Unknown")),
            "source_ip": row.get("source_ip", row.get("sourceIp")),
            "destination_ip": row.get("destination_ip", row.get("destinationIp")),
            "anomaly_status": anomaly_status,
            "threat_type": threat_type,
            "severity": severity,
            "risk_score": risk_score,
            "explanation": explanation,
            "recommendations": recommendations
        })

        return results 