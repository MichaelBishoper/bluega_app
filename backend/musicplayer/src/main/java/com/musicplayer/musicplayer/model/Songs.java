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

    public Songs() {}

    public Songs(String title, String artist, double duration, String audioUrl) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
        this.audioUrl = audioUrl;
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
