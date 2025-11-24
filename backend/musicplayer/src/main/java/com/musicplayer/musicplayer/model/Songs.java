package com.musicplayer.musicplayer.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true) // Prevents mapping errors from unknown fields
@Document(collection = "songs")
public class Songs {
    @Id
    private String id;
    private String title;
    private String artist;
    private double duration;
    private String audioUrl;
    // The ID of the user who created the Album
    private String userId;

    public Songs() {}

    public Songs(String title, String artist, double duration, String audioUrl, String userId) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.audioUrl = audioUrl;
        this.userId = userId;

    // Getter Setter Spam
    }
    public String getArtist() {
        return artist;
    }
    public void setArtist(String artist) {
        this.artist = artist;
    }
    public double getDuration() {
        return duration;
    }
    public void setDuration(double duration) {
        this.duration = duration;
    }
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
    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }
    public String getAudioUrl() {
        return audioUrl;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getUserId() {
        return userId;
    }

    // For debugging purposes
    @Override
    public String toString() {
    return "Songs{" +
            "id='" + id + '\'' +
            ", title='" + title + '\'' +
            ", artist='" + artist + '\'' +
            ", duration=" + duration +
            ", audioUrl="+audioUrl+
            '}';
    }   
}
