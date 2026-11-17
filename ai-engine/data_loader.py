
import pandas as pd

# Load cybersecurity logs
data = pd.read_csv("datasets/sample_logs.csv")

# Display the first 5 records
print("CYBERSENTINEL AI - SECURITY LOGS")
print(data.head())

# Display dataset information
print("\nDataset Information:")
print(data.info())

# Check for missing values
print("\nMissing Values:")
print(data.isnull().sum())
