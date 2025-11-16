package com.musicplayer.musicplayer.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // Prevents mapping errors from unknown fields
@Document(collection = "albums")
public class Albums {
    @Id
    private String id;
    private String title;
    private String artist;
    private String type; 
    private List<AlbumSong> songs;

    // Nested class to hold songIDs and ordering within an album
    public static class AlbumSong {
        private String songId;
        private int order;

        public AlbumSong() {}
        
        public AlbumSong(String songId, int order) {
            this.songId = songId;
            this.order = order;
        }
        // Constructors
        public void setSongId(String songId) {
            this.songId = songId;
        }
        public String getSongId() {
            return songId;
        }
        public void setOrder(int order) {
            this.order = order;
        }
        public int getOrder() {
            return order;
        }
    }

    public Albums() {}

    public Albums(String title, String artist, List<AlbumSong> songs, String type) {
        this.title = title;
        this.artist = artist;
        this.songs = songs;
        this.type = type;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }
    public String getArtist() {
        return artist;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getId() {
        return id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getTitle() {
        return title;
    }
    public void setSongs(List<AlbumSong> songs) {
        this.songs = songs;
    }
    public List<AlbumSong> getSongs() {
        return songs;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getType() {
        return type;
    }
}




