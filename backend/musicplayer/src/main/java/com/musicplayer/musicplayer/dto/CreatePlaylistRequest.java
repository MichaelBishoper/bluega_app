package com.musicplayer.musicplayer.dto;

import java.util.List;

public class CreatePlaylistRequest {
    private String playlistName;
    private List<String> songIds;

    public String getPlaylistName() { return playlistName; }
    public void setPlaylistName(String playlistName) { this.playlistName = playlistName; }

    public List<String> getSongIds() { return songIds; }
    public void setSongIds(List<String> songIds) { this.songIds = songIds; }
}