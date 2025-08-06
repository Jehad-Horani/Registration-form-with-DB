"use client";
import { useEffect, useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function ResponsesPage() {
  const [data, setData] = useState([]);
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
  const [username, setUsername] = useState("");
  const [pendingChanges, setPendingChanges] = useState({}); // key: id, value: { is_verified, verified_by }

  // ✅ جلب البيانات
  const fetchResponses = async () => {
    const res = await fetch("/api/get-responses");
    const result = await res.json();
    const sorted = result.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    const numbered = sorted.map((item, index) => ({
      ...item,
      serial_id: index + 1,
    }));
    setData(numbered);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("responses_auth");
    if (savedData) {
      try {
        const { pass, timestamp, user } = JSON.parse(savedData);
        const now = Date.now();
        const expiry = timestamp + 2 * 60 * 60 * 1000;
        if (pass === "JehadMedRootsTT25" && now < expiry) {
          setAuthorized(true);
          setExpiryTime(expiry);
          setUsername(user || "");
        } else {
          localStorage.removeItem("responses_auth");
        }
      } catch {
        localStorage.removeItem("responses_auth");
      }
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchResponses();
      setPendingChanges({}); // Reset pending changes on fresh fetch
    }
  }, [authorized]);

  const checkPassword = () => {
    if (password === "JehadMedRootsTT25") {
      const user = prompt("✅ أدخل اسمك لتسجيل من قام بالتحقق:");
      const data = { pass: "JehadMedRootsTT25", timestamp: Date.now(), user };
      localStorage.setItem("responses_auth", JSON.stringify(data));
      setAuthorized(true);
      setExpiryTime(data.timestamp + 2 * 60 * 60 * 1000);
      setUsername(user);
    } else {
      alert("❌ كلمة السر غير صحيحة");
    }
  };

  const logout = () => {
    localStorage.removeItem("responses_auth");
    setAuthorized(false);
    setPassword("");
    setUsername("");
  };

  // تغيير حالة التحقق في الواجهة (تحديث pendingChanges فقط)
  const handleCheckboxChange = (id, currentStatus) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: {
        is_verified: !currentStatus,
        verified_by: !currentStatus ? username : null,
      },
    }));

    // تحديث البيانات في الواجهة لعرض التغيير فورًا
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            is_verified: !currentStatus,
            verified_by: !currentStatus ? username : null,
          }
          : item
      )
    );
  };

  // زر حفظ التغييرات وإرسالها للداتا بيس دفعة واحدة
  const saveChanges = async () => {
    const updates = Object.entries(pendingChanges).map(([id, val]) => ({
      id,
      ...val,
    }));

    if (updates.length === 0) {
      alert("لم يتم تعديل أي سجلات للحفظ.");
      return;
    }

    const res = await fetch("/api/update-verifications-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ تم حفظ التغييرات بنجاح");
      setPendingChanges({});
      fetchResponses(); // إعادة جلب البيانات بعد الحفظ لضمان التزامن
    } else {
      alert("❌ خطأ أثناء الحفظ");
    }
  };

  // توليد ملف وورد لسجل واحد
  const generateDocForRow = (row) => [
    new Paragraph({ text: "Conference Registration", heading: "Heading1" }),
    new Paragraph(new TextRun({ text: `Registration ID: ${row.serial_id}`, bold: true })),
    new Paragraph(new TextRun({ text: `Full Name: ${row.full_name}`, bold: true })),
    new Paragraph(`Email: ${row.email}`),
    new Paragraph(`Phone: ${row.phone}`),
    new Paragraph(`National ID: ${row.national_id || "-"}`),
    new Paragraph(`Institution: ${row.institution || "-"}`),
    new Paragraph(`IEEE Number: ${row.ieee_number || "-"}`),
    new Paragraph(`Membership Status: ${row.membership_status || "-"}`),
    new Paragraph(`Ticket Type: ${row.ticket_type}`),
    new Paragraph(`Track: ${row.track}`),
    new Paragraph(`Dietary: ${row.dietary || "-"}`),
    new Paragraph(`Heard About: ${row.hear_about}`),
    new Paragraph(`Bank Name: ${row.bank_name || "-"}`),
    new Paragraph(`Account Name: ${row.account_name}`),
    new Paragraph(`Payment Proof URL: ${row.payment_proof || "-"}`),
    new Paragraph(`Verified: ${row.is_verified ? "✅ Yes" : "❌ No"}`),
    new Paragraph(`Verified By: ${row.verified_by || "-"}`),
    new Paragraph(`Date: ${new Date(row.created_at).toLocaleDateString()}`),
    new Paragraph("--------------------------------------------------"),
  ];

  const downloadWord = (row) => {
    const doc = new Document({
      sections: [{ children: generateDocForRow(row) }],
    });
    Packer.toBlob(doc).then((blob) => saveAs(blob, `${row.full_name}.docx`));
  };

  const downloadAllWord = () => {
    if (data.length === 0) {
      alert("❌ لا توجد إجابات للتنزيل");
      return;
    }
    const allSections = data.flatMap((row) => generateDocForRow(row));
    const doc = new Document({ sections: [{ children: allSections }] });
    Packer.toBlob(doc).then((blob) => saveAs(blob, "All_Registrations.docx"));
  };

  const downloadExcel = () => {
    const rows = data.map((r) => ({
      ID: r.serial_id,
      Name: r.full_name,
      "National ID": r.national_id,
      Email: r.email,
      Phone: r.phone,
      Institution: r.institution,
      "IEEE #": r.ieee_number,
      Membership: r.membership_status,
      Ticket: r.ticket_type,
      Track: r.track,
      Bank: r.bank_name,
      "Account Name": r.account_name,
      Verified: r.is_verified ? "Yes" : "No",
      "Verified By": r.verified_by || "-",
      Date: new Date(r.created_at).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "Registrations.xlsx");
  };

  const deleteEntry = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا التسجيل؟")) return;

    const res = await fetch("/api/delete-response", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.success) {
      fetchResponses();
    } else {
      alert("❌ خطأ أثناء الحذف");
    }
  };

  const groupedByTicket = {
    standard: data.filter((r) => r.ticket_type === "standard"),
    standard_ieee: data.filter((r) => r.ticket_type === "standard_ieee"),
    vip: data.filter((r) => r.ticket_type === "vip"),
    vip_ieee: data.filter((r) => r.ticket_type === "vip_ieee"),
  };

  // العرض مع الأخذ بالحسبان التعديلات المؤقتة في pendingChanges
  const renderTable = (title, rows) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4 text-white">
        {title} ({rows.length})
      </h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">✅</th>
              <th className="border p-2">#</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">National ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Institution</th>
              <th className="border p-2">Membership</th>
              <th className="border p-2">Membership ID</th>
              <th className="border p-2">Ticket</th>
              <th className="border p-2">Track</th>
              <th className="border p-2">Bank Name</th>
              <th className="border p-2">Account Name</th>
              <th className="border p-2">Payment Proof</th>
              <th className="border p-2">Verified By</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isPending = pendingChanges[r.id];
              const isChecked = isPending
                ? pendingChanges[r.id].is_verified
                : r.is_verified || false;
              const verifiedBy = isPending
                ? pendingChanges[r.id].verified_by || "-"
                : r.verified_by || "-";

              return (
                <tr key={r.id} className="text-center">
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(r.id, isChecked)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="border p-2">{r.serial_id}</td>
                  <td className="border p-2">{r.full_name}</td>
                  <td className="border p-2">{r.national_id || "-"}</td>
                  <td className="border p-2">{r.email}</td>
                  <td className="border p-2">{r.phone}</td>
                  <td className="border p-2">{r.institution || "-"}</td>
                  <td className="border p-2">{r.membership_status}</td>
                  <td className="border p-2">{r.ieee_number || "-"}</td>
                  <td className="border p-2">{r.ticket_type}</td>
                  <td className="border p-2">{r.track}</td>
                  <td className="border p-2">{r.bank_name || "-"}</td>
                  <td className="border p-2">{r.account_name || "-"}</td>
                  <td className="border p-2">
                    {r.payment_proof ? (
                      <a href={r.payment_proof} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">{verifiedBy}</td>
                  <td className="border p-2">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => downloadWord(r)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Word
                    </button>
                    <button
                      onClick={() => deleteEntry(r.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl mb-4">🔒 Enter Password to Access Responses</h1>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded border-2 m-4 text-black"
        />
        <button
          onClick={checkPassword}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">📋 All Registrations</h1>
          {expiryTime && (
            <p className="text-gray-300">
              🔑 Session expires at: {new Date(expiryTime).toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      <button
        onClick={saveChanges}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700"
      >
        💾 Save Verification Changes
      </button>

      <div className="flex gap-4 mb-6">
        <button
          onClick={downloadAllWord}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          ⬇️ Download All as Word
        </button>
        <button
          onClick={downloadExcel}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
        >
          📊 Download Excel
        </button>
      </div>

      {renderTable("Standard Tickets", groupedByTicket.standard)}
      {renderTable("Standard IEEE Tickets", groupedByTicket.standard_ieee)}
      {renderTable("VIP Tickets", groupedByTicket.vip)}
      {renderTable("VIP IEEE Tickets", groupedByTicket.vip_ieee)}
    </div>
  );
}
