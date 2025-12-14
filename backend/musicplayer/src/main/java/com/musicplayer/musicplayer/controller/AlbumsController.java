package com.musicplayer.musicplayer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    
}
