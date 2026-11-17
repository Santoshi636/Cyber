
import pandas as pd
import networkx as nx

# Load security analysis results
data = pd.read_csv("analysis_results.csv")

# Create an attack relationship graph
graph = nx.Graph()

# Add security events as nodes
for _, event in data.iterrows():
    graph.add_node(
        event["event_id"],
        source_ip=event["source_ip"],
        anomaly_status=event["anomaly_status"],
        threat_type=event["threat_type"],
        severity=event["severity"]
    )

# Connect events with the same source IP
for i in range(len(data)):
    for j in range(i + 1, len(data)):
        if data.iloc[i]["source_ip"] == data.iloc[j]["source_ip"]:
            graph.add_edge(
                data.iloc[i]["event_id"],
                data.iloc[j]["event_id"],
                relationship="Same Source IP"
            )

print("\nCYBERSENTINEL AI - ATTACK CORRELATION")
print("--------------------------------------")

print("Total Events:", graph.number_of_nodes())
print("Connected Relationships:", graph.number_of_edges())

print("\nConnected Events:")

if graph.number_of_edges() == 0:
    print("No related events found.")
else:
    for edge in graph.edges(data=True):
        print(
            edge[0], "<-->", edge[1],
            "|", edge[2]["relationship"]
        )
