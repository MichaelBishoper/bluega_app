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
import com.musicplayer.musicplayer.service.PlaylistService;

@RestController
@RequestMapping("api/playlists")
public class PlaylistsController {

    @Autowired
    private PlaylistService playlistService;

    // --- CREATE ---
    @PostMapping("/users/{creatorId}")
    public Playlists createPlaylist(
            @PathVariable String creatorId,
            @RequestBody Map<String, Object> payload) {

        String playlistName = (String) payload.get("playlistName");
        List<String> songIds = payload.get("songIds") != null
                ? (List<String>) payload.get("songIds")
                : new ArrayList<>();

        return playlistService.createPlaylist(playlistName, creatorId, songIds);
    }
    // --- READ ---
    @GetMapping
    public List<Playlists> getAllPlaylists() {
        return playlistService.getAllPlaylists();
    }

    @GetMapping("/{id}")
    public Playlists getPlaylistById(@PathVariable String id) {
        return playlistService.getPlaylistById(id);
    }

    // --- UPDATE ---
    @PutMapping("/{id}/rename") //IMPORTANT USE "newName" AS PARAMETER NAME NOT "playlistName"
    public Playlists renamePlaylist(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return playlistService.renamePlaylist(id, payload.get("newName"));
    }

    @PutMapping("/{id}/add-song")
    public Playlists addSong(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return playlistService.addSong(id, payload.get("songId"));
    }

    @PutMapping("/{id}/remove-song")
    public Playlists removeSong(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return playlistService.removeSong(id, payload.get("songId"));
    }

    @PutMapping("/{playlistId}/save/{userId}")
    public Playlists savePlaylist(@PathVariable String playlistId, @PathVariable String userId) {
        return playlistService.savePlaylist(playlistId, userId);
    }

   @PutMapping("/{playlistId}/unsave/{userId}")
    public Playlists unsavePlaylist(@PathVariable String playlistId, @PathVariable String userId) {
        return playlistService.unsavePlaylist(playlistId, userId);
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public Playlists deletePlaylist(@PathVariable String id) {
        return playlistService.deletePlaylist(id);
    }
}
