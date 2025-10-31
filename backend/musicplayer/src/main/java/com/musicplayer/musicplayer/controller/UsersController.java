package com.musicplayer.musicplayer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.musicplayer.musicplayer.model.Users;
import com.musicplayer.musicplayer.service.UsersService;
@RestController
@RequestMapping("api/users")
public class UsersController {
    @Autowired
    private UsersService usersService;


    @PostMapping
    public Users addUser(@RequestBody Users user) {
        return usersService.addUser(user);
    }
    
    @GetMapping
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable String id) {
        return usersService.getUserById(id);
    }
    
    @PutMapping("/{id}")
    public Users updateUser(@PathVariable String id, @RequestBody Users user) {
        return usersService.updateUser(id, user);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        usersService.deleteUser(id);
    }

    @PutMapping("/{userId}/follow/{targetId}") // IMPORTANT DO NOT ADD FOLLOWINGIDS DIRECTLY WITH PUT /API/USERS 
    public Users followUser(@PathVariable String userId, @PathVariable String targetId) {
        return usersService.followUser(userId, targetId);
    }

    @PutMapping("/{userId}/unfollow/{targetId}")
    public Users unfollowUser(@PathVariable String userId, @PathVariable String targetId) {
        return usersService.unfollowUser(userId, targetId);
    }


}