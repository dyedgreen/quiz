import { useState, useEffect } from "/preact.js";
import { v4 as uuidv4 } from "/uuid.js";

export default function usePlayer() {
  const playerId = window.localStorage.getItem("player") || uuidv4();
  useEffect(() => {
    window.localStorage.setItem("player", playerId);
  });
  return playerId;
}
