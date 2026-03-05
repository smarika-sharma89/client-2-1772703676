import { useState, useEffect } from "react";

const MOCK_BILLS = [
  {
    id: "BILL-001",
    supplier: "Apex Civil Contractors",
    description: "Earthworks & Excavation - Zone A",
    amount: 48500.0,
    gst: 4850.0,
    subtotal: 43650.0,
    date: "2024-01-15",
    approvalPhase: 1,
    totalPhases: 3,
    status: "awaiting_first",
    wbs: "WBS-1100",
    xeroStatus: "synced",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "pending", timestamp: null },
      { name: "James Thornton", role: "Project Manager", status: "pending", timestamp: null },
      { name: "Karen Liu", role: "Finance Director", status: "pending", timestamp: null },
    ],
  },
  {
    id: "BILL-002",
    supplier: "Strata Engineering",
    description: "Structural Steel Supply & Install",
    amount: 127000.0,
    gst: 12700.0,
    subtotal: 114300.0,
    date: "2024-01-18",
    approvalPhase: 2,
    totalPhases: 3,
    status: "awaiting_second",
    wbs: "WBS-2200",
    xeroStatus: "synced",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "approved", timestamp: "2024-01-19 09:14" },
      { name: "James Thornton", role: "Project Manager", status: "pending", timestamp: null },
      { name: "Karen Liu", role: "Finance Director", status: "pending", timestamp: null },
    ],
  },
  {
    id: "BILL-003",
    supplier: "ClearView Electrical",
    description: "HV Cable Installation - Stage 2",
    amount: 33200.0,
    gst: 3320.0,
    subtotal: 29880.0,
    date: "2024-01-20",
    approvalPhase: 3,
    totalPhases: 3,
    status: "awaiting_final",
    wbs: "WBS-3310",
    xeroStatus: "error",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "approved", timestamp: "2024-01-21 08:30" },
      { name: "James Thornton", role: "Project Manager", status: "approved", timestamp: "2024-01-22 14:05" },
      { name: "Karen Liu", role: "Finance Director", status: "pending", timestamp: null },
    ],
  },
  {
    id: "BILL-004",
    supplier: "Ridgeline Concreting",
    description: "Slab Pour - Building C Foundations",
    amount: 89400.0,
    gst: 8940.0,
    subtotal: 80460.0,
    date: "2024-01-22",
    approvalPhase: 0,
    totalPhases: 3,
    status: "approved",
    wbs: "WBS-1200",
    xeroStatus: "synced",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "approved", timestamp: "2024-01-23 10:00" },
      { name: "James Thornton", role: "Project Manager", status: "approved", timestamp: "2024-01-24 11:30" },
      { name: "Karen Liu", role: "Finance Director", status: "approved", timestamp: "2024-01-25 09:45" },
    ],
  },
  {
    id: "BILL-005",
    supplier: "Pacific Plumbing Co.",
    description: "Hydraulic Services - Levels 1-3",
    amount: 21600.0,
    gst: 2160.0,
    subtotal: 19440.0,
    date: "2024-01-25",
    approvalPhase: 1,
    totalPhases: 3,
    status: "awaiting_first",
    wbs: "WBS-4400",
    xeroStatus: "pending",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "pending", timestamp: null },
      { name: "James Thornton", role: "Project Manager", status: "pending", timestamp: null },
      { name: "Karen Liu", role: "Finance Director", status: "pending", timestamp: null },
    ],
  },
  {
    id: "BILL-006",
    supplier: "Terraform Landscaping",
    description: "Site Drainage & Topsoil",
    amount: 15800.0,
    gst: 1580.0,
    subtotal: 14220.0,
    date: "2024-01-28",
    approvalPhase: 2,
    totalPhases: 3,
    status: "awaiting_second",
    wbs: "WBS-5500",
    xeroStatus: "synced",
    approvers: [
      { name: "Sarah Mitchell", role: "Site Manager", status: "approved", timestamp: "2024-01-29 07:55" },
      { name: "James Thornton", role: "Project Manager", status: "pending", timestamp: null },
      { name: "Karen Liu", role: "Finance Director", status: "pending", timestamp: null },
    ],
  },
];

