package com.musicplayer.musicplayer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<Songs> getAllSongs() {
        return songsRepository.findAll();
    }

    public Songs getSong(String id) {
        return songsRepository.findById(id).orElse(null);
    }

    public Songs addSong(Songs song) {
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

    public void deleteSong(String id) {
        // Remove song from all playlists
        List<Playlists> allPlaylists = playlistsRepository.findAll();
        for (Playlists playlist : allPlaylists) {
            if (playlist.getSongIds() != null && playlist.getSongIds().contains(id)) {
                playlist.getSongIds().remove(id);
                playlistsRepository.save(playlist);
            }
        }
        
        // Delete the song
        songsRepository.deleteById(id);
    }
    
}
