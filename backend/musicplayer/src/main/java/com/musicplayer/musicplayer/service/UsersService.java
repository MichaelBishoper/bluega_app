package com.musicplayer.musicplayer.service;

//import dependencies beansssss and services
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Users;
import com.musicplayer.musicplayer.repository.UsersRepository;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    public Users addUser(Users user) {
        Users existing = usersRepository.findByUsername(user.getUsername());
        //check if username already exists
        if (existing != null) {
            throw new RuntimeException("Username already exists");
        }
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
            existingUser.setPassword(newUserData.getPassword());
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
    
}
