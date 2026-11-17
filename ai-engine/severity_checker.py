
import pandas as pd

data = pd.read_csv("datasets/sample_logs.csv")

def check_severity(row):

    if row["login_attempts"] >= 30 and row["failed_logins"] >= 25:
        return "Critical"

    elif row["login_attempts"] >= 10 and row["failed_logins"] >= 8:
        return "High"

    elif row["login_attempts"] >= 5 and row["failed_logins"] >= 3:
        return "Medium"

    else:
        return "Low"


data["severity"] = data.apply(check_severity, axis=1)

print("\nCYBERSENTINEL AI - SEVERITY ANALYSIS")

print(data[[
    "event_id",
    "login_attempts",
    "failed_logins",
    "severity"
]].to_string(index=False))

print("\nSeverity Summary:")
print(data["severity"].value_counts())