package com.musicplayer.musicplayer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.model.Songs; // Import Songs
import com.musicplayer.musicplayer.repository.AlbumsRepository;
import com.musicplayer.musicplayer.repository.SongsRepository;

import java.util.Collections;
import java.util.List;
import java.util.Comparator;

@Service
public class AlbumsService {
    @Autowired
    private AlbumsRepository albumsRepository;
    @Autowired
    private SongsRepository songsRepository;

    public List<Albums> getAllAlbums() {
        return albumsRepository.findAll();
    }

    public Albums getAlbum(String id) {
         return albumsRepository.findById(id).orElse(null);
    }

    public List<Songs> getSongsFromAlbum(String albumId) {
        Albums album = albumsRepository.findById(albumId).orElse(null);
        if (album == null) return Collections.emptyList();

        // 1. Extract all song IDs from the album
        List<String> songIds = album.getSongs()
            .stream()
            .map(Albums.AlbumSong::getSongId)
            .toList();

        // 2. Fetch songs from repository
        List<Songs> songs = songsRepository.findAllById(songIds);

        // 3. Sort songs based on the order defined in the album!
        songs.sort(Comparator.comparingInt(song -> {
            return album.getSongs().stream()
                .filter(a -> a.getSongId().equals(song.getId()))
                .findFirst()
                .map(Albums.AlbumSong::getOrder)
                .orElse(Integer.MAX_VALUE);
        }));

        return songs;
    }

    public Albums addAlbum(Albums album) {
        return albumsRepository.save(album);
    }

    public Albums updateAlbum(String id, Albums newAlbum) {
          return albumsRepository.findById(id)
            .map(album ->  {
                album.setTitle(newAlbum.getTitle());
                album.setArtist(newAlbum.getArtist());
                album.setSongs(newAlbum.getSongs());
                return albumsRepository.save(album);
            })
            .orElse(null);
    }

        public void deleteAlbum(String id) {
            albumsRepository.deleteById(id);
        }

}
