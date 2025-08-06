"use client";
import { useState } from "react";

export default function IEEERegisterForm() {
  const [showTerms, setShowTerms] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    national_id: "",
    email: "",
    phone: "",
    institution: "",
    ieee_number: "",
    membership_status: "student",
    ticket_type: "standard_ieee",
    track: "A",
    dietary: "",
    hear_about: "social",
    bank_name: "",
    account_name: "",
    payment_proof: "",
    agree_terms: false,
    agree_media: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let proofUrl = "";
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadResult = await uploadRes.json();
      if (uploadResult.url) proofUrl = uploadResult.url;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, payment_proof: proofUrl }),
    });

    const result = await res.json();
    alert(result.success ? "✅ Thank you for your ticket purchase! We’ve received your payment and your registration is now complete. Our team will contact you within 48 hours to confirm your ticket and provide further details." : "❌ Error: " + result.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-black text-white rounded-2xl shadow-2xl p-8 space-y-5 "
      >
        <h1 className="text-3xl font-extrabold text-center ">
          MedRoots Summit 2025 Registration IEEE MEMBERS
        </h1>

        <div className="max-w-2xl mx-auto mb-6 p-4  text-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-3">📌 MedRoots Summit 2025 – Conference Details</h2>
          <ul className="space-y-1 text-lg">
            <li>📍 <strong>Location:</strong> Signia By Hilton Hotel</li>
            <li>📅 <strong>Dates:</strong> 13th & 14th September 2025</li>
            <li>⏰ <strong>Doors Open:</strong> 9:00 AM</li>
            <li>⭐ <strong>VIP Access Day:</strong> 15th September 2025 (VIP only)</li>
          </ul>
        </div>

        <div className="max-w-2xl mx-auto mb-6 p-4 text-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-3">💳 Payment Information</h2>
          <ul className="space-y-1 text-lg">
            <li>🏷 <strong>Alias:</strong> MRS25</li>
            <li>🏦 <strong>Bank:</strong> Arab Bank</li>
            <li>👤 <strong>Account Holder:</strong> Rashad Ahmad Mohammad AL Hourani</li>
            <li>💰 <strong>Payment Method:</strong> By CLIQ</li>
          </ul>
        </div>


        <div className="space-y-10 space-x-8 gap-5">
          <input name="full_name" placeholder="Full Name (as per ID)" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl" required />
          <input
            name="national_id"
            placeholder="National ID Number"
            onChange={handleChange}
            className="w-full border-2 p-3 rounded-2xl"
            required
          />
          <input name="email" placeholder="Email Address" onChange={handleChange} className="input-field border-2 p-3 w-full rounded-2xl" required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} className="input-field border-2 p-3 w-full rounded-2xl" required />
          <input name="institution" placeholder="Institution / Organization" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl" required />
          <input name="ieee_number" placeholder="IEEE Membership Number" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold ">Membership Status:</label>
            <select name="membership_status" onChange={handleChange} className="input-field w-full bg-black border-2 p-3 rounded-2xl m-2" required>
              <option value="student">Student Member</option>
              <option value="professional">Professional Member</option>
              <option value="life">Life Member</option>
              <option value="ifmsa">IFMSA Member</option>
            </select>
          </div>
          <div>
            <label className="font-semibold ">Ticket Type:</label>
            <select name="ticket_type" onChange={handleChange} className="input-field w-full bg-black border-2 p-3 rounded-2xl m-2" required>
              <option value="standard_ieee">Standard IEEE Ticket (35) JOD</option>
              <option value="vip_ieee">VIP IEEE Ticket (75) JOD</option>
            </select>
          </div>
        </div>

        <div className="w-full">
          <label className="font-semibold block mb-1">Track Selection:</label>
          <select
            name="track"
            onChange={handleChange}
            className="w-full border-2 p-3 mt-3 rounded-xl bg-black text-white"
            required
          >
            <option value="A">Track A: Cyber-Physical Systems in Healthcare</option>
            <option value="B">Track B: Bioprinting & Prosthetic Engineering</option>
          </select>
        </div>
        <label className="font-semibold block mb-1">

          Dietary restrictions or allergies
        </label>

        <input name="dietary" placeholder="Dietary restrictions or allergies" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl m-2 mb-4" />

        <div>
          <label className="font-semibold ">How did you hear about the conference?</label><br />
          <select name="hear_about" onChange={handleChange} className="input-field w-full bg-black border-2 p-3 rounded-2xl m-2 mt-4">
            <option value="social">Social Media</option>
            <option value="university">University</option>
            <option value="email">Email</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
        </div>

        <h3 className="text-lg font-semibold mt-4">💳 Payment Information</h3>
        <input name="bank_name" placeholder="Which bank did you transfer the payment from?" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl m-2" required />
        <input name="account_name" placeholder="Name registered with your bank account" onChange={handleChange} className="input-field w-full border-2 p-3 rounded-2xl m-2" required /><br />
        <label className="block font-bold mt-4">Proof of Payment:</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field w-full border-2 p-3 rounded-2xl cursor-pointer" required />

        <p className="text-sm ">
          By registering, you agree to our{" "}
          <button type="button" onClick={() => setShowTerms(true)} className="text-blue-500 underline">
            Terms & Conditions
          </button>
        </p>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="agree_terms" onChange={handleChange} required /> I agree to the Terms & Conditions
        </label>
        <label className="flex items-center gap-2 ">
          <input type="checkbox" name="agree_media" onChange={handleChange} required /> I consent to photography/media use
        </label>

        <button className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-700 font-bold">
          🚀 Register Now
        </button>
      </form>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-black mb-4">📜 Terms & Conditions | الشروط والأحكام</h2>
            <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
              <p><strong>By purchasing a ticket to MedRoots 2025, you agree to the following terms and conditions:</strong></p>
              <p>1️⃣ Ticket Purchase … <br />•	Each ticket grants one individual access to the conference on the specified dates and venue.
                •	Tickets must be presented (physically or digitally) upon entry.
                •	The organizer reserves the right to verify the identity of the ticket holder.
                <br /><br />  2️⃣ No Refund Policy … <br />•	All ticket sales are final.
                •	No refunds, exchanges, or transfers will be issued for any reason.
                <br /><br />  3️⃣ Event Cancellation … <br />•	If the event is cancelled, refund options may be considered at the organizer’s discretion.
                •	If the event is postponed, tickets will remain valid for the new date. No refunds will be issued.
                <br /><br /> 4️⃣ Changes to Program …<br />•	The event schedule, speakers, and sessions are subject to change without prior notice.
                •	No refunds will be issued due to program changes.
                <br /><br />  5️⃣ Code of Conduct … <br />•	Attendees must behave professionally and respectfully.
                •	Organizers reserve the right to remove individuals for misconduct, without refund.
                <br /><br /> 6️⃣ Photography …<br />•	Attendance implies consent to photography/video recording for promotional purposes.
                <br /><br />  7️⃣ Limitation of Liability … <br />•	Organizers are not liable for personal injury, loss, or damage to property.
                <br /><br /> 8️⃣ Transferability … <br />•	Tickets are non-transferable unless approved by the organizers in advance.
                <br /><br /> 9️⃣ Acceptance of Terms …<br />•	Purchasing a ticket implies agreement with all terms and conditions above.

              </p>

              <hr className="my-3" />

              <p><strong>بشرائك تذكرة لحضور مؤتمر MedRoots 2025، فإنك توافق على الشروط والأحكام التالية:</strong></p>
              <p>
                1️⃣ شراء التذكرة … <br />
                • تتيح كل تذكرة دخول فرد واحد إلى المؤتمر في التواريخ والمكان المحددين.<br />
                • يجب إبراز التذكرة (ورقية أو إلكترونية) عند الدخول.<br />
                • يحق للمنظمين التحقق من هوية حامل التذكرة.<br /><br />

                2️⃣ سياسة عدم الاسترجاع … <br />
                • جميع مبيعات التذاكر نهائية.<br />
                • لا يحق استرداد المبلغ أو استبدال التذكرة أو نقلها لأي سبب.<br /><br />

                3️⃣ إلغاء أو تأجيل الفعالية … <br />
                • في حال تم إلغاء المؤتمر، قد يتم النظر في خيارات استرداد المبلغ وفق تقدير المنظمين.<br />
                • في حال تأجيل المؤتمر، ستبقى التذكرة صالحة للتاريخ الجديد، ولن يتم إصدار أي استرداد.<br /><br />

                4️⃣ التغييرات على البرنامج … <br />
                • يحق للمنظمين تعديل جدول الفعالية أو المتحدثين أو الجلسات دون إشعار مسبق.<br />
                • لا يحق استرداد المبلغ بسبب تغييرات البرنامج.<br /><br />

                5️⃣ مدونة السلوك … <br />
                • يجب على الحضور التصرف بشكل مهني ومحترم.<br />
                • يحق للمنظمين إزالة أي شخص يسيء التصرف دون استرداد المبلغ.<br /><br />

                6️⃣ التصوير والإعلام … <br />
                • حضور المؤتمر يعني الموافقة الضمنية على التصوير أو تسجيل الفيديو لأغراض ترويجية.<br /><br />

                7️⃣ حدود المسؤولية … <br />
                • لا يتحمل المنظمون أي مسؤولية عن الإصابات الشخصية أو فقدان أو تلف الممتلكات.<br /><br />

                8️⃣ عدم قابلية النقل … <br />
                • التذاكر غير قابلة للتحويل إلا بعد موافقة المنظمين المسبقة.<br /><br />

                9️⃣ الإقرار بالشروط … <br />
                • شراء التذكرة يعني موافقتك على جميع الشروط والأحكام المذكورة أعلاه.
              </p>


            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-field {
          @apply border rounded-lg p-2 w-full bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none;
        }
      `}</style>
    </div>
  );
}
