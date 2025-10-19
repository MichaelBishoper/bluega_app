package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.musicplayer.musicplayer.model.Songs;
import com.musicplayer.musicplayer.service.SongsService;

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
    @PostMapping
     public Songs addSong(@RequestBody Songs song) {
        return songsService.addSong(song);  
    }
}
