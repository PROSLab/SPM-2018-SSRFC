package com.spm.api.services;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.spm.api.entity.PasswordChange;
import com.spm.api.entity.User;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.repository.PasswordChangeRepository;
import com.spm.api.repository.UserRepository;
import com.spm.api.utils.Password;

import reactor.core.publisher.Mono;

@Component
public class UserService {
	private UserRepository userRepository;
	private PasswordChangeRepository passwordChangeRepository;
	private String uuid;

	public UserService(UserRepository userRepository, PasswordChangeRepository passwordChangeRepository) {
		this.userRepository = userRepository;
		this.passwordChangeRepository = passwordChangeRepository;
	}
	
	public Mono<Boolean> isNewUser(String email) {
		return userRepository.findByEmail(email)
				.flatMap(notUsed -> Mono.just(true))
				.switchIfEmpty(Mono.defer(() -> Mono.just(false)));
	}
	
	public Mono<User> createOne(User user) {	
		return this.isNewUser(user.getEmail())
				.flatMap(res -> {
					if(res == true) { // User exists
						return Mono.error(new ForbiddenResourceOverrideException());
					}
					else { // User not exists
						String hash = Password.hashPassword(user.getPassword());
						user.setPassword(hash);
						return userRepository.save(user); 
					}
				});
	}
	
	public Mono<User> verifyCredentials(String email, String password) {
		return userRepository.findByEmail(email)
				.flatMap(res -> { // User found
					boolean check = Password.checkPassword(password, res.getPassword());
					if(check == true) {
						return Mono.just(res); // return Mono<User> object
					}
					else {
						return Mono.error(new BadRequestException("Invalid password"));
					}
				})
				.switchIfEmpty( // User not found
						Mono.defer(() -> Mono.error(new BadRequestException("User not found")))
				);		
	}

	public Mono<String> createEmailLink(String email) {
		return userRepository.findByEmail(email)
				.flatMap(notUsed -> {
					Date today = new Date();
					Calendar c = Calendar.getInstance(); 
					c.setTime(today); 
					c.add(Calendar.DATE, 1);
					today = c.getTime();
					uuid = UUID.randomUUID().toString();
					String uuidHash = Password.hashPassword(uuid);
					Boolean used = false;
					PasswordChange psc = new PasswordChange(today, uuidHash, used);
					
					return passwordChangeRepository.save(psc);
				})
				.flatMap(psc -> {
					String url = "http://localhost:4200/NewPassword?uuid="+uuid+"&pgid="+psc.getId();
					return Mono.just(url);
				})
				.switchIfEmpty( // Email not found
						Mono.defer(() -> Mono.error(new BadRequestException("Email not found")))
				);		
	}
	
}
