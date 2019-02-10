package com.spm.api;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

@RunWith(SpringRunner.class)
@SpringBootTest
public class WebClientTests {
	@Autowired
    ApplicationContext context;
	
    WebTestClient webClient;
    
    @Before
    public void setup() {
        this.webClient = WebTestClient
            .bindToApplicationContext(this.context)
            .configureClient()
            .build();
    }
    
	@Test
    public void helloWorldTest() throws Exception {
		webClient
			.get().uri("/api/user/")
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.isEqualTo("HELLO WORLD");
	}
	
	@Test
    public void helloWorldFailTest() throws Exception {
		webClient
			.get().uri("/api/user/")
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.isEqualTo("HELLO WAR");
	}
	
	@Test
    public void helloWorldFailTest2() throws Exception {
		webClient
			.get().uri("/api/user/")
			.exchange()
			.expectStatus().isOk()
			.expectBody(String.class)
			.isEqualTo("HELLO PUPPY");
	}
	
}
