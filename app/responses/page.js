"use client";
import { useEffect, useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

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

  // ✅ توليد ملف Word لإجابة واحدة
  const generateDocForRow = (row) => {
    return [
      new Paragraph({ text: "Conference Registration", heading: "Heading1" }),
      new Paragraph(" "),
      new Paragraph(new TextRun({ text: `Full Name: ${row.full_name}`, bold: true })),
      new Paragraph(`Email: ${row.email}`),
      new Paragraph(`Phone: ${row.phone}`),
      new Paragraph(`Institution: ${row.institution || "-"}`),
      new Paragraph(`IEEE Number: ${row.ieee_number || "-"}`),
      new Paragraph(`Membership Status: ${row.membership_status || "-"}`),
      new Paragraph(`Ticket Type: ${row.ticket_type}`),
      new Paragraph(`Track: ${row.track}`),
      new Paragraph(`Dietary: ${row.dietary || "-"}`),
      new Paragraph(`Heard About: ${row.hear_about}`),
      new Paragraph(`Bank Name: ${row.bank_name || "-"}`),
      new Paragraph(`Account Name: ${row.account_name || "-"}`),
      new Paragraph(`Payment Proof URL: ${row.payment_proof || "-"}`),
      new Paragraph(`Date: ${new Date(row.created_at).toLocaleDateString()}`),
      new Paragraph(" "),
      new Paragraph("--------------------------------------------------"),
      new Paragraph(" "),
    ];
  };

  // ✅ تحميل إجابة واحدة
  const downloadWord = (row) => {
    const doc = new Document({
      sections: [{ children: generateDocForRow(row) }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${row.full_name}.docx`);
    });
  };

  // ✅ تحميل جميع الإجابات
  const downloadAllWord = () => {
    if (data.length === 0) {
      alert("❌ لا توجد إجابات للتنزيل");
      return;
    }

    const allSections = data.flatMap((row) => generateDocForRow(row));

    const doc = new Document({
      sections: [{ children: allSections }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "All_Registrations.docx");
    });
  };

  // ✅ حذف الإجابة
  const deleteResponse = async (id) => {
    const res = await fetch("/api/delete-response", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.success) {
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("✅ تم حذف الإجابة");
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
      <h1 className="text-3xl font-bold mb-6 text-center">📋 All Registrations</h1>

      {/* زر تحميل جميع الإجابات */}
      <div className="text-center mb-6">
        <button
          onClick={downloadAllWord}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          ⬇️ Download All as Word
        </button>
      </div>

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
                      <th className="border p-2">Bank</th>
                      <th className="border p-2">Account Name</th>
                      <th className="border p-2">Payment Proof</th>
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
                        <td className="border p-2">{r.membership_status || "-"}</td>
                        <td className="border p-2">{r.track}</td>
                        <td className="border p-2">{r.bank_name || "-"}</td>
                        <td className="border p-2">{r.account_name || "-"}</td>
                        <td className="border p-2">
                          {r.payment_proof ? (
                            <a
                              href={r.payment_proof}
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
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
                            onClick={() => downloadWord(r)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Word
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
