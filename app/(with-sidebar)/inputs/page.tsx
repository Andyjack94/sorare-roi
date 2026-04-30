"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { COMPETITIONS, SCARCITY } from "@/app/constants";

export default function InputsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const editId = searchParams.get("id");
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

  const submit = async () => {
    if (!type) return;

    let res;

    if (isEditing) {
      if (!editId) return;

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

      res = await supabase.from("transactions").update(updateData).eq("id", editId);
    } else {
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

  const inputStyle: React.CSSProperties = {
    padding: "0.9rem 1rem",
    border: "1px solid #475569",
    borderRadius: "8px",
    fontSize: "1.1rem",
    color: "white",
    background: "#1e293b",
    width: "100%",
  };

  const dropdownStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg fill='white' height='20' width='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><polygon points='0,0 20,0 10,12'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "1rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: 600,
  };

  const disabledButtonStyle: React.CSSProperties = {
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

  const typeButton = (value: string, label: string) => (
    <button
      key={value}
      onClick={() => setType(value)}
      style={{
        padding: "1rem 1.4rem",
        borderRadius: "10px",
        border: type === value ? "2px solid #3b82f6" : "1px solid #475569",
        background: type === value ? "#1e40af" : "#1e293b",
        color: "white",
        fontSize: "1.1rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.15s",
        minWidth: "140px",
        textAlign: "center",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="inputs-page"
      style={{
        padding: "2rem",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          textAlign: "center",
        }}
      >
        {isEditing ? "Edit Entry" : "Inputs"}
      </h1>

      {successMessage && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.8rem",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "6px",
            color: "#22c55e",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {typeButton("purchase", "Purchase")}
        {typeButton("sale", "Sale")}
        {typeButton("reward", "Reward")}
        {typeButton("deposit", "Deposit")}
        {typeButton("withdrawal", "Withdrawal")}
      </div>

      {type === "purchase" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <select
            style={dropdownStyle}
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
            style={dropdownStyle}
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

      {type === "sale" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <input
            style={inputStyle}
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <select
            style={dropdownStyle}
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
            style={dropdownStyle}
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

      {type === "reward" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <select
            style={dropdownStyle}
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

      {type === "deposit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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

      {type === "withdrawal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
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
