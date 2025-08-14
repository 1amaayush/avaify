import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const searchSpotifyUsers = async () => {
    try {
      const token = await getSpotifyToken();
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query, type: "user", limit: 50 }
      });
      setUsers(response.data.users.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getSpotifyToken = async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const scopes = "";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Avaify</h1>
      <input
        type="text"
        placeholder="Enter Spotify username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchSpotifyUsers}>Search</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px", marginTop: "20px" }}>
        {users.map(user => (
          <div key={user.id} style={{ textAlign: "center" }}>
            <a href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img
                src={user.images?.[0]?.url || "/default-avatar.png"}
                alt={user.display_name}
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />
            </a>
            <p style={{ fontSize: "0.8em", marginTop: "5px" }}>{user.display_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
