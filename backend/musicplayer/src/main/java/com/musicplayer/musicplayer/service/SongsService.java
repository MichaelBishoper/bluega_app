package com.musicplayer.musicplayer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.musicplayer.musicplayer.model.Playlists;
import com.musicplayer.musicplayer.model.Songs;
import com.musicplayer.musicplayer.repository.PlaylistsRepository;
import com.musicplayer.musicplayer.repository.SongsRepository;

@Service
public class SongsService {
    @Autowired
    private SongsRepository songsRepository;

    @Autowired //used in deleteSong to remove song from playlists when deleted
    private PlaylistsRepository playlistsRepository;

    @Autowired //used for S3 upload and deletion operations
    private S3Service s3Service;

    public List<Songs> getAllSongs() {
        return songsRepository.findAll();
    }

    public Songs getSong(String id) {
        return songsRepository.findById(id).orElse(null);
    }

    public Songs addSong(Songs song, MultipartFile audioFile, String albumId, String albumType) {
        // Upload audio to S3 → returns URL
        String audioUrl = s3Service.uploadSong(audioFile, albumType, albumId);
        song.setAudioUrl(audioUrl);
        song.setId(albumId);
        return songsRepository.save(song);
    }

    public Songs updateSong(String id, Songs newSong) {
        return songsRepository.findById(id)
            .map(song ->  {
                song.setTitle(newSong.getTitle());
                song.setArtist(newSong.getArtist());
                song.setAudioUrl(newSong.getAudioUrl());
                song.setDuration(newSong.getDuration());
                return songsRepository.save(song);
            })
            .orElse(null);
    }

    public boolean deleteSong(String id) {
        // Remove song from all playlists
        List<Playlists> allPlaylists = playlistsRepository.findAll();
        for (Playlists playlist : allPlaylists) {
            if (playlist.getSongIds() != null && playlist.getSongIds().contains(id)) {
                playlist.getSongIds().remove(id);
                playlistsRepository.save(playlist);
            }
        }
        // 1. Fetch the song first
        Songs song = songsRepository.findById(id).orElse(null);
        if (song == null) return false;

        // 2. Delete from S3 using the audioUrl
        if (song.getAudioUrl() != null && !song.getAudioUrl().isEmpty()) {
            s3Service.deleteFile(song.getAudioUrl());
        }

        // 3. Delete from database
        songsRepository.deleteById(id);
        return true;
        // Delete the song
        // Note: This is too woke
    }

    
    
}
