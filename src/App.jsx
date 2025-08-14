import React, { useState, useEffect } from "react";

const App = () => {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const scopes = "user-read-email"; // you can add more scopes if needed

  const [accessToken, setAccessToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState([]);

  // Spotify Authorization
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = new URLSearchParams(hash.substring(1)).get("access_token");
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setAccessToken(token);
  }, []);

  const login = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scopes)}`;
  };

  const logout = () => {
    setAccessToken("");
    window.localStorage.removeItem("token");
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchQuery
      )}&type=artist&limit=20`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    if (data.artists?.items) {
      setProfiles(data.artists.items);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🎵 Avaify</h1>

      {!accessToken ? (
        <button onClick={login} style={styles.button}>Login with Spotify</button>
      ) : (
        <>
          <button onClick={logout} style={styles.button}>Logout</button>
          <div style={{ marginTop: "20px" }}>
            <input
              style={styles.input}
              type="text"
              placeholder="Search Spotify profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchUsers} style={styles.button}>Search</button>
          </div>

          <div style={styles.grid}>
            {profiles.map((profile) => (
              <div
                key={profile.id}
                style={styles.card}
                onClick={() =>
                  window.open(profile.external_urls.spotify, "_blank")
                }
              >
                <img
                  src={
                    profile.images?.[0]?.url ||
                    "https://via.placeholder.com/300?text=No+Image"
                  }
                  alt={profile.name}
                  style={styles.avatar}
                />
                <p style={styles.username}>{profile.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    margin: "5px",
    background: "#1DB954",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "8px",
  },
  input: {
    padding: "10px",
    width: "250px",
    marginRight: "5px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    cursor: "pointer",
    textAlign: "center",
  },
  avatar: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  username: {
    fontSize: "12px",
    marginTop: "5px",
  },
};

export default App;
