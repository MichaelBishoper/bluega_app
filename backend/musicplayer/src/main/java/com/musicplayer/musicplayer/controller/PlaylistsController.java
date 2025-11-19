package com.musicplayer.musicplayer.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    // --- READ ---
    @GetMapping
    public Page<Playlists> getAllPlaylists(Pageable pageable) {
        return playlistService.getAllPlaylists(pageable); //pageable allows us to determine how much to show per page
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

    // Note: save/unsave-by-user routes moved to UsersController so routes that include a userId
    // are grouped under /api/users

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public Playlists deletePlaylist(@PathVariable String id) {
        return playlistService.deletePlaylist(id);
    }
}
