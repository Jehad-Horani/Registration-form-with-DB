"use client";
import { useState } from "react";

export default function IEEERegisterForm() {
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

  const [file, setFile] = useState(null);

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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center">IEEE Member Registration</h2>

      {/* بقية الحقول القديمة */}
      <input name="full_name" placeholder="Full Name" onChange={handleChange} className="border p-2 w-full" required />
      <input name="email" placeholder="Email Address" onChange={handleChange} className="border p-2 w-full" required />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-2 w-full" required />
      <input name="institution" placeholder="Institution / Organization" onChange={handleChange} className="border p-2 w-full" />
      <input name="ieee_number" placeholder="IEEE Membership Number" onChange={handleChange} className="border p-2 w-full" />

      {/* ... باقي الفورم مثل قبل */}

      {/* قسم الدفع */}
      <h3 className="text-lg font-semibold mt-4">💳 Payment Information</h3>
      <input
        name="bank_name"
        placeholder="Which bank did you transfer the payment from?"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        name="account_name"
        placeholder="Name registered with your bank account"
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <label className="block">Proof of Payment:</label>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full" required />

      {/* الموافقة */}
      <label className="flex items-center gap-2">
        <input type="checkbox" name="agree_terms" onChange={handleChange} required /> I agree to the Terms & Conditions
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="agree_media" onChange={handleChange} required /> I consent to photography/media use
      </label>

      <button className="bg-blue-600 text-white p-3 rounded-lg w-full">Register</button>
    </form>
  );
}
