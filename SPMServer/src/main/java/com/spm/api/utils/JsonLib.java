package com.spm.api.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

public class JsonLib {
	
	 private static final ObjectMapper JSON = new ObjectMapper();
	 
	 public static Mono<String> write(Object value) {
		 try 
		 { 
			 return Mono.just(JsonLib.JSON.writeValueAsString(value)); 
		 }
		 catch (JsonProcessingException e) 
		 { 
			 return Mono.error(e); 
		 }
	 }

}
