package com.spm.api.handlers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.utils.Choreography;
import com.spm.api.utils.Collaboration;
import com.spm.api.utils.Responses;
import com.spm.api.utils.InputStreamCollector;

import reactor.core.publisher.Mono;

@SuppressWarnings("deprecation")
@Component
public class ModelCheckHandler {
	
	private static String collaborationFolder = System.getProperty("java.io.tmpdir");
	private static String choreographyFolder = System.getProperty("java.io.tmpdir");
	private Map<String, Part> map;
	private InputStream collaborationInputStream;
	private InputStream choreographyInputStream;
	
	@SuppressWarnings({ "unchecked" })
	public Mono<ServerResponse> uploadModel(ServerRequest request) {
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					map = parts.toSingleValueMap();
					
					return map.get("collaboration").content().collect(
							InputStreamCollector::new, 
							(t, dataBuffer) -> t.collectInputStream(dataBuffer.asInputStream())
					);
					
				})
				.flatMap(is -> {
					collaborationInputStream = is.getInputStream();
					return Mono.just(true);
				})
				.flatMap(notUsed -> {
					return map.get("choreography").content().collect(
							InputStreamCollector::new, 
							(t, dataBuffer) -> t.collectInputStream(dataBuffer.asInputStream())
					);
				})
				.flatMap(is -> {
					choreographyInputStream = is.getInputStream();
					return Mono.just(true); 
				})
				.flatMap(parts -> {
					
					File collaborationFile;
					File choreographyFile;
					
					try {
						collaborationFile = File.createTempFile("collaboration", ".aut", new File(collaborationFolder));
						choreographyFile = File.createTempFile("choreography", ".aut", new File(choreographyFolder));
					} catch (IOException e) {
						e.printStackTrace();
						return Mono.error(new Exception(e.getMessage()));
					}
					
					Collaboration coobj = new Collaboration();
					Choreography chobj = new Choreography();
					
					ArrayList<String> choreographyActions =	chobj.init(choreographyInputStream, false, choreographyFile);
					coobj.setChoreographyActions(choreographyActions);
					coobj.init(collaborationInputStream, false, collaborationFile);
					
					
					JSONObject obj = new JSONObject();
					obj.put("choreography", choreographyFile.getName());
					obj.put("collaboration", collaborationFile.getName());
					StringWriter out = new StringWriter();
					try {
						obj.writeJSONString(out);
					} catch (IOException e) {
						e.printStackTrace();
						return Mono.error(new Exception(e.getMessage()));
					}
					String jsonText = out.toString();
					
					return Responses.ok(jsonText);
				})
				.onErrorResume(Exception.class, Responses::internalServerError);
	}
	
	public Mono<ServerResponse> downloadModel(ServerRequest request) {
		String fileName = request.queryParam("filename").get();
		Boolean collaboration = request.queryParam("collaboration").get().equals("true") ? true : false;
		fileName.replace("/", "");
		
		String fileLocation;
		if (collaboration) fileLocation = collaborationFolder + File.separator + fileName;
		else fileLocation = choreographyFolder + File.separator + fileName;
		
		// Retrieve the file
		Resource resource = new FileSystemResource(fileLocation);
		File file = new File(fileLocation);
		
		if (file.exists()) return Responses.okFile(resource, file);
		else return ServerResponse.notFound().build();
	}
}



















