package com.spm.api.routes;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;

import com.spm.api.handlers.UserHandler;

@Configuration
public class UserRouter {
	
	@Bean
	public RouterFunction<ServerResponse> route(UserHandler userHandler) {
		return RouterFunctions
				.nest(path("/api/user"),
						RouterFunctions.route(
								GET("/"), userHandler::hello
						)
						.andRoute(
								POST("/signin").and(contentType(MediaType.APPLICATION_JSON)), 
								userHandler::createUser
						)
						.andRoute(
								GET("/login"),
								userHandler::loginUser
						)
						.andRoute(
								POST("/pswRecovery").and(contentType(MediaType.APPLICATION_JSON)),
								userHandler::pswRecovery
						)
						.andRoute(
								GET("/changePassword"),
								userHandler::changePassword
						)
						.andRoute(
								GET("/getUser"),
								userHandler::getUser
						)
					
				);
	}

}
