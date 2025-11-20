// src/data/Following.jsx

export const followingUsers = [
  {
    name: "Kor Jem",
    username: "d4vd",
    image: "/picture/artur.png"
  },
  {
    name: "Kor Jem",
    username: "d4vd",
    image: "/images/users/korjem.jpg"
  },

];

// OPTIONAL: Add function for uploading (dynamic add)
export function addFollowingUser(newUser) {
  followingUsers.push(newUser);
}
