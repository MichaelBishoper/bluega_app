package com.musicplayer.musicplayer.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.musicplayer.musicplayer.model.Songs;

public interface SongsRepository extends MongoRepository<Songs, String> {
}
