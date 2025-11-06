package com.musicplayer.musicplayer.repository;
import org.springframework.data.mongodb.repository.MongoRepository; 

import com.musicplayer.musicplayer.model.Albums;
public interface AlbumsRepository extends MongoRepository<Albums, String> {
    Albums findBytitle(String title);
}
