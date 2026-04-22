"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { COMPETITIONS, SCARCITY } from "@/app/constants";

export default function InputsPage() {
  const [type, setType] = useState(""); // purchase | sale | reward | deposit | withdrawal

  const [playerName, setPlayerName] = useState("");
  const [scarcity, setScarcity] = useState("");
  const [competition, setCompetition] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [saleValue, setSaleValue] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [dwValue, setDwValue] = useState(""); // Deposit / Withdrawal
  const [date, setDate] = useState("");
  const [cardId, setCardId] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const resetFields = () => {
    setPlayerName("");
    setScarcity("");
    setCompetition("");
    setPurchaseValue("");
    setSaleValue("");
    setRewardValue("");
    setDwValue("");
    setDate("");
    setCardId("");
  };

  // ⭐⭐⭐ FULL DEBUGGING SUBMIT FUNCTION ⭐⭐⭐
  const submit = async () => {
    if (!type) return;

    console.log("SUBMIT TYPE:", JSON.stringify(type));
    console.log("DATE VALUE:", JSON.stringify(date));

    let res;

    if (type === "purchase") {
      res = await supabase.from("transactions").insert({
        type: "purchase",
        player_name: playerName,
        scarcity,
        competition,
        purchase_value: Number(purchaseValue),
        date,
        card_id: cardId,
      });
    }

    if (type === "sale") {
      res = await supabase.from("transactions").insert({
        type: "sale",
        player_name: playerName,
        scarcity,
        competition,
        sale_value: Number(saleValue),
        date,
        card_id: cardId,
      });
    }

    if (type === "reward") {
      res = await supabase.from("transactions").insert({
        type: "reward",
        competition,
        sale_value: Number(rewardValue),
        date,
        card_id: null,
      });
    }

    if (type === "deposit") {
      res = await supabase.from("transactions").insert({
        type: "deposit",
        purchase_value: Number(dwValue),
        date,
        card_id: null,
      });
    }

    if (type === "withdrawal") {
      res = await supabase.from("transactions").insert({
        type: "withdrawal",
        purchase_value: Number(dwValue) * -1,
        date,
        card_id: null,
      });
    }

    console.log("SUPABASE RESPONSE:", res);

    if (res?.error) {
      alert(`Supabase error: ${res.error.message}`);
      return;
    }

    resetFields();
    setType("");

    setSuccessMessage("✔ Entry submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 2500);
  };
  // ⭐⭐⭐ END SUBMIT ⭐⭐⭐

  const inputStyle = {
    padding: "0.6rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "black",
    background: "white",
  };

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

  const isPurchaseValid =
    playerName && scarcity && competition && purchaseValue && date && cardId;

  const isSaleValid =
    playerName && scarcity && competition && saleValue && date && cardId;

  const isRewardValid = competition && rewardValue && date;

  const isDepositValid = dwValue && date;
  const isWithdrawalValid = dwValue && date;

  return (
    <div style={{ padding: "2rem", background: "white", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Inputs
      </h1>

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

      <select
        style={{ ...inputStyle, marginBottom: "1.5rem" }}
        value={type}
        onChange={(e) => {
          setType(e.target.value.trim()); // ⭐ FIX
          setDate(""); // reset date on type change
        }}
      >
        <option value="">Select Type</option>
        <option value="purchase">Purchase</option>
        <option value="sale">Sale</option>
        <option value="reward">Reward</option>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
      </select>

      {/* PURCHASE */}
      {type === "purchase" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <select
            style={inputStyle}
            value={scarcity}
            onChange={(e) => setScarcity(e.target.value)}
          >
            <option value="">Select Scarcity</option>
            {SCARCITY.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {COMPETITIONS.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Card ID"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
          />

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

      {/* SALE */}
      {type === "sale" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <select
            style={inputStyle}
            value={scarcity}
            onChange={(e) => setScarcity(e.target.value)}
          >
            <option value="">Select Scarcity</option>
            {SCARCITY.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {COMPETITIONS.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Card ID"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
          />

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

      {/* REWARD */}
      {type === "reward" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <select
            style={inputStyle}
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
          >
            <option value="">Select Competition</option>
            {COMPETITIONS.map((c: string) => (
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

      {/* DEPOSIT */}
      {type === "deposit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Deposit Value (£)"
            value={dwValue}
            onChange={(e) => setDwValue(e.target.value)}
          />

          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={!isDepositValid}
            style={isDepositValid ? buttonStyle : disabledButtonStyle}
          >
            Submit Deposit
          </button>
        </div>
      )}

      {/* WITHDRAWAL */}
      {type === "withdrawal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={inputStyle}
            placeholder="Withdrawal Value (£)"
            value={dwValue}
            onChange={(e) => setDwValue(e.target.value)}
          />

          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={submit}
            disabled={!isWithdrawalValid}
            style={isWithdrawalValid ? buttonStyle : disabledButtonStyle}
          >
            Submit Withdrawal
          </button>
        </div>
      )}
    </div>
  );
}
