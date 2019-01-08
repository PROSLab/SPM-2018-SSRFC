package com.spm.api.routes;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.handlers.ShareHandler;


@Configuration
public class ShareRouter {
	
	@Bean
	public RouterFunction<ServerResponse> shareRoutes(ShareHandler shareHandler) {
		return RouterFunctions
				.nest(
						path("/api/share"),
						RouterFunctions.route(
								GET("/repository"),
								shareHandler::shareRepository
						)
						.andRoute(
								GET("/file"),
								shareHandler::shareModel
						)
				);
	}
}
