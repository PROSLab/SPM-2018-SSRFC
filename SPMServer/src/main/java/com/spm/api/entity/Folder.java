package com.spm.api.entity;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Folders")
public class Folder {
	@Id
	String id; 			// MondoDB auto-generated
	ObjectId idUser; // Reference to id property of User entity
	ObjectId idRepository;
	Date createdAt; 	// Date of repository creation
	String folderName;
	String path;
	String autore;
	
	public Folder(ObjectId idUser,ObjectId idRepository, Date createdAt,String folderName, String path,String autore) {
		this.idUser = idUser;
		this.idRepository=idRepository;
		this.createdAt = createdAt;
		this.folderName = folderName;
		this.path=path;
		this.autore=autore;
	}

	
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getId() {
		return id;
	}


	public ObjectId getIdUser() {
		return idUser;
	}

	public void setIdUser(ObjectId idUser) {
		this.idUser = idUser;
	}

	public ObjectId getIdRepository() {
		return idRepository;
	}

	public void setIdRepository(ObjectId idRepository) {
		this.idRepository = idRepository;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}


	public String getAutore() {
		return autore;
	}


	public void setAutore(String autore) {
		this.autore = autore;
	}

	
}
