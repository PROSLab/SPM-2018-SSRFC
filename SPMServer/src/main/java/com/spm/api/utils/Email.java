package com.spm.api.utils;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.spm.api.exceptions.EmailException;

import reactor.core.publisher.Mono;

@Component
public class Email {
	
	private JavaMailSender emailSender;

	public Email(JavaMailSender emailSender) {
		this.emailSender = emailSender;
	}
	
	public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message);
        } catch (MailException exception) {
            exception.printStackTrace();
            Mono.error(new EmailException("Email error, see console."));
        }
    }
	
}
