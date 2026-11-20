import { useState } from "react";

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [activeRole, setActiveRole] = useState("Analyst");
  const [selectedFile, setSelectedFile] = useState(null);

  const alerts = [
    {
      event: "Multiple Failed Login Attempts",
      source: "192.168.1.105",
      severity: "Critical",
      time: "10:42 AM",
      explanation: "Several unsuccessful login attempts were detected from the same IP address.",
    },
    {
      event: "Unusual Network Traffic",
      source: "10.0.0.24",
      severity: "High",
      time: "10:35 AM",
      explanation: "Network traffic was higher than the normal activity pattern.",
    },
    {
      event: "Suspicious Login Location",
      source: "172.16.0.12",
      severity: "Medium",
      time: "10:20 AM",
      explanation: "A login was detected from an unusual location.",
    },
    {
      event: "Port Scanning Detected",
      source: "192.168.1.220",
      severity: "High",
      time: "09:55 AM",
      explanation: "Multiple network ports were accessed in a short period.",
    },
  ];

  const stats = [
    {
      title: "Total Security Events",
      value: "12,458",
      change: "+12.5%",
      icon: "📊",
      color: "text-cyan-400",
    },
    {
      title: "Threats Detected",
      value: "248",
      change: "+8.2%",
      icon: "🛡️",
      color: "text-red-400",
    },
    {
      title: "Critical Alerts",
      value: "18",
      change: "Needs attention",
      icon: "🚨",
      color: "text-orange-400",
    },
    {
      title: "Systems Monitored",
      value: "36",
      change: "All systems online",
      icon: "💻",
      color: "text-green-400",
    },
  ];

  const timeline = [
    {
      time: "10:20 AM",
      event: "Unusual Login",
      color: "text-yellow-400",
    },
    {
      time: "10:25 AM",
      event: "Multiple Failed Attempts",
      color: "text-orange-400",
    },
    {
      time: "10:35 AM",
      event: "Suspicious Network Traffic",
      color: "text-red-400",
    },
    {
      time: "10:42 AM",
      event: "Critical Alert Generated",
      color: "text-red-400",
    },
  ];

  // Different sidebar menus for each role
  const navigation =
    activeRole === "Admin"
      ? [
          "Overview",
          "Live Alerts",
          "User Management",
          "Settings",
        ]
      : [
          "Overview",
          "Live Alerts",
          "Upload Logs",
          "Attack Timeline",
          "Threat Analysis",
          "Settings",
        ];

  // Change role and reset page
  const changeRole = (role) => {
    setActiveRole(role);
    setActivePage("Overview");
  };

  // Severity badge
  const severityStyle = (severity) => {
    if (severity === "Critical") {
      return "bg-red-500/15 text-red-400";
    }

    if (severity === "High") {
      return "bg-orange-500/15 text-orange-400";
    }

    return "bg-yellow-500/15 text-yellow-400";
  };

  // Reusable alert table
  const AlertTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[550px]">
        <thead>
          <tr className="text-xs text-slate-500 border-b border-slate-800">
            <th className="pb-4">EVENT</th>
            <th className="pb-4">SOURCE IP</th>
            <th className="pb-4">SEVERITY</th>
            <th className="pb-4">TIME</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert) => (
            <tr
              key={alert.event}
              className="border-b border-slate-800/70 text-sm"
            >
              <td className="py-5 pr-3">
                {alert.event}
              </td>

              <td className="py-5 text-slate-400">
                {alert.source}
              </td>

              <td className="py-5">
                <span
                  className={`px-2 py-1 rounded-md text-xs ${severityStyle(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </td>

              <td className="py-5 text-slate-400">
                {alert.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}

      <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-5 flex flex-col shrink-0">

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-cyan-500 rounded-xl p-3 text-xl">
            🛡️
          </div>

          <div>
            <h1 className="font-bold text-lg">
              CyberSentinel
            </h1>

            <p className="text-xs text-slate-400">
              AI Security Platform
            </p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
          Main Menu
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition ${
                activePage === item
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item === "Overview" && "📊 "}
              {item === "Live Alerts" && "🚨 "}
              {item === "Upload Logs" && "📁 "}
              {item === "Attack Timeline" && "🕒 "}
              {item === "Threat Analysis" && "🧠 "}
              {item === "User Management" && "👥 "}
              {item === "Settings" && "⚙️ "}
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-slate-800 rounded-xl p-4">
          <p className="text-sm font-semibold text-green-400">
            ● System Online
          </p>

          <p className="text-xs text-slate-400 mt-2">
            Cyber monitoring is ready.
          </p>
        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0 p-5 md:p-8">

        {/* HEADER */}

        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <div>
            <h2 className="text-2xl font-bold">
              {activePage}
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Welcome to your cybersecurity command center.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm">
              🟢 Monitoring Active
            </div>

            <select
              value={activeRole}
              onChange={(e) => changeRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-400 outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
            </select>

            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
              {activeRole === "Admin" ? "A" : "G"}
            </div>

          </div>

        </header>

        {/* OVERVIEW PAGE */}

        {activePage === "Overview" && (
          <>

            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 transition"
                >

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-400">
                      {stat.title}
                    </p>

                    <span className="text-2xl">
                      {stat.icon}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold mt-5">
                    {stat.value}
                  </h3>

                  <p className={`text-xs mt-3 ${stat.color}`}>
                    {stat.change}
                  </p>

                </div>
              ))}

            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">

              {/* RECENT ALERTS */}

              <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg">
                      Recent Security Alerts
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Example security events for demonstration
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePage("Live Alerts")}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    View all →
                  </button>
                </div>

                <AlertTable />

              </div>

              {/* ATTACK TIMELINE */}

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                <h3 className="font-bold text-lg mb-2">
                  Attack Timeline
                </h3>

                <p className="text-xs text-slate-400 mb-6">
                  Example sequence of suspicious events
                </p>

                <div className="space-y-6">

                  {timeline.map((event, index) => (
                    <div
                      key={event.time}
                      className="flex gap-4"
                    >

                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-cyan-400" />

                        {index !== timeline.length - 1 && (
                          <div className="w-px h-12 bg-slate-700" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          {event.time}
                        </p>

                        <p className={`text-sm font-medium mt-1 ${event.color}`}>
                          {event.event}
                        </p>
                      </div>

                    </div>
                  ))}

                </div>

                <button
                  onClick={() => setActivePage("Attack Timeline")}
                  className="mt-5 w-full bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-300 hover:bg-cyan-500/20"
                >
                  Explore Attack Timeline →
                </button>

              </div>

            </section>

          </>
        )}

        {/* LIVE ALERTS PAGE */}

        {activePage === "Live Alerts" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              Live Security Alerts
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              Monitor suspicious security events and possible threats.
            </p>

            <AlertTable />

            <p className="text-xs text-slate-500 mt-5">
              Demo alert data. Real-time monitoring will be connected through Socket.IO.
            </p>

          </section>
        )}

        {/* UPLOAD LOGS PAGE */}

        {activePage === "Upload Logs" && activeRole === "Analyst" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-8">

            <h3 className="text-xl font-bold text-cyan-400">
              Upload Security Logs
            </h3>

            <p className="text-sm text-slate-400 mt-3 mb-6">
              Select a security log file for threat investigation.
            </p>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center">

              <div className="text-5xl mb-4">
                📁
              </div>

              <p className="text-white mb-3">
                Choose your security log file
              </p>

              <input
                type="file"
                accept=".log,.txt,.csv,.json"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="block w-full max-w-sm mx-auto text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-slate-950 file:font-semibold"
              />

              {selectedFile && (
                <p className="text-sm text-green-400 mt-5">
                  Selected: {selectedFile.name}
                </p>
              )}

              <p className="text-xs text-slate-500 mt-5">
                Supported formats: LOG, TXT, CSV, JSON
              </p>

            </div>

            <p className="text-xs text-slate-500 mt-5">
              File selection is currently a frontend demonstration. Backend upload and AI analysis will be integrated later.
            </p>

          </section>
        )}

        {/* ATTACK TIMELINE PAGE */}

        {activePage === "Attack Timeline" && activeRole === "Analyst" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-bold text-cyan-400">
              Attack Timeline Investigation
            </h3>

            <p className="text-sm text-slate-400 mt-2 mb-8">
              Follow suspicious events in chronological order.
            </p>

            <div className="space-y-8">

              {timeline.map((event, index) => (
                <div key={event.time} className="flex gap-5">

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/30" />

                    {index !== timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-slate-700" />
                    )}
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4 flex-1">
                    <p className="text-xs text-slate-400">
                      {event.time}
                    </p>

                    <h4 className={`font-semibold mt-2 ${event.color}`}>
                      {event.event}
                    </h4>

                    <p className="text-xs text-slate-400 mt-2">
                      Suspicious security event detected.
                    </p>
                  </div>

                </div>
              ))}

            </div>

            <div className="mt-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold">
                AI Correlation
              </h4>

              <p className="text-sm text-slate-300 mt-2">
                Related security events will be connected using NetworkX graph analysis in the AI service.
              </p>
            </div>

          </section>
        )}

        {/* THREAT ANALYSIS PAGE */}

        {activePage === "Threat Analysis" && activeRole === "Analyst" && (
          <section>

            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              AI Threat Analysis
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              Understand suspicious activities and why they were flagged.
            </p>

            <div className="space-y-5">

              {alerts.map((alert) => (
                <div
                  key={alert.event}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >

                  <div className="flex flex-wrap justify-between gap-3">
                    <h4 className="font-semibold">
                      {alert.event}
                    </h4>

                    <span className={`px-3 py-1 rounded-md text-xs ${severityStyle(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mt-3">
                    Source IP: {alert.source}
                  </p>

                  <div className="bg-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-xs text-cyan-400 font-semibold mb-2">
                      WHY WAS THIS FLAGGED?
                    </p>

                    <p className="text-sm text-slate-300">
                      {alert.explanation}
                    </p>
                  </div>

                </div>
              ))}

            </div>

            <p className="text-xs text-slate-500 mt-5">
              Explanations are demonstration text. Actual AI-generated explanations will come from the Python AI service.
            </p>

          </section>
        )}

        {/* ADMIN USER MANAGEMENT */}

        {activePage === "User Management" && activeRole === "Admin" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-bold text-cyan-400 mb-2">
              User Management
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              Manage users and their platform roles.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[450px]">

                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-800">
                    <th className="pb-4">USER</th>
                    <th className="pb-4">ROLE</th>
                    <th className="pb-4">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["Gunjan", "Admin", "Active"],
                    ["Santoshi", "Admin", "Active"],
                    ["Shravani", "Analyst", "Active"],
                  ].map((user) => (
                    <tr
                      key={user[0]}
                      className="border-b border-slate-800 text-sm"
                    >
                      <td className="py-5">
                        {user[0]}
                      </td>

                      <td className="py-5 text-cyan-400">
                        {user[1]}
                      </td>

                      <td className="py-5 text-green-400">
                        ● {user[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <p className="text-xs text-slate-500 mt-5">
              Demo user records. Real user management will use the backend database.
            </p>

          </section>
        )}

        {/* SETTINGS PAGE */}

        {activePage === "Settings" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <h3 className="text-xl font-bold text-cyan-400">
              Dashboard Settings
            </h3>

            <p className="text-sm text-slate-400 mt-2 mb-6">
              CyberSentinel AI platform information.
            </p>

            <div className="space-y-5">

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm font-semibold">
                  Current Role
                </p>

                <p className="text-sm text-cyan-400 mt-2">
                  {activeRole}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm font-semibold">
                  Monitoring Status
                </p>

                <p className="text-sm text-green-400 mt-2">
                  ● Active (Demo)
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm font-semibold">
                  Platform
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  CyberSentinel AI – Early Cyber Threat Intelligence
                </p>
              </div>

            </div>

          </section>
        )}

        <footer className="text-center text-xs text-slate-600 mt-10">
          CyberSentinel AI | Early Cyber Threat Intelligence
        </footer>

      </main>

    </div>
  );
}

export default App;
