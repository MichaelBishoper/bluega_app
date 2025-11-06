package com.musicplayer.musicplayer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.musicplayer.musicplayer.model.Playlists;

public interface PlaylistsRepository extends MongoRepository<Playlists, String> {
}