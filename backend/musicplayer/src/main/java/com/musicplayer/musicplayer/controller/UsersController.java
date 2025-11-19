package com.musicplayer.musicplayer.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.musicplayer.musicplayer.model.Playlists;
import com.musicplayer.musicplayer.model.Users;
import com.musicplayer.musicplayer.service.PlaylistService;
import com.musicplayer.musicplayer.service.UsersService;
@RestController
@RequestMapping("api/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

    @Autowired
    private PlaylistService playlistService;

    // @Autowired
    // private SongsService songsService;


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

    @PutMapping("/{userId}/save-song/{songId}")
    public Users saveSong(@PathVariable String userId, @PathVariable String songId) {
        return usersService.saveSong(userId, songId);
    }

    @PutMapping("/{userId}/unsave-song/{songId}")
    public Users unsaveSong(@PathVariable String userId, @PathVariable String songId) {
        return usersService.unsaveSong(userId, songId);
    }

    @PutMapping("/{userId}/playlists/{playlistId}/save")
    public Playlists savePlaylist(@PathVariable String userId, @PathVariable String playlistId) {
        return playlistService.savePlaylist(playlistId, userId);
    }

    @PutMapping("/{userId}/playlists/{playlistId}/unsave")
    public Playlists unsavePlaylist(@PathVariable String userId, @PathVariable String playlistId) {
        return playlistService.unsavePlaylist(playlistId, userId);
    }

    @PostMapping("/{userId}/playlists") //create new playlist for user
    public Playlists createPlaylist(
            @PathVariable String userId,
            @RequestBody Map<String, Object> payload) {
            
        String playlistName = (String) payload.get("playlistName");
        List<String> songIds = payload.get("songIds") != null 
            ? (List<String>) payload.get("songIds") 
            : new ArrayList<>();

        return playlistService.createPlaylist(playlistName, userId, songIds);
    }

    @GetMapping("/{userId}/playlists")
    public List<Playlists> getPlaylistsByUser(@PathVariable String userId) {
        return playlistService.getPlaylistsByCreator(userId);
    }


    // @PostMapping("/{userId}/songs")
    // public Songs addSongForUser(@PathVariable String userId, @RequestBody Songs song) {
    //     // Set creatorId from userId (instead of trusting the client)
    //     song.setCreatedBy(userId);  // Mecil insert your creatorId setter here pls

    //     return songsService.addSong(song);
    // }
    // Uncomment both the import and autowired above if you plan to use this


}