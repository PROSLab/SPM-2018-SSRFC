package com.spm.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
/*import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;*/
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
public class CorsConfig {
	
	private static final String ALLOWED_HEADERS = "x-requested-with, authorization, Content-Type, Authorization, credential, X-XSRF-TOKEN";
	private static final String ALLOWED_METHODS = "GET, PUT, POST, DELETE, OPTIONS";
	private static final String ALLOWED_ORIGIN = "http://localhost:4200";
	private static final String MAX_AGE = "3600";
	
	/*@Bean
	CorsWebFilter corsFilter() {
		CorsConfiguration config = new CorsConfiguration();
		
		config.setAllowCredentials(true);
	    config.addAllowedOrigin(ALLOWED_ORIGIN);
	    config.addAllowedHeader(ALLOWED_HEADERS);
	    config.addAllowedMethod(ALLOWED_METHODS);
	    config.setMaxAge(3600L);
	    
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
	    
	    return new CorsWebFilter(source);
	}*/
	
	@Bean
	public WebFilter corsFilter() {
		return (ServerWebExchange ctx, WebFilterChain chain) -> {
			ServerHttpRequest request = ctx.getRequest();
			
			if(CorsUtils.isCorsRequest(request)) {
				ServerHttpResponse response = ctx.getResponse();
				HttpHeaders headers = response.getHeaders();
				headers.add("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
		        headers.add("Access-Control-Allow-Methods", ALLOWED_METHODS);
		        headers.add("Access-Control-Max-Age", MAX_AGE);
		        headers.add("Access-Control-Allow-Headers", ALLOWED_HEADERS);
				
				if(request.getMethod() == HttpMethod.OPTIONS) {
					response.setStatusCode(HttpStatus.OK);
					return Mono.empty();
				}
			}
			
			return chain.filter(ctx);
		};
	}

}
