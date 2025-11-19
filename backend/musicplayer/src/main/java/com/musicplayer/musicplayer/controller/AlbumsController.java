package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.musicplayer.musicplayer.model.Songs; // Import Songs
import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.service.AlbumsService;

import java.util.List;     

@RestController
@RequestMapping("api/albums")
public class AlbumsController {
    @Autowired
    private AlbumsService albumsService;

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
    public Albums createAlbum(@RequestBody Albums albumRequest) {
        return albumsService.createAlbum(albumRequest);
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
