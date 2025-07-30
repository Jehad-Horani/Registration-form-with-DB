"use client";
import { useEffect, useState } from "react";

export default function ResponsesPage() {
  const [data, setData] = useState([]);

  // 📌 جلب البيانات
  const fetchResponses = async () => {
    const res = await fetch("/api/get-responses");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  // 📌 حذف الإجابة
  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الإجابة؟")) return;

    const res = await fetch(`/api/delete-response?id=${id}`, { method: "DELETE" });
    const result = await res.json();

    if (result.success) {
      alert("✅ تم حذف الإجابة");
      fetchResponses();
    } else {
      alert("❌ خطأ: " + result.error);
    }
  };

  // 📌 تحميل CSV لصف واحد
  const handleDownloadCSV = (row) => {
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Institution",
      "IEEE #",
      "Membership",
      "Track",
      "Dietary",
      "Heard About",
      "Date",
    ];

    const values = [
      row.full_name,
      row.email,
      row.phone,
      row.institution || "-",
      row.ieee_number || "-",
      row.membership_status,
      row.track,
      row.dietary || "-",
      row.hear_about,
      new Date(row.created_at).toLocaleDateString(),
    ];

    const csvContent =
      headers.join(",") + "\n" + values.map((v) => `"${v}"`).join(",");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${row.full_name}_registration.csv`;
    link.click();
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
                        <td className="border p-2 flex gap-2 justify-center">
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            🗑 Delete
                          </button>
                          <button
                            onClick={() => handleDownloadCSV(r)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            ⬇ CSV
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
