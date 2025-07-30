"use client";
import { useEffect, useState } from "react";

export default function ResponsesPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const res = await fetch("/api/get-responses");
      const result = await res.json();
      setData(result);
    };
    fetchResponses();
  }, []);

  // 🔹 دالة تحميل CSV لصف واحد
  const downloadCSV = (row) => {
    const headers = Object.keys(row).join(",");
    const values = Object.values(row).join(",");
    const csv = `${headers}\n${values}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.full_name}.csv`;
    a.click();
  };

  // 🔹 حذف الإجابة
  const deleteResponse = async (id) => {
    const res = await fetch("/api/delete-response", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ تم الحذف بنجاح");
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("❌ خطأ: " + result.error);
    }
  };

  const sections = [
    { key: "standard", title: "🎟 Standard Tickets", color: "bg-blue-100" },
    { key: "vip", title: "💎 VIP Tickets", color: "bg-yellow-100" },
    { key: "standard_ieee", title: "🔹 Standard IEEE Members", color: "bg-green-100" },
    { key: "vip_ieee", title: "🌟 VIP IEEE Members", color: "bg-purple-100" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">📋 All Registrations</h1>

      {sections.map((sec) => {
        const filtered = data.filter((d) => d.ticket_type === sec.key);
        return (
          <div key={sec.key} className={`mb-8 p-4 rounded-xl shadow ${sec.color}`}>
            <h2 className="text-2xl font-semibold mb-4">{sec.title}</h2>

            {filtered.length === 0 ? (
              <p className="text-gray-500">No registrations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Full Name</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Phone</th>
                      <th className="border p-2">Institution</th>
                      <th className="border p-2">IEEE #</th>
                      <th className="border p-2">Membership</th>
                      <th className="border p-2">Track</th>
                      <th className="border p-2">Dietary</th>
                      <th className="border p-2">Heard About</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="text-center">
                        <td className="border p-2">{r.full_name}</td>
                        <td className="border p-2">{r.email}</td>
                        <td className="border p-2">{r.phone}</td>
                        <td className="border p-2">{r.institution || "-"}</td>
                        <td className="border p-2">{r.ieee_number || "-"}</td>
                        <td className="border p-2">{r.membership_status}</td>
                        <td className="border p-2">{r.track}</td>
                        <td className="border p-2">{r.dietary || "-"}</td>
                        <td className="border p-2">{r.hear_about}</td>
                        <td className="border p-2">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() => deleteResponse(r.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => downloadCSV(r)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            CSV
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
