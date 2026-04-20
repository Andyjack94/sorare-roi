"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InputsPage() {
  const [type, setType] = useState(""); // purchase | sale | reward

  const [playerName, setPlayerName] = useState("");
  const [scarcity, setScarcity] = useState("");
  const [competition, setCompetition] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [saleValue, setSaleValue] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [date, setDate] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // ⭐ FULL COMPETITION LIST
  const competitions = [
    "All Star (Pre-2023)",
    "Beat the Game Limited",
    "Beat the Game Rare",
    "Bundesliga 2026",
    "Cap 240 Limited",
    "Cap 240 Rare",
    "Champion 24/25",
    "Challenger 24/25",
    "Challenger 2026",
    "Contender 24/25",
    "Eredivisie 2026",
    "La Liga 2026",
    "Ligue 1 2026",
    "MLS 2026",
    "MLS 2027",
    "Premier League 2026",
  ];

  const resetFields = () => {
    setPlayerName("");
    setScarcity("");
    setCompetition("");
    setPurchaseValue("");
    setSaleValue("");
    setRewardValue("");
    setDate("");
  };

  const submit = async () => {
    if (!type) return;

    if (type === "purchase") {
      await supabase.from("transactions").insert({
        type: "purchase",
        player_name: playerName,
        scarcity,
        competition,
        purchase_value: Number(purchaseValue),
        date,
      });
    }

    if (type === "sale") {
      await supabase.from("transactions").insert({
        type: "sale",
        player_name: playerName,
        scarcity,
        competition,
        sale_value: Number(saleValue),
        date,
      });
    }

    if (type === "reward") {
      await supabase.from("transactions").insert({
        type: "reward",
        competition,
        sale_value: Number(rewardValue),
        date,
      });
    }

    resetFields();
    setType("");

    // ⭐ Show success message
    setSuccessMessage("✔ Entry submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 2500);
  };

  // ⭐ Shared input style
  const inputStyle = {
    padding: "0.6rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "black",
    background: "white",
  };

  // ⭐ Shared button styles
  const buttonStyle = {
    padding: "0.7rem",
    background: "white",
    color: "black",
    border: "2px solid black",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.4,
    cursor: "not-allowed",
  };

  // ⭐ Validation logic per form type
  const isPurchaseValid =
    playerName && scarcity && competition && purchaseValue && date;

  const isSaleValid =
    playerName && scarcity && competition && saleValue && date;

  const isRewardValid = competition && rewardValue && date;

  return (
    <div style={{ padding: "2rem", background: "white", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Inputs
      </h1>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.8rem",
            background: "#d1fae5",
            border: "1px solid #10b981",
            borderRadius: "6px",
            color: "#065f46",
            fontWeight: 600,
          }}
        >
          {successMessage}
        </div>
      )}

      {/* TYPE SELECTOR */}
      <select
        style={{ ...inputStyle, marginBottom: "1.5rem" }}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="purchase">Purchase</option>
        <option value="sale">Sale</option>
        <option value="reward">Reward</option>
      </select>

      {/* PURCHASE FORM */}
      {type === "purchase" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Scarcity"
            value={scarcity}
            onChange={(e) => setScarcity(e.target.value)}
          />

          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {competitions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Purchase Value (£)"
            value={purchaseValue}
            onChange={(e) => setPurchaseValue(e.target.value)}
          />

          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={!isPurchaseValid}
            style={isPurchaseValid ? buttonStyle : disabledButtonStyle}
          >
            Submit Purchase
          </button>
        </div>
      )}

      {/* SALE FORM */}
      {type === "sale" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Scarcity"
            value={scarcity}
            onChange={(e) => setScarcity(e.target.value)}
          />

          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {competitions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Sale Value (£)"
            value={saleValue}
            onChange={(e) => setSaleValue(e.target.value)}
          />

          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={!isSaleValid}
            style={isSaleValid ? buttonStyle : disabledButtonStyle}
          >
            Submit Sale
          </button>
        </div>
      )}

      {/* REWARD FORM */}
      {type === "reward" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {competitions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Reward Value (£)"
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
          />

          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={!isRewardValid}
            style={isRewardValid ? buttonStyle : disabledButtonStyle}
          >
            Submit Reward
          </button>
        </div>
      )}
    </div>
  );
}
