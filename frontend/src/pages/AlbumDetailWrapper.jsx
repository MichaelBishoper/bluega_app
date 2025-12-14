// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import AlbumDetailPage from "./AlbumDetailPage";
// import { dummyAlbums } from "../data/dummyAlbums"; // sementara

// export default function AlbumDetailWrapper() {
//   const { albumId } = useParams();
//   const navigate = useNavigate();

//   const album = dummyAlbums.find(
//     (a) => String(a.id) === albumId
//   );

//   return (
//     <AlbumDetailPage
//       album={album}
//       onBack={() => navigate("/albums")}
//     />
//   );
// }
