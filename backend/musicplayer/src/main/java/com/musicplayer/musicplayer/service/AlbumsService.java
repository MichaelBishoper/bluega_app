package com.musicplayer.musicplayer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.repository.AlbumsRepository;
import java.util.List;

@Service
public class AlbumsService {
    @Autowired
    private AlbumsRepository albumsRepository;

    public List<Albums> getAllAlbums() {
        return albumsRepository.findAll();
    }
}
