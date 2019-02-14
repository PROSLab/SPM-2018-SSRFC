package com.spm.api.entity;

import java.util.Date;
import java.util.Vector;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "FileEntitys")
public class FileEntity {
	@Id
	String id; 							// MondoDB auto-generated
	ObjectId idUser; 					// Reference to id property of User entity
	ObjectId idRepository;				// Reference to id property of Repository entity
	
	ObjectId idFolder;					/* Can be null:
									 	* if null => file is only inside a repository
									 	* if not null => file is inside a folder
									 	*/
	
	Date createdAt; 					// Date of file creation
	String fileName; 					// Name of saved file
	String originalName;				// Name of original file
	String mimetype;
	String path;						// !!Important: the location of the file is stored in the server
	int cVersion;						// Counter of version (1, 2, 3, 4 ...)
	
	Vector<Integer> deletedVersions;	// Array for deleted version of the file
	String autore;
	String soundness;
	String safeness;
	Boolean validity;
	String fileType;

	public FileEntity(ObjectId idUser, ObjectId idRepository, ObjectId idFolder, Date createdAt, String fileName, String originalName,
			String mimetype, String path, int cVersion, Vector<Integer> deletedVersions,String autore,String soundness,String safeness,Boolean validity,String fileType) {
		this.idUser = idUser;
		this.idRepository = idRepository;
		this.idFolder = idFolder;
		this.createdAt = createdAt;
		this.fileName = fileName;
		this.originalName = originalName;
		this.mimetype = mimetype;
		this.path = path;
		this.cVersion = cVersion;
		this.deletedVersions = deletedVersions;
		this.autore=autore;
		this.soundness=soundness;
		this.safeness=safeness;
		this.validity=validity;
		this.fileType=fileType;
	}


	


	public String getFileType() {
		return fileType;
	}





	public void setFileType(String fileType) {
		this.fileType = fileType;
	}





	public Boolean getValidity() {
		return validity;
	}


	public void setValidity(Boolean validity) {
		this.validity = validity;
	}


	public String getSoundness() {
		return soundness;
	}


	public void setSoundness(String soundness) {
		this.soundness = soundness;
	}


	public String getSafeness() {
		return safeness;
	}


	public void setSafeness(String safeness) {
		this.safeness = safeness;
	}


	public String getAutore() {
		return autore;
	}

	public void setAutore(String autore) {
		this.autore = autore;
	}

	public ObjectId getIdFolder() {
		return idFolder;
	}

	public void setIdFolder(ObjectId idFolder) {
		this.idFolder = idFolder;
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
	
	public Vector<Integer> getDeletedVersions() {
		return deletedVersions;
	}

	public void setDeletedVersions(Vector<Integer> deletedVersions) {
		this.deletedVersions = deletedVersions;
	}
	
}
