package com.spm.api.handlers;

import java.io.File;
import java.util.Date;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.entity.Folder;
import com.spm.api.services.FileService;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class FileHandler {
	
	private FileService fileService;
	
	@Value("${upload.rootDir}")
    private String rootDir;
	private String fileName;
	public FileHandler(FileService fileService) {
		this.fileService = fileService;
	}

	public Mono<ServerResponse> uploadFileTest(ServerRequest request) { // just a test for files upload
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					Map<String, Part> map = parts.toSingleValueMap();
					FilePart filePart = (FilePart) map.get("files");
					filePart.transferTo( new File(rootDir + "/" + filePart.filename()) );
					
					return Responses.ok("OK");
				});
	}
	
	public Mono<ServerResponse> createRepository(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		Boolean publicR = request.queryParam("publicR").get().equals("true") ? true : false;
		String repositoryName = request.queryParam("repositoryName").get();
		
		Repository repo = new Repository(new ObjectId(idUser), new Date(), publicR, repositoryName);
		
		return fileService.createRepositorySchema(repo) // create Repository Schema on DB
				.flatMap(repository -> fileService.createRepositoryPath(rootDir, repository.getIdUser().toHexString() , repository.getId()))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
	}
	
	public Mono<ServerResponse> createFile(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository= request.queryParam("idRepository").get();
		String idFolder= request.queryParam("idRepository").get();

		String originalName = request.queryParam("originalName").get();
		String mimetype = "bpmn";
		FileEntity file = new FileEntity (new ObjectId(idUser),new ObjectId(idRepository),new ObjectId(idFolder),new Date(),null,originalName,mimetype,null,1);
		
		return fileService.createFileSchema(file)
				.flatMap(f -> {
					fileName= f.getId() + '.' + 1;
					return fileService.uploadPath(rootDir, idUser, idRepository,idFolder, fileName, mimetype);
				})
				.flatMap(notUsed -> {
					String path = rootDir + "/" + idUser + "/" + idRepository + "/" + idFolder+ "/" + fileName;
					return fileService.updateNames(fileName, path, file);
					
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
		
	}
	
	public Mono <ServerResponse> getAllRepo(ServerRequest request){
		String idUser = request.queryParam("idUser").get();
		return fileService.getAll(new ObjectId(idUser))
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	
	public Mono <ServerResponse> getRepoSpec(ServerRequest request){
		String idRepo = request.queryParam("id").get();
		return fileService.getRepoSpec(new ObjectId(idRepo))
				.flatMap(res -> Responses.ok(res));
	}
	
	public Mono <ServerResponse> getFolderSpec(ServerRequest request){
		String id = request.queryParam("id").get();
		return fileService.getRepoSpec(new ObjectId(id))
				.flatMap(res -> Responses.ok(res));
	}
	public Mono <ServerResponse>getAllFile(ServerRequest request){
		String idFolder = request.queryParam("idFolder").get();
		return fileService.getAllFile(new ObjectId(idFolder))
				.flatMap(res -> Responses.ok(res));
				
	}
	public Mono <ServerResponse>getAllFolders(ServerRequest request){
		String idRepository = request.queryParam("idRepository").get();
		return fileService.getAllFolders(new ObjectId(idRepository))
				.flatMap(res -> Responses.ok(res));
				
	}
	public Mono<ServerResponse> createFolder(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository=request.queryParam("idRepository").get();
		String folderName= request.queryParam("folderName").get();
		Folder fold = new Folder (new ObjectId(idUser),new ObjectId(idRepository),new Date(),folderName,null);
		return fileService.createFolderSchema(fold)
				.flatMap(folder -> fileService.createFolderPath(rootDir,folder.getIdUser().toHexString(),folder.getIdRepository().toHexString(),folder.getId()))
						
				.flatMap(notUsed ->{
					
					String path=  rootDir + "/" + idUser + "/" + idRepository + "/"+ fold.getId();
					return fileService.updatepath(path, fold);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
		/*
		 * 
		String idUser = request.queryParam("idUser").get();
		Boolean publicR = request.queryParam("publicR").get().equals("true") ? true : false;
		String repositoryName = request.queryParam("repositoryName").get();
		
		Repository repo = new Repository(new ObjectId(idUser), new Date(), publicR, repositoryName);
		
		return fileService.createRepositorySchema(repo) // create Repository Schema on DB
				.flatMap(repository -> fileService.createRepositoryPath(rootDir, repository.getIdUser().toHexString() , repository.getId()))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);*/
	}
}
