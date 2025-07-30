"use client";
import { useState } from "react";

export default function IEEERegisterForm() {
  const [showTerms, setShowTerms] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
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
    alert(result.success ? "✅ Registered Successfully" : "❌ Error: " + result.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-5"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-900">
          IEEE Member Registration
        </h1>
        <p className="text-center text-gray-500">Register now for MedRoots 2025</p>

        <div className="space-y-3">
          <input name="full_name" placeholder="Full Name (as per ID)" onChange={handleChange} className="input-field" required />
          <input name="email" placeholder="Email Address" onChange={handleChange} className="input-field" required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} className="input-field" required />
          <input name="institution" placeholder="Institution / Organization" onChange={handleChange} className="input-field" required />
          <input name="ieee_number" placeholder="IEEE Membership Number" onChange={handleChange} className="input-field" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-gray-700">Membership Status:</label>
            <select name="membership_status" onChange={handleChange} className="input-field" required>
              <option value="student">Student Member</option>
              <option value="professional">Professional Member</option>
              <option value="life">Life Member</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Ticket Type:</label>
            <select name="ticket_type" onChange={handleChange} className="input-field" required>
              <option value="standard_ieee">Standard IEEE Ticket</option>
              <option value="vip_ieee">VIP IEEE Ticket</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Track Selection:</label>
          <select name="track" onChange={handleChange} className="input-field" required>
            <option value="A">Track A: Cyber-Physical Systems in Healthcare</option>
            <option value="B">Track B: Bioprinting & Prosthetic Engineering</option>
          </select>
        </div>

        <input name="dietary" placeholder="Dietary restrictions or allergies" onChange={handleChange} className="input-field" />

        <div>
          <label className="font-semibold text-gray-700">How did you hear about the conference?</label>
          <select name="hear_about" onChange={handleChange} className="input-field">
            <option value="social">Social Media</option>
            <option value="university">University</option>
            <option value="email">Email</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">💳 Payment Information</h3>
        <input name="bank_name" placeholder="Which bank did you transfer the payment from?" onChange={handleChange} className="input-field" required />
        <input name="account_name" placeholder="Name registered with your bank account" onChange={handleChange} className="input-field" required />
        <label className="block text-gray-700">Proof of Payment:</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" required />

        <p className="text-sm text-gray-600">
          By registering, you agree to our{" "}
          <button type="button" onClick={() => setShowTerms(true)} className="text-blue-500 underline">
            Terms & Conditions
          </button>
        </p>

        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" name="agree_terms" onChange={handleChange} required /> I agree to the Terms & Conditions
        </label>
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" name="agree_media" onChange={handleChange} required /> I consent to photography/media use
        </label>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold">
          🚀 Register Now
        </button>
      </form>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">📜 Terms & Conditions | الشروط والأحكام</h2>
            <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
              <p><strong>By purchasing a ticket to MedRoots 2025, you agree to the following terms and conditions:</strong></p>
              <p>1️⃣ Ticket Purchase …  2️⃣ No Refund Policy …  3️⃣ Event Cancellation …  4️⃣ Changes to Program …  5️⃣ Code of Conduct …  6️⃣ Photography …  7️⃣ Limitation of Liability …  8️⃣ Transferability …  9️⃣ Acceptance of Terms …</p>

              <hr className="my-3" />

              <p className="text-right">
                <strong>الشروط والأحكام:</strong> بشرائك تذكرة لحضور مؤتمر MedRoots 2025 فإنك توافق على التالي…  
                ١️⃣ شراء التذكرة …  ٢️⃣ سياسة عدم الاسترجاع …  ٣️⃣ إلغاء أو تأجيل المؤتمر …  ٤️⃣ تعديلات على البرنامج …  ٥️⃣ مدونة السلوك …  ٦️⃣ التصوير والإعلام …  ٧️⃣ حدود المسؤولية …  ٨️⃣ عدم قابلية النقل …  ٩️⃣ الإقرار بالشروط …
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
