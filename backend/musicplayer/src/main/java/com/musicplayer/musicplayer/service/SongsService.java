package com.musicplayer.musicplayer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Songs;
import com.musicplayer.musicplayer.repository.SongsRepository;
import java.util.List;

@Service
public class SongsService {
    @Autowired
    private SongsRepository songsRepository;

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
        songsRepository.deleteById(id);
    }
    
}
