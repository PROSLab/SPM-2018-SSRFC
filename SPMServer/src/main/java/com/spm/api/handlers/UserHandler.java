package com.spm.api.handlers;

import java.util.Optional;

import org.bson.types.ObjectId;
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
	private User userObj;
	
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
				.flatMap(user -> {
					userObj = user;
					return userService.createEmailLink(user.getEmail());
				})
				.flatMap(url -> emailClient.sendSimpleMessage(userObj.getEmail(), "Password Recovery", url))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(EmailException.class, Responses::badRequest)
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> changePassword(ServerRequest request) {
		Optional<String> pgid = request.queryParam("pgid");
		Optional<String> plainHash = request.queryParam("uuid");
		Optional<String> newPassword = request.queryParam("password");
		
		return userService.verifyPasswordChange(pgid.get(), plainHash.get())
				.flatMap(res -> {
					if(res == true)
						return userService.updatePassword(pgid.get(), newPassword.get());
					
					return Mono.just(res);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono <ServerResponse> getUser(ServerRequest request){
		String id = request.queryParam("id").get();
		return userService.getUser(new ObjectId(id))
				.flatMap(res -> Responses.ok(res));
	}
	

}
