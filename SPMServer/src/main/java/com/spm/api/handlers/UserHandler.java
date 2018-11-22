package com.spm.api.handlers;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;

import com.spm.api.entity.User;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.services.UserService;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class UserHandler {
	private UserService userService;
	
	public UserHandler(UserService userService) {
		this.userService = userService;
	}
	
	public Mono<ServerResponse> hello(ServerRequest request) {
		return ServerResponse
				.ok()
				.body(BodyInserters.fromObject("HELLO WORLD"));
	}
	
	public Mono<ServerResponse> createUser(ServerRequest request) {
		return request.bodyToMono(User.class)
				.flatMap(user -> userService.createOne(user))
				.flatMap(user -> Responses.ok(user))
				.onErrorResume(ForbiddenResourceOverrideException.class, Responses::forbidden);		
	}


	/*public Mono<ServerResponse> getUserByName(ServerRequest request) {
		Optional<String> name = request.queryParam("name");
		Flux<User> user = userRepository.findByName(name.get());
		
		return ServerResponse
				.ok()
				.contentType(MediaType.APPLICATION_JSON)
				.body(user, User.class);
	}*/

}
