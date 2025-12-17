import ProfileAvatar from "../components/ProfileAvatar";

export default function SearchUserAvatar({ name }) {
  return (
    <div
      style={{
        width: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <ProfileAvatar name={name} size={64} />

      <span
        style={{
          marginTop: "8px",
          fontSize: "0.8rem",
          color: "#fff",
          textAlign: "center",

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 80,
        }}
        title={name}
      >
        {name}
      </span>
    </div>
  );
}
