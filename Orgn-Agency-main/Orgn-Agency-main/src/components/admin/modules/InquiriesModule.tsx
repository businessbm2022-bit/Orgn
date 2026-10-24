import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Trash2,
  Mail,
  Building,
  Calendar,
  MessageSquare,
  X,
  CheckCircle2,
  Phone,
  RefreshCw,
} from "lucide-react";

interface InquiryRecord {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  details: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const InquiriesModule: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: InquiryRecord["status"]) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      // Handled
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notesInput }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, internalNotes: notesInput } : i))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, internalNotes: notesInput } : null));
        }
      }
    } catch {
      // Handled
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setDeleteConfirmId(null);
      }
    } catch {
      // Handled
    }
  };

  const exportToCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ["ID", "Full Name", "Company", "Email", "Phone", "Service", "Budget", "Details", "Status", "Created At"];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.companyName.replace(/"/g, '""')}"`,
      i.email,
      i.phone || "",
      `"${i.service.replace(/"/g, '""')}"`,
      i.budget || "",
      `"${i.details.replace(/"/g, '""')}"`,
      i.status,
      i.createdAt,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orgn_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInquiries = inquiries.filter((i) => {
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      search === "" ||
      i.fullName.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.details.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Project Inquiries Inbox
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Real incoming client briefs submitted through the public website contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchInquiries}
            className="p-2.5 rounded bg-white/5 hover:bg-white/10 text-[#A7B0C0] hover:text-white transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={exportToCSV}
            disabled={inquiries.length === 0}
            className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#141923] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A7B0C0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A7B0C0]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          >
            <option value="All">All Inquiries</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-xl bg-[#141923] border border-white/10 space-y-3">
            <Inbox className="w-10 h-10 text-[#A7B0C0]/50 mx-auto" />
            <h3 className="text-base font-bold font-display text-white">No Inquiries Found</h3>
            <p className="text-xs text-[#A7B0C0] max-w-sm mx-auto">
              {search || statusFilter !== "All"
                ? "No submissions matched your search or status filter."
                : "When prospective clients submit the public contact form, their briefs will arrive here with real contact info."}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const statusColors: Record<string, string> = {
              New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              Contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              Qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              Closed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            };

            return (
              <div
                key={inq.id}
                onClick={() => {
                  setSelectedInquiry(inq);
                  setNotesInput(inq.internalNotes || "");
                }}
                className="p-5 rounded-xl bg-[#141923] border border-white/10 hover:border-[#247BFF]/40 cursor-pointer transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-display text-white group-hover:text-[#247BFF] transition-colors">
                      {inq.fullName}
                    </span>
                    <span className="text-xs text-[#A7B0C0] flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#247BFF]" />
                      <span>{inq.companyName}</span>
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                        statusColors[inq.status] || "bg-white/5 text-[#A7B0C0]"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#A7B0C0] line-clamp-1">
                    <strong className="text-white/80">{inq.service}:</strong> {inq.details}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#A7B0C0]/70 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{inq.email}</span>
                    </span>
                    {inq.budget && <span>Budget: {inq.budget}</span>}
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <select
                    value={inq.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                    className="px-2.5 py-1.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                  </select>

                  {deleteConfirmId === inq.id ? (
                    <div
                      className="flex items-center gap-1 bg-red-500/10 p-1 rounded border border-red-500/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleDelete(inq.id)}
                        className="px-2 py-0.5 text-[10px] font-bold text-red-400 hover:text-white hover:bg-red-500 rounded"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-[#A7B0C0]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(inq.id);
                      }}
                      className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#141923] border border-white/20 rounded-xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-[#247BFF] uppercase tracking-wider">
                  PROJECT BRIEF DETAILS
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  {selectedInquiry.fullName}
                </h3>
                <span className="text-sm text-[#A7B0C0]">{selectedInquiry.companyName}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded bg-[#080A0F] border border-white/10 text-xs">
              <div>
                <span className="text-[#A7B0C0] block font-mono">Email:</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-white hover:text-[#247BFF] font-medium"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              {selectedInquiry.phone && (
                <div>
                  <span className="text-[#A7B0C0] block font-mono">Phone:</span>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-white hover:text-[#247BFF] font-medium"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
              )}

              <div>
                <span className="text-[#A7B0C0] block font-mono">Service Required:</span>
                <span className="text-white font-medium">{selectedInquiry.service}</span>
              </div>

              <div>
                <span className="text-[#A7B0C0] block font-mono">Estimated Budget:</span>
                <span className="text-white font-medium">{selectedInquiry.budget || "Not specified"}</span>
              </div>
            </div>

            {/* Brief Narrative */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#A7B0C0]">Project Scope & Goals:</span>
              <div className="p-4 rounded bg-[#080A0F] border border-white/10 text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.details}
              </div>
            </div>

            {/* Internal Studio Notes */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-mono uppercase text-[#247BFF] font-semibold">
                INTERNAL STUDIO NOTES:
              </span>
              <textarea
                rows={3}
                placeholder="Add confidential notes, meeting dates, or project qualification status..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
              <button
                type="button"
                onClick={() => handleSaveNotes(selectedInquiry.id)}
                className="px-4 py-1.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
