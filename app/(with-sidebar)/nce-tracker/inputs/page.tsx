"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InputsPage() {
  const [form, setForm] = useState({
    date: "",
    account: "",
    reward_value: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await supabase.from("nce_inputs").insert({
      date: form.date,
      account: form.account,
      reward_value: Number(form.reward_value),
    });

    setForm({ date: "", account: "", reward_value: "" });
  };

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        padding: "2rem",
        borderRadius: "12px",
        color: "white",
      }}
    >
      {/* Local CSS for placeholder, date input, and SELECT styling */}
      <style>
        {`
          .nce-input {
            color: white;
          }

          .nce-input::placeholder {
            color: white;
            opacity: 1;
          }

          /* Force date text to be white */
          .nce-input::-webkit-datetime-edit,
          .nce-input::-webkit-datetime-edit-text,
          .nce-input::-webkit-datetime-edit-month-field,
          .nce-input::-webkit-datetime-edit-day-field,
          .nce-input::-webkit-datetime-edit-year-field {
            color: white;
          }

          /* Calendar icon */
          .nce-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }

          /* SELECT text forced to white */
          select.nce-input {
            color: white !important;
          }

          /* SELECT dropdown options forced to white */
          select.nce-input option {
            color: white;
            background: #0f172a;
          }
        `}
      </style>

      {/* Centered Title */}
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "white",
        }}
      >
        Add Reward Input
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* DATE */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="nce-input"
          style={inputStyle}
        />

        {/* ACCOUNT DROPDOWN */}
        <select
          name="account"
          value={form.account}
          onChange={handleChange}
          className="nce-input"
          style={{
            ...inputStyle,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage:
              "linear-gradient(45deg, transparent 50%, white 50%), linear-gradient(135deg, white 50%, transparent 50%)",
            backgroundPosition:
              "calc(100% - 20px) calc(50% - 3px), calc(100% - 15px) calc(50% - 3px)",
            backgroundSize: "5px 5px, 5px 5px",
            backgroundRepeat: "no-repeat",
          }}
        >
          <option value="" disabled>
            Select Account
          </option>
          <option value="LozJones97">LozJones97</option>
          <option value="AndyisaGooden">AndyisaGooden</option>
        </select>

        {/* REWARD VALUE */}
        <input
          name="reward_value"
          placeholder="Reward Value"
          value={form.reward_value}
          onChange={handleChange}
          className="nce-input"
          style={inputStyle}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={submit}
          style={{
            padding: "0.8rem",
            background: "#1e40af",
            borderRadius: "8px",
            fontWeight: 600,
            color: "white",
            border: "none",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.8rem",
  borderRadius: "8px",
  background: "#0f172a",
  border: "1px solid #334155",
  color: "white",
  fontSize: "1rem",
  width: "100%",
  outline: "none",
};
