package com.spm.api.routes;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.handlers.MockApiHandler;


@Configuration
public class MockApiRouter {
	@Bean
	public RouterFunction<ServerResponse> mockApiRoutes(MockApiHandler mockApiHandler) {
		return RouterFunctions
				.nest(
						path("/mockapi"),
						RouterFunctions.route(
								GET("/addUser"),
								mockApiHandler::addUser
						)
						.andRoute(
								GET("/getUserSurname"),
								mockApiHandler::getUserSurname
						)
				);
	}
}
