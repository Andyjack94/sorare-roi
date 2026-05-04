"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WithdrawalsPage() {
  const client = supabase as any;

  const [form, setForm] = useState({
    date: "",
    value: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await client.from("lozjones97_withdrawals").insert({
      date: form.date,
      value: Number(form.value),
    });

    setForm({ date: "", value: "" });
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
      <style>
        {`
          .nce-input {
            color: white;
          }

          .nce-input::placeholder {
            color: white;
            opacity: 1;
          }

          .nce-input::-webkit-datetime-edit,
          .nce-input::-webkit-datetime-edit-text,
          .nce-input::-webkit-datetime-edit-month-field,
          .nce-input::-webkit-datetime-edit-day-field,
          .nce-input::-webkit-datetime-edit-year-field {
            color: white;
          }

          .nce-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }
        `}
      </style>

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Add Withdrawal
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="nce-input"
          style={inputStyle}
        />

        <input
          name="value"
          placeholder="Withdrawal Value"
          value={form.value}
          onChange={handleChange}
          className="nce-input"
          style={inputStyle}
        />

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
