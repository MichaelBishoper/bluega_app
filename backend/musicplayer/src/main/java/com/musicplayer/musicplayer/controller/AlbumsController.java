package com.musicplayer.musicplayer.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.model.Songs; // Import Songs model
import com.musicplayer.musicplayer.repository.AlbumsRepository;
import com.musicplayer.musicplayer.service.AlbumsService;
import com.musicplayer.musicplayer.service.S3Service;
import com.musicplayer.musicplayer.service.SongsService;     

@RestController
@RequestMapping("api/albums")
public class AlbumsController {
    @Autowired
    private AlbumsService albumsService;

    @Autowired
    private SongsService songsService;

    @Autowired
    private AlbumsRepository albumsRepository;

    @Autowired 
    private S3Service s3Service;

    // Routes

    @GetMapping
    public List<Albums> getAllAlbums(){ 
        return albumsService.getAllAlbums();
    }

    @GetMapping("/{id}")
    public Albums getAlbumByID(@PathVariable String id) {
        return albumsService.getAlbum(id);
    }

    @GetMapping("/{id}/songs") // Album's ID NOT Song's
    public List<Songs> getSongsFromAlbum(@PathVariable String id) {
        return albumsService.getSongsFromAlbum(id);
    }

    @GetMapping("user/{userId}")
    public List<Albums> getAlbumsByUser(@PathVariable String userId) {
        return albumsService.getAlbumsByUserId(userId);
    }

    @PostMapping // Create Container Album
    public Albums createAlbum(
            @RequestParam("userId") String userId,
            @RequestPart("albumData") String albumData,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        // Convert JSON string → Albums object
        Albums album = new ObjectMapper().readValue(albumData, Albums.class);

        // Set userId on the album
        album.setUserId(userId);

        // Save album without image first
        Albums saved = albumsRepository.save(album);

        // If image provided → upload cover to S3
        if (imageFile != null && !imageFile.isEmpty()) {
            String url = s3Service.uploadAlbumCover(imageFile, album.getType(), saved.getId());
            saved.setImgUrl(url);
            saved = albumsRepository.save(saved);
        }

        return saved;
    }

    @PostMapping("/{albumId}/songs") // Add Songs to Album
    public Albums uploadSongToAlbum(
        @PathVariable String albumId,
        @RequestParam("songData") String songData,
        @RequestPart("audio") MultipartFile audioFile,
        @RequestParam("order") int order,
        @RequestParam("userId") String userId
    ) throws IOException {
        Songs songMeta = new ObjectMapper().readValue(songData, Songs.class);
        Songs createdSong = songsService.addSong(songMeta, audioFile, albumId, userId, order);
        return albumsService.addSongToAlbum(albumId, createdSong, order);
    }


    @PutMapping("/{albumId}")
    public Albums updateAlbum(@PathVariable String albumId, @RequestBody Albums album) {
        return albumsService.updateAlbum(albumId, album);
    }

     @DeleteMapping("/{albumId}")
    public String deleteAlbum(@PathVariable String albumId) {
        albumsService.deleteAlbum(albumId);
        return "Album " + albumId + " deleted successfully!";
    }
    
}
