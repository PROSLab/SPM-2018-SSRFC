package com.spm.api.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "PasswordChanges")
public class PasswordChange {
	@Id
	String id;
	Date expDate; /*Expiration of hash code (now + 24h)*/
	String codeHash; /*Random hashed string*/
	Boolean used;
	
	public PasswordChange(Date expDate, String codeHash, Boolean used) {
		this.expDate = expDate;
		this.codeHash = codeHash;
		this.used = used;
	}

	public String getId() {
		return id;
	}
	
	/*
	public void setId(String id) {
		this.id = id;
	}
	*/

	public Date getExpDate() {
		return expDate;
	}

	public void setExpDate(Date expDate) {
		this.expDate = expDate;
	}

	public String getCodeHash() {
		return codeHash;
	}

	public void setCodeHash(String codeHash) {
		this.codeHash = codeHash;
	}

	public Boolean getUsed() {
		return used;
	}

	public void setUsed(Boolean used) {
		this.used = used;
	}
	
}
