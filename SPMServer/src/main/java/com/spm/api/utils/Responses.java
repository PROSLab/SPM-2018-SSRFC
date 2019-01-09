package com.spm.api.utils;

import java.io.File;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.entity.FileEntity;

import reactor.core.publisher.Mono;

public class Responses {
	
	public static<T> Mono<ServerResponse> ok(T result) {
		return ServerResponse.ok().body(BodyInserters.fromObject(result));
	}
	
	public static<T> Mono<ServerResponse> okFile(T result, File file) {
		return ServerResponse.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.contentLength(file.length())
				.body(BodyInserters.fromObject(result));
	}
	
	public static<T> Mono<ServerResponse> okFile(T result, File file, FileEntity fileE) {
		return ServerResponse.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileE.getOriginalName() + "." + fileE.getMimetype())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.contentLength(file.length())
				.body(BodyInserters.fromObject(result));
	}
	
	public static<T> Mono<ServerResponse> okZip(T result, File file, FileEntity fileE) {
		return ServerResponse.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileE.getOriginalName() + ".zip")
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.contentLength(file.length())
				.body(BodyInserters.fromObject(result));
	}
	
	
	
	public static Mono<ServerResponse> badRequest(Exception e) {
	    return fromException(HttpStatus.BAD_REQUEST, e);
	}
	
	public static Mono<ServerResponse> forbidden(Exception... notUsedException) {
	    return ServerResponse.status(HttpStatus.FORBIDDEN).build();
	}
	
	public static Mono<ServerResponse> internalServerError() {
	    return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}
	
	public static Mono<ServerResponse> internalServerError(Exception e) {
	    return fromException(HttpStatus.INTERNAL_SERVER_ERROR, e);
	}
	
	private static Mono<ServerResponse> fromException(HttpStatus status, Exception e) {
	    final ServerResponse.BodyBuilder responseBuilder = ServerResponse.status(status);
	    return e.getMessage() == null
	      ? responseBuilder.build()
	      : responseBuilder.body(Mono.just(e.getMessage()), String.class);
	}
}
