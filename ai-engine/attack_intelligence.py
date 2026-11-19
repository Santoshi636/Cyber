
import pandas as pd
import networkx as nx
import json

# Load analysed security events
data = pd.read_csv("analysis_results.csv")

# Select events with detected threats
suspicious_events = data[
    data["threat_type"] != "No Known Threat Detected"
]

# Create a graph
graph = nx.Graph()

for _, event in suspicious_events.iterrows():
    graph.add_node(
        event["event_id"],
        source_ip=event["source_ip"],
        threat_type=event["threat_type"],
        severity=event["severity"],
        failed_logins=int(event["failed_logins"]),
        login_attempts=int(event["login_attempts"])
    )

# Connect events with the same source IP
for i in range(len(suspicious_events)):
    for j in range(i + 1, len(suspicious_events)):
        event1 = suspicious_events.iloc[i]
        event2 = suspicious_events.iloc[j]

        if event1["source_ip"] == event2["source_ip"]:
            graph.add_edge(
                event1["event_id"],
                event2["event_id"]
            )

# Find related event groups
groups = list(nx.connected_components(graph))

intelligence_reports = []

for number, group in enumerate(groups, start=1):

    events = [graph.nodes[event_id] for event_id in group]

    if len(events) < 2:
        continue

    source_ip = events[0]["source_ip"]

    threats = sorted(set(
        event["threat_type"] for event in events
    ))

    highest_severity = max(
        events,
        key=lambda event: {
            "Low": 1,
            "Medium": 2,
            "High": 3,
            "Critical": 4
        }.get(event["severity"], 0)
    )["severity"]

    total_failed_logins = sum(
        event["failed_logins"] for event in events
    )

    total_login_attempts = sum(
        event["login_attempts"] for event in events
    )

    # Generate explanation
    explanation = (
        f"{len(events)} suspicious events were detected "
        f"from the same source IP address {source_ip}. "
        f"These events contain {total_failed_logins} failed "
        f"login attempts out of {total_login_attempts} "
        f"total login attempts. This pattern may indicate "
        f"a coordinated brute-force attack."
    )

    # Generate recommendations
    recommendations = [
        "Investigate the source IP address.",
        "Review authentication logs for affected accounts.",
        "Check whether any login attempts were successful."
    ]

    if total_failed_logins > 20:
        recommendations.append(
            "Consider temporary IP blocking after verification."
        )

    report = {
        "attack_group": number,
        "source_ip": source_ip,
        "related_events": sorted(list(group)),
        "possible_threats": threats,
        "severity": highest_severity,
        "total_events": len(events),
        "total_failed_logins": total_failed_logins,
        "explanation": explanation,
        "recommendations": recommendations
    }

    intelligence_reports.append(report)

# Save reports as JSON
with open("attack_intelligence.json", "w") as file:
    json.dump(intelligence_reports, file, indent=4)

# Display results
print("\nCYBERSENTINEL AI - ATTACK INTELLIGENCE")
print("---------------------------------------")

if not intelligence_reports:
    print("No connected suspicious attack groups found.")

for report in intelligence_reports:
    print("\nAttack Group:", report["attack_group"])
    print("Source IP:", report["source_ip"])
    print("Severity:", report["severity"])
    print("Explanation:", report["explanation"])

    print("\nRecommendations:")

    for recommendation in report["recommendations"]:
        print("-", recommendation)

print("\nIntelligence reports saved to attack_intelligence.json")