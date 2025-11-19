package com.musicplayer.musicplayer.model; //declare which package this belongs to

import java.util.List;

import org.springframework.data.annotation.Id; //annotations  used for MongoDB collections
import org.springframework.data.mongodb.core.index.Indexed; // annotations used to mark unique ids
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



@Document(collection = "users") //the annotation we just imported
public class Users {
    @Id // the other annotation we just imported
    private String id;

    @Indexed(unique = true)
    @NotBlank 
    private String username;

    @NotBlank @Size(min = 8)
    private String password; 
    
    // List of ids of that the user follows
    private List<String> followingids;

    private List<String> savedSongs;
    
    // -- NOTES --
    //constructors participate in both storing and fetching data,
    //but the storing part uses your constructor,
    //and the fetching part uses the no-arg constructor that Spring relies on.
    public Users() {} 

    public Users(String username, String password, List<String> followingids) {
        this.username = username;
        this.followingids = followingids;
        this.password = password;
        this.savedSongs = null;
    }

    public String getId() {
        return id;
    }



    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    

    public List<String> getFollowingids() {
        return followingids;
    }

    public List<String> getSavedSongs() {
        return savedSongs;
    }

    public void setSavedSongs(List<String> savedSongs) {
        this.savedSongs = savedSongs;
    }

    public void setFollowingids(List<String> followingids) {
        this.followingids = followingids;
    }

    //the “template” or “output format” that your controller/service ultimately returns when you do a GET.(for debugging purposes)
    @Override
    public String toString() {
        return "Users{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' + //we dont show the password
                ", following=" + followingids +
                ", savedSongs=" + savedSongs +
                '}';
    }
}