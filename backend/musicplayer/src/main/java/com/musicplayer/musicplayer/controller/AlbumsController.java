package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.musicplayer.musicplayer.model.Songs; // Import Songs model
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.service.AlbumsService;
import com.musicplayer.musicplayer.service.SongsService;
import com.musicplayer.musicplayer.service.S3Service;
import com.musicplayer.musicplayer.repository.AlbumsRepository;

import java.io.IOException;
import java.util.List;     

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

    @PostMapping
    public Albums createAlbum(
            @RequestPart("albumData") String albumData,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        Albums album = new ObjectMapper().readValue(albumData, Albums.class);

        Albums saved = albumsRepository.save(album);

        if (imageFile != null && !imageFile.isEmpty()) {
            String url = s3Service.uploadAlbumCover(imageFile, album.getType(), saved.getId());
            saved.setImgUrl(url);
            saved = albumsRepository.save(saved);
        }

        return saved;
    }


    @PostMapping("/{albumId}/songs")
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


    @PutMapping("/{id}")
    public Albums updateAlbum(@PathVariable String id, @RequestBody Albums album) {
        return albumsService.updateAlbum(id, album);
    }

     @DeleteMapping("/{albumId}")
    public String deleteAlbum(@PathVariable String albumId) {
        albumsService.deleteAlbum(albumId);
        return "Album " + albumId + " deleted successfully!";
    }
    
}
