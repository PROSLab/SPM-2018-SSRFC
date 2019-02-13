package com.spm.api;

import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
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
    
    /*Selenium variables*/
    public static String browser;
	static WebDriver driver;
	static String projectPath = System.getProperty("user.dir"); 
    
    
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
	
	/*Selenium Chrome test - Login*/
	@Test
    public void seleniumLoginTest() throws Exception {
		browser = "Chrome";
		String location = File.separator + "drivers" + File.separator + "chromedriver.exe";  
		System.setProperty("webdriver.chrome.driver", projectPath + location);
		driver = new ChromeDriver();
		driver.get("http://localhost:4200/login");
		driver.findElement(By.id("loginEmail")).sendKeys("scalaemanuele92@gmail.com");
		Thread.sleep(1000);
		driver.findElement(By.id("loginPassword")).sendKeys("fabiobello92");
		driver.findElement(By.id("loginButton")).click();
		Thread.sleep(5000);
		assertTrue(driver.findElement(By.id("welcomeCard")).isDisplayed());
	}
	
	
}
