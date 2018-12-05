package com.spm.api.handlers;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class FileHandler {
	
	@Value("${upload.rootDir}")
    private String rootDir;
	
	public Mono<ServerResponse> uploadFileTest(ServerRequest request) { // just a test for files upload
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					Map<String, Part> map = parts.toSingleValueMap();
					FilePart filePart = (FilePart) map.get("files");
					filePart.transferTo( new File(rootDir + "/" + filePart.filename()) );
					
					
					return Responses.ok("OK");
				});
	}

}
