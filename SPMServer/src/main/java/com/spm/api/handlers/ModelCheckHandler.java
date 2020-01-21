package com.spm.api.handlers;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Stream;

import org.apache.commons.lang3.SystemUtils;
import org.json.simple.JSONObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FormFieldPart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.exceptions.BadRequestException;
import com.spm.api.utils.Choreography;
import com.spm.api.utils.ChoreographyModelParser;
import com.spm.api.utils.Collaboration;
import com.spm.api.utils.Responses;
import com.spm.api.utils.TestXML;
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
	
	@SuppressWarnings("unchecked")
	public Mono<ServerResponse> checkEquivalence(ServerRequest request) {
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					map = parts.toSingleValueMap();
					
					Boolean weak = ((FormFieldPart)map.get("weak")).value().equals("true") ? true : false;
					String equivalence  = ((FormFieldPart)map.get("equivalence")).value();
					String collaborationPath = ((FormFieldPart)map.get("collaborationPath")).value();
					String choreographyPath = ((FormFieldPart)map.get("choreographyPath")).value();
					
					collaborationPath = collaborationFolder + File.separator + collaborationPath;
					choreographyPath = choreographyFolder + File.separator + choreographyPath;
					
					String files = "\"" + choreographyPath.replace("\\", "/") + "\"" + " " + "\""
										+ collaborationPath.replace("\\", "/") + "\"";
					
					String log = "";
					String line, result = "";
					String command = null;
					Boolean resultState = false;
					String counterexample = "";
					JSONObject obj = new JSONObject();
					ProcessBuilder pb = null;
					
					String pbpath = null;
					
					if(SystemUtils.IS_OS_WINDOWS) pbpath = "C:/Program Files/mCRL2/bin/ltscompare";
					if(SystemUtils.IS_OS_MAC) pbpath = "/Applications/mCRL2.app/Contents/bin/ltscompare";
					
					if (equivalence.equals("Trace") && weak) {
						command = "-c -eweak-trace " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-eweak-trace", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					if (equivalence.equals("Trace") && !weak) {
						command = "-c -etrace " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-etrace", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					if (equivalence.equals("Branching") && weak) {
						command = "-c -edpbranching-bisim " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-edpbranching-bisim", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					if (equivalence.equals("Branching") && !weak) {
						command = "-c -ebranching-bisim " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-ebranching-bisim", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					if (equivalence.equals("Bisimulation") && weak) {
						command = "-c -eweak-bisim " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-eweak-bisim", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					if (equivalence.equals("Bisimulation") && !weak) {
						command = "-c -ebisim " + files;
						pb = new ProcessBuilder(pbpath, "-c", "-ebisim", choreographyPath.replace("\\", "/"), collaborationPath.replace("\\", "/"));
					}
					
					log += command + '\n';
					Process proc;
					
					try 
					{
						pb.redirectErrorStream(true); // equivalent of 2>&1
						proc = pb.start();
						
						try 
						{
							proc.waitFor();
						} 
						catch (InterruptedException e) 
						{
							e.printStackTrace();
						}
						
						BufferedReader reader = new BufferedReader(new InputStreamReader(proc.getInputStream()));
						
						while ((line = reader.readLine()) != null) {
							result += line + "\n";
						} // produce result for the program.
						
						resultState = !(result.contains(" not "));
						
						if (result.contains("Saved counterexample to")) {

							Stream<String> stream = Files.lines(Paths.get("Counterexample0.trc"));

							Iterator<String> it = stream.iterator();

							while (it.hasNext()) {

								counterexample += it.next();

							}

						}
						resultState = !(result.contains(" not "));
						log = log.replace(collaborationFolder, "");
						command = command.replace(collaborationFolder, "");
						log = log.replace(choreographyFolder, "");
						command = command.replace(choreographyFolder, "");
						
						obj.put("state", true);
						obj.put("resultState", resultState);
						obj.put("command", command);
						obj.put("log", log);
						obj.put("result", result);
						obj.put("counterExample", counterexample);
						
						// return values.
						StringWriter out = new StringWriter();
						obj.writeJSONString(out);
						String jsonText = out.toString();
						
						return Responses.ok(jsonText);
						
					} 
					catch (IOException e) 
					{
						obj.put("state", false);
						StringWriter errors = new StringWriter();
						e.printStackTrace(new PrintWriter(errors));
						obj.put("errors", errors.toString());

						StringWriter out = new StringWriter();
						try 
						{
							obj.writeJSONString(out);
						} catch (IOException e1) {
							e1.printStackTrace();
						}
						String jsonText = out.toString();
						
						return ServerResponse.status(500).body(Mono.just(jsonText), String.class);
						
					}
					
				});
	}
	
	@SuppressWarnings("unchecked")
	public Mono<ServerResponse> parseModel(ServerRequest request) {
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
				.flatMap(notUsed -> {
					
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
                    ChoreographyModelParser chobj = new ChoreographyModelParser();
                    
                    ArrayList<String> choreographyActions =	chobj.init(choreographyInputStream, choreographyFile);
                    coobj.setChoreographyActions(choreographyActions);
                    coobj.init(collaborationInputStream, false, collaborationFile);
                    
                    //filePart.transferTo(choreographyFile);
                    //ChoreographyModelParser parser = new ChoreographyModelParser();
                    //parser.init(choreographyFile);
                    //return Responses.ok(200);
                    
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
	
	public Mono<ServerResponse> mergeModel(ServerRequest request) {
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					map = parts.toSingleValueMap();
					FilePart senderFilePart = (FilePart) map.get("sender");
					FilePart receiverFilePart = (FilePart) map.get("receiver");
					
					File merge;
					String tempDir = System.getProperty("java.io.tmpdir");
					
					try {
						merge = File.createTempFile("merge", ".bpmn", new File(tempDir));
					} catch (IOException e) {
						e.printStackTrace();
						return Mono.error(new Exception(e.getMessage()));
					}
					
					try {
						TestXML.init(senderFilePart, receiverFilePart/*, merge*/);
						TestXML.mergeXml();
						TestXML.writeOutputFile(merge);
						
					} catch (Exception e) {
						return Mono.error( new BadRequestException(e.getMessage()) );
					}
					
					String path = System.getProperty("java.io.tmpdir") + File.separator + merge.getName();
					Resource resource = new FileSystemResource(path);
					
					return Responses.okFile(resource, merge);
				})
				.onErrorResume(BadRequestException.class, Responses::badRequest)
				.onErrorResume(Exception.class, Responses::internalServerError);
	}
	
	
	
	
	
	
	
	
	
	
}