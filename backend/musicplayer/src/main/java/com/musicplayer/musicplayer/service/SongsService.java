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

    public Songs addSong(Songs song) {
        return songsRepository.save(song);
    }
}
