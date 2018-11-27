package com.spm.api.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Mono;

public class Responses {
	
	public static<T> Mono<ServerResponse> ok(T result) {
		return ServerResponse.ok().body(BodyInserters.fromObject(result));
	}
	
	public static Mono<ServerResponse> badRequest(Exception e) {
	    return fromException(HttpStatus.BAD_REQUEST, e);
	}
	
	public static Mono<ServerResponse> forbidden(Exception... notUsedException) {
	    return ServerResponse.status(HttpStatus.FORBIDDEN).build();
	}
	
	private static Mono<ServerResponse> fromException(HttpStatus status, Exception e) {
	    final ServerResponse.BodyBuilder responseBuilder = ServerResponse.status(status);
	    return e.getMessage() == null
	      ? responseBuilder.build()
	      : responseBuilder.body(Mono.just(e.getMessage()), String.class);
	}
}
