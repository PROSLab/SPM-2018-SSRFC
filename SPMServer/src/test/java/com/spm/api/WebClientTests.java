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
	public void mockApi_addUser() throws Exception {
		webClient
		.get().uri("/mockapi/addUser?name={name}&surname={surname}", "Jack", "Smith")
		.exchange()
        .expectStatus().isOk()
        .expectBody(String.class)
        .isEqualTo("User Successfully Added!");
	}
	
	@Test
	public void mockApi_getUserSurname() throws Exception {
		webClient
		.get().uri("/mockapi/getUserSurname?name={name}", "Peter")
		.exchange()
        .expectStatus().isOk()
        .expectBody(String.class)
        .isEqualTo("Johnson");
	}
	
}