const MOCK_DAYWORKS = [
  {
    id: "DW-001",
    date: "2024-01-22",
    contractor: "Apex Civil Contractors",
    description: "Emergency pipe repair - standby crew",
    hours: 8,
    workers: 3,
    status: "submitted",
    chargeRate: 185,
    notes: [
      { id: 1, author: "Tom Bradley", timestamp: "2024-01-23 09:15", text: "Rates confirmed with contractor. Awaiting supporting photos." },
    ],
  },
  {
    id: "DW-002",
    date: "2024-01-24",
    contractor: "ClearView Electrical",
    description: "HV fault investigation - unplanned outage",
    hours: 6,
    workers: 2,
    status: "submitted",
    chargeRate: 210,
    notes: [],
  },
];

const MOCK_CHARGE_RATES = [
  { id: 1, category: "Civil Labour", description: "General Labourer", unit: "hr", rate: 95.0, gstApplicable: true, lastUpdated: "2024-01-10" },
  { id: 2, category: "Civil Labour", description: "Plant Operator", unit: "hr", rate: 145.0, gstApplicable: true, lastUpdated: "2024-01-10" },
  { id: 3, category: "Electrical", description: "Electrician Grade A", unit: "hr", rate: 210.0, gstApplicable: true, lastUpdated: "2024-01-12" },
  { id: 4, category: "Electrical", description: "Cable Jointer", unit: "hr", rate: 185.0, gstApplicable: true, lastUpdated: "2024-01-12" },
  { id: 5, category: "Plant & Equipment", description: "20T Excavator", unit: "day", rate: 1850.0, gstApplicable: true, lastUpdated: "2024-01-08" },
  { id: 6, category: "Plant & Equipment", description: "Water Cart", unit: "day", rate: 650.0, gstApplicable: true, lastUpdated: "2024-01-08" },
  { id: 7, category: "Materials", description: "Concrete (per m³)", unit: "m³", rate: 195.0, gstApplicable: true, lastUpdated: "2024-01-15" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "approval", message: "BILL-002 is awaiting your approval", time: "2 hours ago", read: false, billId: "BILL-002" },
  { id: 2, type: "xero_error", message: "BILL-003 failed to sync with Xero", time: "4 hours ago", read: false, billId: "BILL-003" },
  { id: 3, type: "approval", message: "BILL-006 is awaiting your approval", time: "1 day ago", read: true, billId: "BILL-006" },
  { id: 4, type: "approved", message: "BILL-004 has been fully approved", time: "2 days ago", read: true, billId: "BILL-004" },
];

