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
    agree_terms: false,
    agree_media: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    alert(result.success ? "✅ تم التسجيل بنجاح" : "❌ خطأ: " + result.error);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4 bg-black shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center">IEEE Member Registration</h2>

      <input name="full_name" placeholder="Full Name (as per ID)" onChange={handleChange} className="border p-2 w-full" required />
      <input name="email" placeholder="Email Address" onChange={handleChange} className="border p-2 w-full" required />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-2 w-full" required />
      <input name="institution" placeholder="Institution / Organization" onChange={handleChange} className="border p-2 w-full" required/>
      <input name="ieee_number" placeholder="IEEE Membership Number" onChange={handleChange} className="border p-2 w-full" required/>

      <label className="block font-semibold">Membership Status:</label>
      <select name="membership_status" onChange={handleChange} className="border p-2 w-full bg-black" required>
        <option value="student">Student Member</option>
        <option value="professional">Professional Member</option>
        <option value="life">Life Member</option>
      </select>

      <label className="block font-semibold">Ticket Type:</label>
      <select name="ticket_type" onChange={handleChange} className="border p-2 w-full  bg-black" required>
        <option value="standard_ieee">Standard IEEE Member Ticket</option>
        <option value="vip_ieee">VIP IEEE Member Ticket</option>
      </select>

      <label className="block font-semibold" required>Track Selection:</label>
      <select name="track" onChange={handleChange} className="border p-2 w-full  bg-black">
        <option value="A">Track A: Cyber-Physical Systems in Healthcare</option>
        <option value="B">Track B: Bioprinting & Prosthetic Engineering</option>
      </select>

      <input name="dietary" placeholder="Dietary restrictions or allergies" onChange={handleChange} className="border p-2 w-full" />

      <label className="block font-semibold">How did you hear about the conference?</label>
      <select name="hear_about" onChange={handleChange} className="border p-2 w-full  bg-black">
        <option value="social">Social Media</option>
        <option value="university">University</option>
        <option value="email">Email</option>
        <option value="colleague">Colleague</option>
        <option value="other">Other</option>
      </select>

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
