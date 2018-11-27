package com.spm.api.services;

import org.springframework.stereotype.Component;

import com.spm.api.entity.User;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.repository.UserRepository;
import com.spm.api.utils.Password;

import reactor.core.publisher.Mono;

@Component
public class UserService {
	private UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
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

}
