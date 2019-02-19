package com.spm.api;

import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
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
	
	@Test
    public void goToGoogleTest() throws Exception {
		browser = "Chrome";
		String os = System.getProperty("os.name").toLowerCase();
		String location = null;
				
		if (os.indexOf("win") >= 0) {
			System.out.println("This is Windows");
			location = File.separator + "drivers" + File.separator + "win" + File.separator + "chromedriver.exe";  
		} else if (os.indexOf("mac") >= 0) {
			System.out.println("This is Mac");
			location = File.separator + "drivers" + File.separator + "macos" + File.separator + "chromedriver";  
		} else if (os.indexOf("nix") >= 0 || os.indexOf("nux") >= 0 || os.indexOf("aix") > 0 ) {
			System.out.println("This is Unix or Linux");
			location = File.separator + "drivers" + File.separator + "linux" + File.separator + "chromedriver";  
		} else {
			System.out.println("Your OS is not support!!");
		}
		
		System.setProperty("webdriver.chrome.driver", projectPath + location);
		
		ChromeOptions options = new ChromeOptions();
		options.setExperimentalOption("useAutomationExtension", false);
		
		driver = new ChromeDriver(options);
		driver.get("https://www.google.it/");
	}
	
	/*Selenium Chrome test - Login*/
	@Test
    public void seleniumLoginTest() throws Exception {
		browser = "Chrome";
		String os = System.getProperty("os.name").toLowerCase();
		String location = null;
				
		if (os.indexOf("win") >= 0) {
			System.out.println("This is Windows");
			location = File.separator + "drivers" + File.separator + "win" + File.separator + "chromedriver.exe";  
		} else if (os.indexOf("mac") >= 0) {
			System.out.println("This is Mac");
			location = File.separator + "drivers" + File.separator + "macos" + File.separator + "chromedriver";  
		} else if (os.indexOf("nix") >= 0 || os.indexOf("nux") >= 0 || os.indexOf("aix") > 0 ) {
			System.out.println("This is Unix or Linux");
			location = File.separator + "drivers" + File.separator + "linux" + File.separator + "chromedriver";  
		} else {
			System.out.println("Your OS is not support!!");
		}
		
		System.out.println(projectPath + location);
		System.setProperty("webdriver.chrome.driver", projectPath + location);
		
		ChromeOptions options = new ChromeOptions();
		options.setExperimentalOption("useAutomationExtension", false);
		/*options.addArguments("start-maximized"); // open Browser in maximized mode
		options.addArguments("disable-infobars"); // disabling infobars
		options.addArguments("--disable-extensions"); // disabling extensions
		options.addArguments("--disable-gpu"); // applicable to windows os only
		options.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems
		options.addArguments("--no-sandbox"); // Bypass OS security model
		options.addArguments("--headless");*/
		
		driver = new ChromeDriver(options);
		driver.get("http://localhost:4200/login");
		driver.findElement(By.id("loginEmail")).sendKeys("scalaemanuele92@gmail.com");
		Thread.sleep(1000);
		driver.findElement(By.id("loginPassword")).sendKeys("fabiobello92");
		driver.findElement(By.id("loginButton")).click();
		Thread.sleep(5000);
		assertTrue(driver.findElement(By.id("welcomeCard")).isDisplayed());
	}
	
	
}
