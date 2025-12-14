package com.musicplayer.musicplayer.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true) // Prevents mapping errors from unknown fields
@Document(collection = "Playlists")
public class Playlists {
    @Id
    private String id;
    @NotBlank
    private String playlistName;
    
    private final String creatorId;

    private List<String> songIds;

    private List<String> savedByUserIds;

    public Playlists(String playlistName, String creatorId, List<String> songIds, List<String> savedByUserIds) {
        this.playlistName = playlistName;
        this.creatorId = creatorId;
        this.songIds = songIds != null ? songIds : new ArrayList<>();
        this.savedByUserIds = savedByUserIds != null ? savedByUserIds : new ArrayList<>();
    }


    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getPlaylistName() {
        return playlistName;
    }
    public void setPlaylistName(String playlistName) {
        this.playlistName = playlistName;
    }

    public String getCreatorId() {
        return creatorId; // no setter to prevent changing
    }
    public List<String> getSongIds() {
        return songIds;
    }
    public void setSongIds(List<String> songIds) {
        this.songIds = songIds;
    }
    public List<String> getSavedByUserIds() {
        return savedByUserIds;
    }
    public void setSavedByUserIds(List<String> savedByUserIds) {
        this.savedByUserIds = savedByUserIds;
    }

    @Override
    public String toString() {
        return "Playlists{" +
                "id='" + id + '\'' +
                ", playlistName='" + playlistName + '\'' +
                ", songIds=" + songIds +
                ", savedByUserIds=" + savedByUserIds +
                '}';
    }
}