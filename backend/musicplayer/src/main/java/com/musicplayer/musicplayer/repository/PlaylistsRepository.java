package com.musicplayer.musicplayer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.musicplayer.musicplayer.model.Playlists;

public interface PlaylistsRepository extends MongoRepository<Playlists, String> {
	// Find playlists by creatorId (used to get playlists created by a specific user)
	java.util.List<Playlists> findByCreatorId(String creatorId);
	Playlists findByPlaylistName(String playlistName); // used by playlist post and put method to check if playlist name exists

}