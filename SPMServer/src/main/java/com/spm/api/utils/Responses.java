package com.spm.api.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

public class Responses {
	
	public static<T> Mono<ServerResponse> ok(T result) {
		return ServerResponse.ok().body(BodyInserters.fromObject(result));
	}
	
	public static Mono<ServerResponse> forbidden(Exception... notUsedException) {
	    return ServerResponse.status(HttpStatus.FORBIDDEN).build();
	}
}
