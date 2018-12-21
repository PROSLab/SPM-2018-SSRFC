package com.spm.api.handlers;

import java.io.File;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

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
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.entity.Folder;
import com.spm.api.services.FileService;
import com.spm.api.utils.FileLib;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class FileHandler {
	
	private FileService fileService;
	
	@Value("${upload.rootDir}")
    private String rootDir;
	private String fileName;
	private String idFile;
	
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
		Optional<String> idFolder= request.queryParam("idFolder");
		String originalName = request.queryParam("originalName").get();
		String mimetype = "bpmn";
		
		FileEntity file = new FileEntity (
				new ObjectId(idUser),
				new ObjectId(idRepository),
				idFolder.isPresent() == true ? new ObjectId(idFolder.get()) : null,
				new Date(),
				null,
				originalName,
				mimetype,
				null,
				1
		);
		
		return fileService.createFileSchema(file)
				.flatMap(f -> {
					idFile = f.getId();
					fileName = idFile + '.' + 1;
					return fileService.uploadPath(rootDir, idUser, idRepository, idFolder, fileName, idFile, mimetype);
				})
				.flatMap(notUsed -> {
					String path = rootDir + "/" + idUser + "/" + idRepository;
					
					if(idFolder.isPresent() == true) {
						path += "/" + idFolder.get();
					}
					
					path += "/" + idFile;
					
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
		String idFold = request.queryParam("id").get();
		return fileService.getFolderSpec(new ObjectId(idFold))
				.flatMap(res -> Responses.ok(res));
	}
	
	public Mono <ServerResponse> getAllFile(ServerRequest request){

		Optional<String> idFolder= request.queryParam("idFolder");
		String idRepository= request.queryParam("idRepository").get();
		return fileService.getAllFile(idFolder.isPresent() == true ? new ObjectId(idFolder.get()) : null,new ObjectId(idRepository))				
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	
	public Mono <ServerResponse> getAllFolders(ServerRequest request){
		String idRepository = request.queryParam("idRepository").get();
		return fileService.getAllFolders(new ObjectId(idRepository))
				.collectList()
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
	
	/*
	 * Params: idFile, version
	 * */
	public Mono<ServerResponse> createNewVersion(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String version = request.queryParam("version").get();
		String mimetype = "bpmn";
		
		return fileService.updateFileEntity(version, idFile)
				.flatMap(f -> {
					return fileService.cloneFileVersion(f, version, mimetype, rootDir);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError)
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyRepoName(ServerRequest request) {
		String idRepository = request.queryParam("idRepository").get();
		String newRepoName = request.queryParam("newRepoName").get();
		
		return fileService.updateRepoName(idRepository, newRepoName)
				.flatMap(repo -> Responses.ok(repo))
				.onErrorResume(Exception.class, Responses::badRequest);
	}

	public Mono<ServerResponse> modifyFileName(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String newFileName = request.queryParam("newFileName").get();
		
		return fileService.updateFileName(idFile, newFileName)
				.flatMap(file -> Responses.ok(file))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyRepoVisibility(ServerRequest request) {
		String idRepository = request.queryParam("idRepository").get();
		Boolean newRepoVisibility = request.queryParam("newRepoVisibility").get().equals("true") ? true : false;
		
		return fileService.updateRepoVisibility(idRepository, newRepoVisibility)
				.flatMap(repo -> Responses.ok(repo))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyFolderName(ServerRequest request) {
		String idFolder = request.queryParam("idFolder").get();
		String newFileName = request.queryParam("newFolderName").get();
		
		return fileService.updateFolderName(idFolder, newFileName)
				.flatMap(file -> Responses.ok(file))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	public Mono <ServerResponse> getFileSpec(ServerRequest request){
		String idFile = request.queryParam("id").get();
		return fileService.getFileSpec(new ObjectId(idFile))
				.flatMap(res -> Responses.ok(res));
	}
	
	public Mono <ServerResponse> deleteRepository(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository = request.queryParam("idRepository").get();
		
		return fileService.createFileObjRepositoryPath(rootDir, idUser, idRepository)
				.flatMap(repo -> {
					return Mono.fromRunnable(() -> FileLib.deleteFolder(repo));
				})
				.flatMap(res -> Responses.ok(res));
	}
}















