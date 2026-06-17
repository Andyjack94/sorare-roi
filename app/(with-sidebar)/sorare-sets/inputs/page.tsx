"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SorareSetsInputs() {
  const client = supabase as any;

  const [form, setForm] = useState({
    type: "",
    date: "",
    set: "",
    value: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handle = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await client.from("sorare_sets").insert({
      type: form.type,
      date: form.date,
      set: form.set,
      value: Number(form.value),
    });

    setForm({ type: "", date: "", set: "", value: "" });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        padding: "2rem",
        borderRadius: "12px",
        color: "white",
        position: "relative",
      }}
    >
      <style>
        {`
          /* ============================================
             NUCLEAR OVERRIDES — NOTHING BEATS THESE
             ============================================ */

          /* Inputs (including Value) */
          input.sets-input {
            color: white !important;
            -webkit-text-fill-color: white !important;
            background-color: #0f172a !important;
          }

          /* Selects */
          select.sets-input,
          select.sets-input * {
            color: white !important;
            -webkit-text-fill-color: white !important;
            background-color: #0f172a !important;
          }

          /* Options */
          .sets-input option {
            color: white !important;
            background-color: #0f172a !important;
          }

          /* Date input text */
          .sets-input::-webkit-datetime-edit,
          .sets-input::-webkit-datetime-edit-text,
          .sets-input::-webkit-datetime-edit-month-field,
          .sets-input::-webkit-datetime-edit-day-field,
          .sets-input::-webkit-datetime-edit-year-field {
            color: white !important;
            -webkit-text-fill-color: white !important;
          }

          /* Calendar icon */
          .sets-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }

          /* Submit button text */
          button.sets-submit {
            color: white !important;
            -webkit-text-fill-color: white !important;
          }
        `}
      </style>

      {/* SUCCESS POPUP */}
      {submitted && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "20px",
            background: "#22c55e",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            fontWeight: 600,
            color: "white",
            border: "1px solid #15803d",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          Entry Submitted ✓
        </div>
      )}

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        Add Sorare Set Entry
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handle}
          className="sets-input"
          style={inputStyle}
        >
          <option value="">Select Type</option>
          <option value="Purchase">Purchase</option>
          <option value="Reward">Reward</option>
        </select>

        {/* Date */}
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handle}
          className="sets-input"
          style={inputStyle}
        />

        {/* Set */}
        <select
          name="set"
          value={form.set}
          onChange={handle}
          className="sets-input"
          style={inputStyle}
        >
          <option value="">Select Set</option>
          <option value="Colours">Colours</option>
          <option value="Stellar Nights">Stellar Nights</option>
          <option value="WNTR">WNTR</option>
        </select>

        {/* Value */}
        <input
          name="value"
          placeholder="Value (£)"
          value={form.value}
          onChange={handle}
          className="sets-input"
          style={inputStyle}
        />

        {/* SUBMIT BUTTON — NOW FORCED WHITE */}
        <button
          onClick={submit}
          className="sets-submit"
          style={{
            padding: "1rem",
            background: "#1e40af",
            borderRadius: "12px",
            fontWeight: 700,
            border: "1px solid #3b82f6",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1e40af")}
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
