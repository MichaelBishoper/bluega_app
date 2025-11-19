package com.musicplayer.musicplayer.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;

import java.io.IOException;

@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    private AmazonS3 s3Client;

    public String uploadSong(MultipartFile file, String albumType, String albumId) {
        try {
            // sanitize albumType
            String typeFolder = albumType.toLowerCase();
            if (!typeFolder.equals("single") && !typeFolder.equals("ep") && !typeFolder.equals("lp")) {
                throw new IllegalArgumentException("Invalid album type: " + albumType);
            }

            // Folder Pathing for S3
            String folder = "music/" + typeFolder + "/" + albumId;

            // Generate Unique Filename using currentTimeMillis Prikitiwwww
            String fileName = folder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            s3Client.putObject(new PutObjectRequest(
                    bucketName,
                    fileName,
                    file.getInputStream(),
                    metadata
            ));

            return s3Client.getUrl(bucketName, fileName).toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public void deleteFile(String fileUrl) {
        // Extract the key from the URL
        String bucketUrl = "https://" + bucketName + ".s3.amazonaws.com/";
        String key = fileUrl.replace(bucketUrl, "");

        // Delete from S3
        s3Client.deleteObject(bucketName, key);
    }
}
