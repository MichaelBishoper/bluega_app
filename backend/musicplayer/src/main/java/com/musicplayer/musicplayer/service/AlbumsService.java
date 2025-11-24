package com.musicplayer.musicplayer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.model.Songs; // Import Songs
import com.musicplayer.musicplayer.repository.AlbumsRepository;
import com.musicplayer.musicplayer.repository.SongsRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Comparator;

@Service
public class AlbumsService {
    @Autowired
    private AlbumsRepository albumsRepository;
    @Autowired
    private SongsRepository songsRepository;
    @Autowired
    private S3Service s3Service;

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
    // Create Initial Empty Album
    public Albums createAlbum(Albums albumRequest, String userId) {
        String type = albumRequest.getType().toLowerCase();
        if (!type.equals("single") && !type.equals("ep") && !type.equals("lp")) {
            throw new IllegalArgumentException("Invalid album type: " + albumRequest.getType());
        }
        albumRequest.setUserId(userId);    
        albumRequest.setSongs(new ArrayList<>());
        return albumsRepository.save(albumRequest);
    }
    // Add Song to Album
    public Albums addSongToAlbum(String albumId, Songs createdSong, int order) {
        Albums album = albumsRepository.findById(albumId)
            .orElseThrow(() -> new RuntimeException("Album not found"));

        album.getSongs().add(new Albums.AlbumSong(
                createdSong.getId(),
                createdSong.getTitle(),
                order
        ));
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

    // Delete Album
    public void deleteAlbum(String albumId) {
        Albums album = albumsRepository.findById(albumId)
            .orElseThrow(() -> new RuntimeException("Album not found"));
        for (Albums.AlbumSong albumSong : album.getSongs()) {
            Songs song = songsRepository.findById(albumSong.getSongId())
                .orElse(null);
            if (song != null) {
                s3Service.deleteFile(song.getAudioUrl());
                songsRepository.deleteById(song.getId());
            }
        }
        albumsRepository.deleteById(albumId);
    }

}
