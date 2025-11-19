package com.musicplayer.musicplayer.repository;
import org.springframework.data.mongodb.repository.MongoRepository; //importing MongoRepository

import com.musicplayer.musicplayer.model.Users;
public interface UsersRepository extends MongoRepository<Users, String> {
    Users findByUsername(String username); //used by user post methhod to check if username exists
}

