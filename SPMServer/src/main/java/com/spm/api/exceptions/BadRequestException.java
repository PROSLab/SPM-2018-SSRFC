package com.spm.api.exceptions;

@SuppressWarnings("serial")
public class BadRequestException extends Exception {

	public BadRequestException() {}

	public BadRequestException(String message) {
	   super(message);
	}
	
}
