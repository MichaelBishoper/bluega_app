package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.musicplayer.model.Albums;
import com.musicplayer.musicplayer.model.Songs;
import com.musicplayer.musicplayer.service.AlbumsService;
import com.musicplayer.musicplayer.service.SongsService;

import java.io.IOException;
import java.util.List;              

@RestController
@RequestMapping("api/songs")
public class SongsController {
    @Autowired
    private SongsService songsService;

    @Autowired
    private AlbumsService albumsService;

    @GetMapping
    public List<Songs> getAllSongs() {
        return songsService.getAllSongs();
    }

    @GetMapping("/{id}")
    public Songs getSongByID(@PathVariable String id) {
        return songsService.getSong(id);
    }

    // Songs Does not Create Itself
    // Songs Are created from Albums

    // @PostMapping("/albums/{albumId}/songs")
    // public Albums uploadSongToAlbum(
    //     @PathVariable String albumId,
    //     @RequestParam("songData") String songData,
    //     @RequestPart("audio") MultipartFile audioFile,
    //     @RequestParam("albumType") String albumType,
    //     @RequestParam("order") int order,
    //     @RequestParam("userId") String userId
    // ) throws IOException {
    //     Songs songMeta = new ObjectMapper().readValue(songData, Songs.class);
    //     Songs createdSong = songsService.addSong(songMeta, audioFile, albumType, albumId, userId);
    //     return albumsService.addSongToAlbum(albumId, createdSong, order);
    // }

    @PutMapping("/{id}")
    public Songs updateSong(@PathVariable String id, @RequestBody Songs song) {
        return songsService.updateSong(id, song);
    }
    
    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id) {
        songsService.deleteSong(id);
    }
}
