package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.musicplayer.model.Songs;
import com.musicplayer.musicplayer.service.SongsService;

import java.io.IOException;
import java.util.List;              

@RestController
@RequestMapping("api/songs")
public class SongsController {
    @Autowired
    private SongsService songsService;

    @GetMapping
    public List<Songs> getAllSongs() {
        return songsService.getAllSongs();
    }

    @GetMapping("/{id}")
    public Songs getSongByID(@PathVariable String id) {
        return songsService.getSong(id);
    }

    @PostMapping
    public Songs uploadSong(
            @RequestParam("songData") String songData,
            @RequestPart("audio") MultipartFile audioFile,
            @RequestParam("albumId") String albumId,
            @RequestParam("albumType") String albumType
    ) throws IOException {
        Songs songMeta = new ObjectMapper().readValue(songData, Songs.class);
        return songsService.addSong(songMeta, audioFile, albumId, albumType);
    }

    @PutMapping("/{id}")
    public Songs updateSong(@PathVariable String id, @RequestBody Songs song) {
        return songsService.updateSong(id, song);
    }
    
    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id) {
        songsService.deleteSong(id);
    }
}
