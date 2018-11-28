package com.spm.api.exceptions;

import org.springframework.mail.MailException;

@SuppressWarnings("serial")
public class EmailException extends MailException{
	
	public EmailException(String message) {
		super(message);
	}

}
