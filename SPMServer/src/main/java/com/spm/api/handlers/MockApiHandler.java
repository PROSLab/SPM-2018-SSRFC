package com.spm.api.handlers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.entity.MockEntity;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class MockApiHandler {
	
	Map<String, MockEntity> userMap = new HashMap<String, MockEntity>();
	
	
	public MockApiHandler() {
        userMap.put("Peter", new MockEntity("Peter", "Johnson"));
	}



	public Mono<ServerResponse> addUser(ServerRequest request) {
		String name = request.queryParam("name").get();
		String surname = request.queryParam("surname").get();
		
		userMap.put(name, new MockEntity(name, surname));
		
		return Responses.ok("User Successfully Added!");
	}
	
	public Mono<ServerResponse> getUserSurname(ServerRequest request) {
		String name = request.queryParam("name").get();
		
		String surname = userMap.get(name).getSurname();
		
		return Responses.ok(surname);
	}
}
