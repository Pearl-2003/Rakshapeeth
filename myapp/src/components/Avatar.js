import React from "react";

export default function Avatar({ photoURL, name, size = 45, onClick }) {
  const savedAvatar = localStorage.getItem("avatar");   // cartoon avatar
  const userPhoto = localStorage.getItem("userPhoto");  // original photo
  const role = localStorage.getItem("role");            // A/G/P/S fallback

  let finalAvatar = savedAvatar || userPhoto || role || name || "U";

  // If final avatar is a URL -> show image
  const isImage = typeof finalAvatar === "string" && finalAvatar.startsWith("http");

  return (
    <div onClick={onClick} className="cursor-pointer">
      {isImage ? (
        <img
          src={finalAvatar}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "#5a3e2b",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {finalAvatar.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
