package com.spm.api.handlers;

import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;

import com.spm.api.entity.User;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.exceptions.EmailException;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.services.UserService;
import com.spm.api.utils.Email;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class UserHandler {
	private UserService userService;
	private Email emailClient;
	
	public UserHandler(UserService userService, Email emailClient) {
		this.userService = userService;
		this.emailClient = emailClient;
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
	
	public Mono<ServerResponse> loginUser(ServerRequest request) {
		Optional<String> email = request.queryParam("email");
		Optional<String> password = request.queryParam("password");
		
		return userService.verifyCredentials(email.get(), password.get())
				.flatMap(user -> Responses.ok(user))
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> pswRecovery(ServerRequest request) { 
		return request.bodyToMono(User.class)
				.flatMap(user -> emailClient.sendSimpleMessage(user.getEmail(), "sto cazzo", "col preservativo!"))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(EmailException.class, Responses::badRequest);
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
