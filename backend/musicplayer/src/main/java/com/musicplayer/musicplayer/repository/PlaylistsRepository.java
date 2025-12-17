package com.musicplayer.musicplayer.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.musicplayer.musicplayer.model.Playlists;

public interface PlaylistsRepository extends MongoRepository<Playlists, String> {

    List<Playlists> findByCreatorId(String creatorId);

    Playlists findByCreatorIdAndPlaylistName(String creatorId, String playlistName);
}
