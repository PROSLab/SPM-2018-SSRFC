package com.spm.api.routes;

import static org.springframework.web.reactive.function.server.RequestPredicates.POST;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.handlers.ModelCheckHandler;

@Configuration
public class ModelCheckRouter {
	
	@Bean
	public RouterFunction<ServerResponse> modelCheckRoutes(ModelCheckHandler modelCheckHandler) {
		return RouterFunctions
				.nest(
						path("/api/modelcheck"),
						RouterFunctions.route(
								POST("/upload").and(accept(MediaType.MULTIPART_FORM_DATA)),
								modelCheckHandler::uploadModel
						)
						.andRoute(
								GET("/download"),
								modelCheckHandler::downloadModel
						)
						.andRoute(
								POST("/check_equivalence").and(accept(MediaType.MULTIPART_FORM_DATA)),
								modelCheckHandler::checkEquivalence
						)
						.andRoute(
								POST("/test_parsemodel").and(accept(MediaType.MULTIPART_FORM_DATA)),
								modelCheckHandler::parseModel
						)
						.andRoute(
								POST("/mergemodel").and(accept(MediaType.MULTIPART_FORM_DATA)),
								modelCheckHandler::mergeModel
						)
				);
	}

}
