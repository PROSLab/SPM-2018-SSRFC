package com.spm.api.services;

import org.springframework.stereotype.Component;

import com.spm.api.entity.User;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.repository.UserRepository;

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
					else return userRepository.save(user); // User not exists
				});
	}

}
