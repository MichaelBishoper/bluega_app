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
    private List<String> songIds;

    public Albums() {}

    public Albums(String title, String artist, List<String> SongIDs) {
        this.title = title;
        this.artist = artist;
        this.songIds = SongIDs;
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
    public void setSongIds(List<String> songIds) {
        this.songIds = songIds;
    }
    public List<String> getSongIds() {
        return songIds;
    }
}