const statusConfig = {
  awaiting_first: { label: "Awaiting First Approval", color: "bg-amber-100 text-amber-800 border-amber-200" },
  awaiting_second: { label: "Awaiting Second Approval", color: "bg-orange-100 text-orange-800 border-orange-200" },
  awaiting_final: { label: "Awaiting Final Approval", color: "bg-red-100 text-red-800 border-red-200" },
  approved: { label: "Fully Approved", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-200 text-red-900 border-red-300" },
};

const xeroStatusConfig = {
  synced: { label: "Synced", color: "bg-green-100 text-green-700 border-green-200" },
  error: { label: "Sync Error", color: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "Pending Sync", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

function StatusBadge({ status, config }) {
  const cfg = config[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function ApprovalTimeline({ approvers }) {
  return (
    <div className="space-y-0">
      {approvers.map((approver, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                approver.status === "approved"
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {approver.status === "approved" ? "✓" : idx + 1}
            </div>
            {idx < approvers.length - 1 && (
              <div className={`w-0.5 h-8 ${approver.status === "approved" ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
          <div className="pb-6 pt-1">
            <p className="text-sm font-medium text-gray-900">{approver.name}</p>
            <p className="text-xs text-gray-500">{approver.role}</p>
            {approver.timestamp ? (
              <p className="text-xs text-green-600 mt-0.5">Approved {approver.timestamp}</p>
            ) : (
              <p className="text-xs text-amber-600 mt-0.5">Pending approval</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${colors[type] || "bg-gray-800"}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white">✕</button>
    </div>
  );
}

export default function BillApprovalVisibility() {
  const [activeTab, setActiveTab] = useState("bills");
  const [bills, setBills] = useState(MOCK_BILLS);
  const [dayworks, setDayworks] = useState(MOCK_DAYWORKS);
  const [chargeRates, setChargeRates] = useState(MOCK_CHARGE_RATES);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const [statusFilter, setStatusFilter] = useState("all");
  const [approverFilter, setApproverFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [gstEditValue, setGstEditValue] = useState("");
  const [editingGst, setEditingGst] = useState(false);
  const [wbsCopyTarget, setWbsCopyTarget] = useState(null);

  const [selectedDaywork, setSelectedDaywork] = useState(null);
  const [showDayworkModal, setShowDayworkModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  const [editingRate, setEditingRate] = useState(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [xeroSyncing, setXeroSyncing] = useState({});

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const allApprovers = ["all", "Sarah Mitchell", "James Thornton", "Karen Liu"];

  const filteredBills = bills.filter((bill) => {
    const statusMatch = statusFilter === "all" || bill.status === statusFilter;
    const approverMatch =
      approverFilter === "all" ||
      bill.approvers.some(
        (a) => a.name === approverFilter && a.status === "pending"
      );
    return statusMatch && approverMatch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleApproveBill = (billId) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        const newApprovers = b.approvers.map((a, idx) => {
          if (idx === b.approvalPhase && a.status === "pending") {
            return { ...a, status: "approved", timestamp: new Date().toLocaleString("en-AU").replace(",", "") };
          }
          return a;
        });
        const nextPhase = b.approvalPhase + 1;
        const newStatus =
          nextPhase >= b.totalPhases
            ? "approved"
            : nextPhase === 1
            ? "awaiting_second"
            : nextPhase === 2
            ? "awaiting_final"
            : "approved";
        return { ...b, approvers: newApprovers, approvalPhase: nextPhase, status: newStatus };
      })
    );
    addToast(`Bill ${billId} approved successfully`, "success");
    setShowApproveConfirm(false);
    if (selectedBill?.id === billId) {
      setSelectedBill((prev) => {
        const updated = bills.find((b) => b.id === billId);
        return updated ? { ...updated } : prev;
      });
    }
  };

  const handleGstSave = () => {
    const val = parseFloat(gstEditValue);
    if (isNaN(val)) return;
    setBills((prev) =>
      prev.map((b) =>
        b.id === selectedBill.id ? { ...b, gst: val, amount: b.subtotal + val } : b
      )
    );
    setSelectedBill((prev) => ({ ...prev, gst: val, amount: prev.subtotal + val }));
    setEditingGst(false);
    addToast("GST amount updated", "success");
  };

  const handleXeroSync = (billId) => {
    setXeroSyncing((prev) => ({ ...prev, [billId]: true }));
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setBills((prev) =>
        prev.map((b) =>
          b.id === billId ? { ...b, xeroStatus: success ? "synced" : "error" } : b
        )
      );
      setXeroSyncing((prev) => ({ ...prev, [billId]: false }));
      addToast(
        success ? `Bill ${billId} synced with Xero` : `Xero sync failed for ${billId}. Check credentials.`,
        success ? "success" : "error"
      );
    }, 1800);
  };

  const handleWbsCopyAll = (bill) => {
    addToast(`WBS ${bill.wbs} applied to all lines of ${bill.id}`, "success");
    setWbsCopyTarget(null);
  };

  const handleAddNote = (dwId) => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      author: "Current User",
      timestamp: new Date().toLocaleString("en-AU").replace(",", ""),
      text: newNote.trim(),
    };
    setDayworks((prev) =>
      prev.map((d) =>
        d.id === dwId ? { ...d, notes: [...d.notes, note] } : d
      )
    );
    setSelectedDaywork((prev) => ({ ...prev, notes: [...prev.notes, note] }));
    setNewNote("");
    addToast("Internal note added (not visible on docket)", "success");
  };

  const handleSaveRate = (rateId) => {
    const val = parseFloat(editRateValue);
    if (isNaN(val)) return;
    setChargeRates((prev) =>
      prev.map((r) =>
        r.id === rateId ? { ...r, rate: val, lastUpdated: new Date().toISOString().split("T")[0] } : r
      )
    );
    setEditingRate(null);
    addToast("Charge rate updated", "success");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openBillFromNotification = (billId) => {
    const bill = bills.find((b) => b.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setShowBillModal(true);
      setShowNotifications(false);
      setActiveTab("bills");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0a0a] flex flex-col py-6 px-4 gap-2 flex-shrink-0">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-sm">V</div>
            <span className="text-white font-semibold text-sm">Varicon</span>
          </div>
          <p className="text-gray-500 text-xs pl-9">Infrastructure Management</p>
        </div>
        {[
          { key: "bills", label: "Bill Approvals", icon: "📋" },
          { key: "dayworks", label: "Day Works", icon: "🔧" },
          { key: "chargerates", label: "Charge Rates", icon: "💲" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[#0ea5e9] text-white"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 px-3">
            <div className="w-7 h-7 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] text-xs font-bold">JT</div>
            <div>
              <p className="text-white text-xs font-medium">James Thornton</p>
              <p className="text-gray-500 text-xs">Project Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {activeTab === "bills" && "Bill Approvals"}
              {activeTab === "dayworks" && "Day Works Dockets"}
              {activeTab === "chargerates" && "Day Works Charge Rates"}
            </h1>
            <p className="text-xs text-gray-500">
              {activeTab === "bills" && "Manage and track bill approval workflows"}
              {activeTab === "dayworks" && "Review submitted day works dockets"}
              {activeTab === "chargerates" && "View and manage charge rate schedules"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-900">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-[#0ea5e9] hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => openBillFromNotification(n.billId)}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50 ${!n.read ? "bg-blue-50" : ""}`}
                      >
                        <span className="text-base mt-0.5">
                          {n.type === "approval" ? "⏳" : n.type === "xero_error" ? "❌" : "✅"}
                        </span>
                        <div className="flex-1">
                          <p className={`text-sm ${!n.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>{n.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-[#0ea5e9] rounded-full mt-1.5" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* BILLS TAB */}
          {activeTab === "bills" && (
            <div className="space-y-4">
              {/* Filter Panel */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="awaiting_first">Awaiting First Approval</option>
                      <option value="awaiting_second">Awaiting Second Approval</option>
                      <option value="awaiting_final">Awaiting Final Approval</option>
                      <option value="approved">Fully Approved</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Pending Approver:</span>
                    <select
                      value={approverFilter}
                      onChange={(e) => setApproverFilter(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    >
                      {allApprovers.map((a) => (
                        <option key={a} value={a}>
                          {a === "all" ? "All Approvers" : a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">{filteredBills.length} bills shown</span>
                    {(statusFilter !== "all" || approverFilter !== "all") && (
                      <button
                        onClick={() => { setStatusFilter("all"); setApproverFilter("all"); }}
                        className="text-xs text-[#0ea5e9] hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bills Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Supplier</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">WBS</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Approval Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Xero</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill.id}
                        onClick={() => { setSelectedBill(bill); setShowBillModal(true); setEditingGst(false); }}
                        className="border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0ea5e9]">{bill.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 text-sm">{bill.supplier}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm max-w-48 truncate">{bill.description}</td>
                        <td className="px-4 py-3">