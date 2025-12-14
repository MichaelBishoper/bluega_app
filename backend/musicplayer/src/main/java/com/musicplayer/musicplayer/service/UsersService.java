package com.musicplayer.musicplayer.service;

//import dependencies beansssss and services
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Users;
import com.musicplayer.musicplayer.repository.UsersRepository;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Users login(String username, String rawPassword) {
        Users user = usersRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // user.password is WRITE_ONLY in JSON, so it won't be sent to frontend
        return user;
    }


    public Users saveSong(String userId, String songId) {
        Users user = usersRepository.findById(userId).orElse(null);
        if (user == null) throw new RuntimeException("User not found");
        if (user.getSavedSongs() == null) user.setSavedSongs(new java.util.ArrayList<>());
        if (!user.getSavedSongs().contains(songId)) {
            user.getSavedSongs().add(songId);
            usersRepository.save(user);
        } else {
            throw new RuntimeException("Song already saved");
        }
        return user;
    }

    public Users unsaveSong(String userId, String songId) {
        Users user = usersRepository.findById(userId).orElse(null);
        if (user == null) throw new RuntimeException("User not found");
        if (user.getSavedSongs() == null || !user.getSavedSongs().contains(songId)) {
            throw new RuntimeException("Song not saved");
        }
        user.getSavedSongs().remove(songId);
        usersRepository.save(user);
        return user;
    }

    public Users addUser(Users user) {
        // validate username not empty
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new RuntimeException("Username cannot be empty");
        }

        Users existing = usersRepository.findByUsername(user.getUsername());
        //check if username already exists
        if (existing != null) {
            throw new RuntimeException("Username already exists");
        }

            user.setPassword(passwordEncoder.encode(user.getPassword())); //added password encoding/hashing here
            return usersRepository.save(user);
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Users getUserById(String id) {
        return usersRepository.findById(id).orElse(null);
    }

    public Users updateUser(String id, Users newUserData) {
        Users existingUser = usersRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }

        // Only update the fields that were actually sent (non-null)
        if (newUserData.getUsername() != null) {
            existingUser.setUsername(newUserData.getUsername());
        }
        if (newUserData.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(newUserData.getPassword())); //added password encoding/hashing here
        }
        if (newUserData.getFollowingids() != null) {
            existingUser.setFollowingids(newUserData.getFollowingids());
        }

        return usersRepository.save(existingUser);
    }

    public void deleteUser(String id) {
        // Remove this id from other users' following lists
        List<Users> allUsers = usersRepository.findAll();
        for (Users u : allUsers) {
            if (u.getFollowingids() != null && u.getFollowingids().contains(id)) {
                u.getFollowingids().remove(id);
                usersRepository.save(u); // update the user
            }
        }

        // Now delete the user
        usersRepository.deleteById(id);
    }

    public Users followUser(String userId, String targetId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getFollowingids() == null) {
            user.setFollowingids(new java.util.ArrayList<>());
        }

        // Prevent user from following themselves
        if (userId.equals(targetId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        //  prevent duplicates
        if (!user.getFollowingids().contains(targetId)) {
            user.getFollowingids().add(targetId);
            usersRepository.save(user);
        } else{
            throw new RuntimeException("You are already following this user");
        }

        return user;
    }

    public Users unfollowUser(String userId, String targetId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent user from unfollowing themselves
        if (userId.equals(targetId)) {
            throw new RuntimeException("You cannot unfollow yourself");
        }

        if (user.getFollowingids() != null && user.getFollowingids().contains(targetId)) {
            user.getFollowingids().remove(targetId);
            usersRepository.save(user);
        } else {
            throw new RuntimeException("You are not following this user");
        }

        return user;
    }
    
}
