package com.spm.api.entity;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Files")
public class File {
	@Id
	String id; 				// MondoDB auto-generated
	ObjectId idUser; 		// Reference to id property of User entity
	ObjectId idRepository;	// Reference to id property of Repository entity
	Date createdAt; 		// Date of file creation
	String fileName; 		// Name of saved file
	String originalName;	// Name of original file
	String mimetype;
	String path;			// !!Important: the location of the file is stored in the server
	int cVersion;			// Counter of version (1, 2, 3, 4 ...)
	
	public File(ObjectId idUser, ObjectId idRepository, Date createdAt, String fileName, String originalName,
			String mimetype, String path, int cVersion) {
		this.idUser = idUser;
		this.idRepository = idRepository;
		this.createdAt = createdAt;
		this.fileName = fileName;
		this.originalName = originalName;
		this.mimetype = mimetype;
		this.path = path;
		this.cVersion = cVersion;
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

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	public String getMimetype() {
		return mimetype;
	}

	public void setMimetype(String mimetype) {
		this.mimetype = mimetype;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public int getcVersion() {
		return cVersion;
	}

	public void setcVersion(int cVersion) {
		this.cVersion = cVersion;
	}
	
}
