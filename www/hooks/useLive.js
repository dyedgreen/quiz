import { useState, useEffect } from "/preact.js";
import usePlayer from "/hooks/usePlayer.js";

const url = gameId => `${document.location.protocol.includes("https") ? "wss://" : "ws://"}${document.location.host}/api/live/${gameId}`;

export default function useLive(gameId) {
  const playerId = usePlayer();

  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url(gameId));
    setWs(ws);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setError(true);

    ws.onmessage = event => {
      if (typeof event.data !== "string")
        return console.warn("Unexpected message:", event);
      try {
        const payload = JSON.parse(event.data);
        switch (payload.type) {
          case "player-list":
            setPlayers(payload.players);
            payload.players.forEach(({id, name}) => {
              if (id === playerId)
                setName(name);
            })
            break;
        }
      } catch (err) {
        console.error("Invalid payload:", err);
      }
    };
  }, []);

  const setPlayerName = name => {
    if (!connected)
      return;
    ws.send(JSON.stringify({ type: "add-player", playerId, name }));
    setName(name);
  };

  const setPlayerReady = () => {
    if (!connected)
      return;
    ws.send(JSON.stringify({ type: "set-player-ready", playerId }));
  };

  return {
    connected,
    error,
    players,
    player: {
      id: playerId,
      name,
      ready: players.find(p => p.id === playerId && p.ready) != null,
    },
    actions: {
      setPlayerName,
      setPlayerReady,
    },
  };
}
