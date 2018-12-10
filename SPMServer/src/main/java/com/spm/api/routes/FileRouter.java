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

import com.spm.api.handlers.FileHandler;

@Configuration
public class FileRouter {
	
	@Bean
	public RouterFunction<ServerResponse> fileRoutes(FileHandler fileHandler) {
		return RouterFunctions
				.nest(
						path("/api/file"), 
						RouterFunctions.route(
								POST("/uploadTest").and(accept(MediaType.MULTIPART_FORM_DATA)),
								fileHandler::uploadFileTest
						)
						.andRoute(
								GET("/createRepository"),
								fileHandler::createRepository
						)
						.andRoute(
								GET("/createFile"),
								fileHandler::createFile
						)
						.andRoute(
								GET("/getAllRepo"),
								fileHandler:: getAllRepo
						)
						.andRoute(
								GET("/getRepoSpec"),
								fileHandler:: getRepoSpec
						)
						.andRoute(
								GET("/getAllFile"),
								fileHandler:: getAllFile
						)
					
				);
	}
}
