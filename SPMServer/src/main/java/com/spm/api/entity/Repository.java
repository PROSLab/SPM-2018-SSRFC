package com.spm.api.entity;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/*
 * 1 User has 0...N Repository
 * 1 Repository can be public o private
 * 1 Repository = 0..N versions of the same single file
 * 
 */

/*
 * 
 * File System (Server):
 * 
 * [root: BPMFiles]
 * 	  |------ [idUser1]
 * 					|-------(U) [idRepository1]
 * 										|---[idFile1]		
 * 												    |-------(U) file1_version1.0
 * 
 * 									   	|-----(U) [idFolder1]		
 * 													   |---[idFile2]		
 * 															       |-------(U) file2_version1.0
 * 									   						       |-------(U) file2_version1.1
 * 													   |---[idFile3]
 * 																   |-------(U) file3_version1.0
 * 										|-----(U) [idFolder2]
 * 													   |---[idFile1(clone)]		
 * 												   				          |-------(U) file1_version1.0(clone)
 * 
 * 
 * Note: 
 * - When User save a file => will be update the specific file.
 * - When User create a new version of the file => will be copy the previous file with new version name in the same repo.
 * - User can rename a file
 * - User can delete a file
 * 
 */
@Document(collection = "Repositorys")
public class Repository {
	@Id
	String id; 			// MondoDB auto-generated
	ObjectId idUser; 	// Reference to id property of User entity
	Date createdAt; 	// Date of repository creation
	Boolean publicR;	// if true repository is public; if false repository is private.
	String repositoryName;
	String autore;
	
	public Repository(ObjectId idUser, Date createdAt, Boolean publicR, String repositoryName,String autore) {
		this.idUser = idUser;
		this.createdAt = createdAt;
		this.publicR = publicR;
		this.repositoryName = repositoryName;
		this.autore=autore;
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

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Boolean getPublicR() {
		return publicR;
	}

	public void setPublicR(Boolean publicR) {
		this.publicR = publicR;
	}

	public String getRepositoryName() {
		return repositoryName;
	}

	public void setRepositoryName(String repositoryName) {
		this.repositoryName = repositoryName;
	}

	public String getAutore() {
		return autore;
	}

	public void setAutore(String autore) {
		this.autore = autore;
	}
	
	
}