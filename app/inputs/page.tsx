"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { COMPETITIONS, SCARCITY } from "@/app/constants";

export default function InputsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("id"); // string | null
  const isEditing = Boolean(editId);

  const [type, setType] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [scarcity, setScarcity] = useState("");
  const [competition, setCompetition] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [saleValue, setSaleValue] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [dwValue, setDwValue] = useState("");
  const [date, setDate] = useState("");
  const [cardId, setCardId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // PREFILL WHEN EDITING
  useEffect(() => {
    if (!isEditing) return;

    setType(searchParams.get("type") || "");
    setPlayerName(searchParams.get("player_name") || "");
    setScarcity(searchParams.get("scarcity") || "");
    setCompetition(searchParams.get("competition") || "");
    setPurchaseValue(searchParams.get("purchase_value") || "");
    setSaleValue(searchParams.get("sale_value") || "");
    setRewardValue(searchParams.get("reward_value") || "");
    setDwValue(searchParams.get("dwValue") || "");
    setDate(searchParams.get("date") || "");
    setCardId(searchParams.get("card_id") || "");
  }, [isEditing, searchParams]);

  // RESET FIELDS
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

  // SUBMIT HANDLER
  const submit = async () => {
    if (!type) return;

    let res;

    if (isEditing) {
      // UPDATE EXISTING ROW
      if (!editId) {
        console.error("No editId provided for update");
        return;
      }

      const updateData: any = {
        type,
        player_name: playerName,
        scarcity,
        competition,
        date,
        card_id: cardId,
      };

      if (type === "purchase") updateData.purchase_value = Number(purchaseValue);
      if (type === "sale") updateData.sale_value = Number(saleValue);
      if (type === "reward") updateData.sale_value = Number(rewardValue);
      if (type === "deposit") updateData.purchase_value = Number(dwValue);
      if (type === "withdrawal") updateData.purchase_value = Number(dwValue) * -1;

      res = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", editId);
    } else {
      // INSERT NEW ROW
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
    }

    if (res?.error) {
      alert(`Supabase error: ${res.error.message}`);
      return;
    }

    resetFields();
    setType("");

    setSuccessMessage(isEditing ? "Entry updated!" : "Entry submitted!");
    setTimeout(() => setSuccessMessage(""), 2500);

    if (isEditing) router.push("/database");
  };

  // STYLES
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

  // VALIDATION
  const isPurchaseValid =
    playerName && scarcity && competition && purchaseValue && date && cardId;

  const isSaleValid =
    playerName && scarcity && competition && saleValue && date && cardId;

  const isRewardValid = competition && rewardValue && date;

  const isDepositValid = dwValue && date;

  const isWithdrawalValid = dwValue && date;

  // RENDER
  return (
    <div style={{ padding: "2rem", background: "white", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isEditing ? "Edit Entry" : "Inputs"}
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

      {/* TYPE SELECTOR */}
      <select
        style={{ ...inputStyle, marginBottom: "1.5rem" }}
        value={type}
        onChange={(e) => setType(e.target.value.trim())}
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
            {isEditing ? "Update Purchase" : "Submit Purchase"}
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
            {isEditing ? "Update Sale" : "Submit Sale"}
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
            {isEditing ? "Update Reward" : "Submit Reward"}
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
            {isEditing ? "Update Deposit" : "Submit Deposit"}
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
            {isEditing ? "Update Withdrawal" : "Submit Withdrawal"}
          </button>
        </div>
      )}
    </div>
  );
}
