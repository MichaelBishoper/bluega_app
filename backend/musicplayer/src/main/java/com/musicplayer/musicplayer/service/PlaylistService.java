package com.musicplayer.musicplayer.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Playlists;
import com.musicplayer.musicplayer.repository.PlaylistsRepository;

@Service
public class PlaylistService {
    @Autowired
    private PlaylistsRepository playlistsRepository;
    // --- CREATE ---
    //You create a new object first if you want to modify fields
  public Playlists createPlaylist(String playlistName, String creatorId, List<String> songIds) {
        if (playlistName == null || playlistName.isBlank()) {
            throw new RuntimeException("Playlist name cannot be empty");
        }
        if (creatorId == null || creatorId.isBlank()) {
            throw new RuntimeException("Creator ID cannot be empty");
        }

        List<String> uniqueSongs = songIds != null ? new ArrayList<>(new HashSet<>(songIds)) : new ArrayList<>();

        Playlists playlist = new Playlists(
            playlistName,
            creatorId,
            uniqueSongs,
            new ArrayList<>() // savedByUserIds start empty
        );

        return playlistsRepository.save(playlist); 
    }

    // Use this if you don't want to modify any fields
    // public Playlists addPlaylists(Playlists playlist) {
    //     return playlistsRepository.save(playlist);
    // }



    // --- READ ---
    public Page<Playlists> getAllPlaylists(Pageable pageable) { //pageable allows us to determine how much to show per page
        return playlistsRepository.findAll(pageable);
    }

    public Playlists getPlaylistById(String id) {
        return playlistsRepository.findById(id).orElse(null);
    }
    
    // --- UPDATE ---
    // Rename playlist
    public Playlists renamePlaylist(String id, String newName) { //IMPORTANT USE "newName" AS PARAMETER NAME NOT "playlistName"
        Playlists playlist = playlistsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        playlist.setPlaylistName(newName);
        return playlistsRepository.save(playlist);
    }

    
    // Add song (no duplicates)
    public Playlists addSong(String id, String songId) {
        Playlists playlist = playlistsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (playlist.getSongIds() == null) {
            playlist.setSongIds(new ArrayList<>());
        }

        if (!playlist.getSongIds().contains(songId)) {
            playlist.getSongIds().add(songId);
            playlist.setSongIds(new ArrayList<>(new HashSet<>(playlist.getSongIds()))); // deduplicate
        } else {
            throw new RuntimeException("Song already in playlist");
        }

        return playlistsRepository.save(playlist);
    }

    // Add a user to savedByUserIds
    public Playlists savePlaylist(String playlistId, String userId) {
        Playlists playlist = playlistsRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (playlist.getSavedByUserIds() == null) {
            playlist.setSavedByUserIds(new ArrayList<>());
        }

        if (!playlist.getSavedByUserIds().contains(userId)) {
            playlist.getSavedByUserIds().add(userId);
        } else {
            throw new RuntimeException("User already saved this playlist");
        }

        return playlistsRepository.save(playlist);
    }

    // Remove a user from savedByUserIds
    public Playlists unsavePlaylist(String playlistId, String userId) {
        Playlists playlist = playlistsRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (playlist.getSavedByUserIds() != null && playlist.getSavedByUserIds().contains(userId)) {
            playlist.getSavedByUserIds().remove(userId);
        } else {
            throw new RuntimeException("User has not saved this playlist");
        }

    return playlistsRepository.save(playlist);
}

    // Remove song
    public Playlists removeSong(String id, String songId) {
        Playlists playlist = playlistsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        if (playlist.getSongIds() != null && playlist.getSongIds().contains(songId)) {
            playlist.getSongIds().remove(songId);
            return playlistsRepository.save(playlist);
        } else {
            throw new RuntimeException("Song not found in playlist");
        }
    }
    

    public Playlists deletePlaylist(String id) {
        Playlists playlistToDelete = playlistsRepository.findById(id).orElse(null);
        if (playlistToDelete != null) {
            playlistsRepository.deleteById(id);
        }
        return playlistToDelete;
    }

    // Get all playlists created by a specific user
    public List<Playlists> getPlaylistsByCreator(String creatorId) {
        if (creatorId == null || creatorId.isBlank()) {
            throw new RuntimeException("Creator ID cannot be empty");
        }
        return playlistsRepository.findByCreatorId(creatorId);
    }

    

}
