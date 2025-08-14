import React, { useState } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const params = new URLSearchParams({
      q: searchTerm,
      type: "user",
      limit: 20
    });

    try {
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
            ),
        },
        body: "grant_type=client_credentials",
      });

      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProfiles(data.users?.items || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎵 Avaify</h1>
      <input
        type="text"
        placeholder="Enter Spotify username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        Search
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {profiles.map((profile) => (
          <div
            key={profile.id}
            style={{
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() =>
              window.open(profile.external_urls.spotify, "_blank")
            }
          >
            <img
              src={profile.images?.[0]?.url || "/default-avatar.png"}
              alt={profile.display_name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <div
              style={{
                fontSize: "12px",
                marginTop: "5px",
                wordBreak: "break-word",
              }}
            >
              {profile.display_name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
