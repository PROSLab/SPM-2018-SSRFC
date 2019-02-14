package com.spm.api.handlers;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.exceptions.EmailException;
import com.spm.api.services.ShareService;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class ShareHandler {
	
	private ShareService shareService;
	
	@Value("${upload.rootDir}")
    private String rootDir;
	private String idNewRepo;
	private String idNewFile;
	private String newRepoPath;
	private String sourceFilePath;
	private FileEntity newFileEntity;
	
	public ShareHandler(ShareService shareService) {
		this.shareService = shareService;
	}



	public Mono<ServerResponse> shareRepository(ServerRequest request) {
		String idRepository = request.queryParam("idRepository").get();
		String emailTo = request.queryParam("emailTo").get();
		
		return shareService.updateRepoVisibility(idRepository, true)
				.flatMap(notUsed -> shareService.sendShareLink(idRepository, emailTo))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(EmailException.class, Responses::badRequest)
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> shareModel(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String emailTo = request.queryParam("emailTo").get();
		String repositoryName = request.queryParam("repositoryName").get();
		String idUser = request.queryParam("idUser").get();
		String autore =request.queryParam("autore").get();

		/*
		 * Create repository schema and get the id
		 * Get the file schema 
		 * Create new file schema and set the idRepository with new id, and idFolder to null (verify other fields)
		 * Create new repository folder
		 * Copy the entire directory to the new repository folder
		 * Rename all its files with the new idFile (take care of versions)
		 * Update fileName and path
		 * */
		
		Repository repo = new Repository(new ObjectId(idUser), new Date(), true, repositoryName,autore);
		
		return shareService.createRepositorySchema(repo)
				.flatMap(r -> {			// repository
					idNewRepo = r.getId();
					return shareService.getFileSchema(idFile); 
				})
				.flatMap(f -> {			// file
					sourceFilePath = f.getPath();
					
					FileEntity file = new FileEntity (
							new ObjectId(idUser),
							new ObjectId(idNewRepo),
							null,					// idFolder
							new Date(),
							null,					// fileName
							f.getOriginalName(),
							f.getMimetype(),
							null,					// path
							f.getcVersion(),
							f.getDeletedVersions(),
							f.getAutore(),
							f.getSoundness(),
							f.getSafeness(),
							f.getValidity(),
							f.getFileType()
					);
					
					return shareService.createFileSchema(file);
				})
				.flatMap(f -> {
					newFileEntity = f;
					idNewFile = f.getId();
					return shareService.createRepositoryPath(rootDir, idUser, idNewRepo, idNewFile);
				})
				.flatMap(repoPath -> {
					newRepoPath = repoPath;
					// Copy the entire directory to the new repository folder
					return shareService.copyDir(sourceFilePath, repoPath);
					
				})
				.flatMap(notUsed -> {
					// Rename all its files with the new idFile (take care of versions)
					return shareService.renameAllFileFolderFiles(newRepoPath, idNewFile);
				})
				.flatMap(notUsed -> {
					// Update fileName and path
					String fileName = idNewFile + "." + newFileEntity.getcVersion() + "." + newFileEntity.getMimetype();
					
					return shareService.updateNames(fileName, newRepoPath, newFileEntity);
				})
				.flatMap(notUsed -> shareService.sendShareLink(idNewRepo, idNewFile, emailTo))
				.flatMap(res -> Responses.ok(res));
	}

}
