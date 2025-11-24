package com.musicplayer.musicplayer.model;
import java.util.ArrayList;
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
    private String imgUrl;
    // single, ep, lp
    private String type;
    private List<AlbumSong> songs = new ArrayList<>();
    private String userId;


    // Getter Setter Spam
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<AlbumSong> getSongs() {
        return songs;
    }

    public void setSongs(List<AlbumSong> songs) {
        this.songs = songs;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public static class AlbumSong {
        private String songId;   // references Songs.id
        private String title;    // store title so album retrieval is fast
        private int order;       // track number


        public AlbumSong() {}

        public AlbumSong(String songId, String title, int order) {
            this.songId = songId;
            this.title = title;
            this.order = order;
        }

         public String getSongId() {
            return songId;
        }

        public void setSongId(String songId) {
            this.songId = songId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public int getOrder() {
            return order;
        }

        public void setOrder(int order) {
            this.order = order;
        }
    }
}





