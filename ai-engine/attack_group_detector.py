
import pandas as pd
import networkx as nx

data = pd.read_csv("analysis_results.csv")

suspicious_events = data[
    data["threat_type"] != "No Known Threat Detected"
]

graph = nx.Graph()

for _, event in suspicious_events.iterrows():
    graph.add_node(
        event["event_id"],
        source_ip=event["source_ip"],
        threat_type=event["threat_type"],
        severity=event["severity"],
        failed_logins=event["failed_logins"]
    )

for i in range(len(suspicious_events)):
    for j in range(i + 1, len(suspicious_events)):
        event1 = suspicious_events.iloc[i]
        event2 = suspicious_events.iloc[j]

        if event1["source_ip"] == event2["source_ip"]:
            graph.add_edge(
                event1["event_id"],
                event2["event_id"]
            )

groups = list(nx.connected_components(graph))

severity_rank = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4
}

print("\nCYBERSENTINEL AI - ATTACK GROUP RISK ANALYSIS")
print("------------------------------------------------")

group_number = 0

for group in groups:
    if len(group) > 1:
        group_number += 1

        events = [graph.nodes[event_id] for event_id in group]

        highest_severity = max(
            events,
            key=lambda event: severity_rank.get(event["severity"], 0)
        )["severity"]

        total_failed_logins = sum(
            event["failed_logins"] for event in events
        )

        # Calculate group risk score
        severity_score = severity_rank[highest_severity] * 15
        event_score = min(len(group) * 10, 30)
        login_score = min(total_failed_logins, 40)

        risk_score = min(
            severity_score + event_score + login_score,
            100
        )

        if risk_score >= 80:
            risk_level = "Critical"
        elif risk_score >= 60:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        source_ip = events[0]["source_ip"]

        print(f"\nAttack Group {group_number}")
        print("Source IP:", source_ip)
        print("Total Events:", len(group))
        print("Highest Severity:", highest_severity)
        print("Total Failed Logins:", total_failed_logins)
        print("Risk Score:", risk_score, "/ 100")
        print("Risk Level:", risk_level)

        print("Related Events:", ", ".join(sorted(group)))

if group_number == 0:
    print("No connected suspicious attack groups found.")
