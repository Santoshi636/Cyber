
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
        severity=event["severity"]
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

print("\nCYBERSENTINEL AI - ATTACK GROUP ANALYSIS")
print("-----------------------------------------")

group_number = 0

for group in groups:
    if len(group) > 1:
        group_number += 1

        events = [graph.nodes[event_id] for event_id in group]

        highest_severity = max(
            events,
            key=lambda event: severity_rank.get(
                event["severity"], 0
            )
        )["severity"]

        source_ip = events[0]["source_ip"]

        threats = sorted(set(
            event["threat_type"] for event in events
        ))

        print(f"\nAttack Group {group_number}")
        print("Total Events:", len(group))
        print("Source IP:", source_ip)
        print("Group Severity:", highest_severity)
        print("Possible Threats:", ", ".join(threats))

        print(
            "Explanation:",
            f"{len(group)} suspicious events share the same",
            f"source IP ({source_ip}).",
            "This may indicate coordinated suspicious activity."
        )

        print("Related Events:", ", ".join(sorted(group)))

if group_number == 0:
    print("No connected suspicious attack groups found.")
