package com.spm.api.handlers;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.services.ShareService;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class ShareHandler {
	
	private ShareService shareService;
	
	public ShareHandler(ShareService shareService) {
		this.shareService = shareService;
	}



	public Mono<ServerResponse> shareRepository(ServerRequest request) {
		
		return Responses.ok("OK");
	}

}
