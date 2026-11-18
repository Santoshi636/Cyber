
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

# Load analysed security events
data = pd.read_csv("analysis_results.csv")

# Select suspicious events
suspicious_events = data[
    data["threat_type"] != "No Known Threat Detected"
]

# Create graph
graph = nx.Graph()

for _, event in suspicious_events.iterrows():
    graph.add_node(
        event["event_id"],
        source_ip=event["source_ip"],
        severity=event["severity"]
    )

# Connect events sharing the same source IP
for i in range(len(suspicious_events)):
    for j in range(i + 1, len(suspicious_events)):
        event1 = suspicious_events.iloc[i]
        event2 = suspicious_events.iloc[j]

        if event1["source_ip"] == event2["source_ip"]:
            graph.add_edge(
                event1["event_id"],
                event2["event_id"]
            )

# Severity colours
severity_colors = {
    "Low": "#22C55E",
    "Medium": "#EAB308",
    "High": "#F97316",
    "Critical": "#EF4444"
}

node_colors = [
    severity_colors.get(
        graph.nodes[node]["severity"], "#94A3B8"
    )
    for node in graph.nodes()
]

# Dark cybersecurity theme
plt.figure(figsize=(12, 8))
ax = plt.gca()
ax.set_facecolor("#0B1120")
plt.gcf().set_facecolor("#0B1120")

# Graph layout
positions = nx.spring_layout(graph, seed=42)

# Draw connections
nx.draw_networkx_edges(
    graph,
    positions,
    edge_color="#38BDF8",
    width=2.5,
    alpha=0.8
)

# Draw event nodes
nx.draw_networkx_nodes(
    graph,
    positions,
    node_color=node_colors,
    node_size=3000,
    edgecolors="white",
    linewidths=1.5
)

# Event labels
nx.draw_networkx_labels(
    graph,
    positions,
    font_color="white",
    font_size=11,
    font_weight="bold"
)

# Title
plt.title(
    "CYBERSENTINEL AI | ATTACK RELATIONSHIP GRAPH",
    color="white",
    fontsize=15,
    fontweight="bold",
    pad=25
)

# Severity legend
legend_items = [
    Patch(facecolor="#22C55E", label="Low"),
    Patch(facecolor="#EAB308", label="Medium"),
    Patch(facecolor="#F97316", label="High"),
    Patch(facecolor="#EF4444", label="Critical")
]

legend = plt.legend(
    handles=legend_items,
    loc="upper right",
    title="Threat Severity",
    facecolor="#1E293B",
    edgecolor="white"
)

legend.get_title().set_color("white")

for label in legend.get_texts():
    label.set_color("white")

# Source IP information
source_ip = (
    suspicious_events["source_ip"].mode().iloc[0]
    if not suspicious_events.empty else "None"
)

plt.figtext(
    0.5, 0.03,
    f"Shared Source IP: {source_ip} | "
    f"Suspicious Events: {len(suspicious_events)}",
    ha="center",
    color="#38BDF8",
    fontsize=11
)

plt.axis("off")
plt.tight_layout()

# Save image
plt.savefig(
    "attack_graph.png",
    dpi=300,
    bbox_inches="tight",
    facecolor="#0B1120"
)

plt.show()

print("Professional attack graph generated!")
print("Saved as attack_graph.png")