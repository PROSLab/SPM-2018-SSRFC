package com.spm.api.services;

import java.io.File;
import java.util.Map;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;

import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;
import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class FileService {
	
	private RepositoryRepository repositoryRepository;
	private FileRepository fileRepository;
	
	public FileService(RepositoryRepository repositoryRepository, FileRepository fileRepository) {
		this.repositoryRepository = repositoryRepository;
		this.fileRepository = fileRepository;
	}



	/*
	 * Create Repository DB Schema (here i work with DB)
	 */
	public Mono<Repository> createRepositorySchema(Repository repo) {
		return repositoryRepository.save(repo); // query to mongoDb
	}
	
	/*
	 * Create path for Repository (here i work with fileSystem)
	 */
	public Mono<String> createRepositoryPath(String rootDir, String idUser, String idRepository) {
		File files = new File(rootDir + "/" + idUser + "/" + idRepository);
		
		if(!files.exists()) {
			if (files.mkdirs()) {
                return Mono.just(files.getPath());
            } else {
                return Mono.error(new Exception("Directory not created"));
            }
		}
		
		return Mono.just("OK");
	}
	
	/*Create File DB schema
	 * 
	 */
	public Mono<FileEntity> createFileSchema(FileEntity file) {
		return fileRepository.save(file);
	}

	/*
	 * 
	 * Upload File Path 
	 */
	public Mono<Void>uploadPath(String rootDir,String idUser, String idRepository,String fileName, ServerRequest request){
		return request.body(BodyExtractors.toMultipartData())
				.flatMap(parts -> {
					Map<String, Part> map = parts.toSingleValueMap();
					FilePart filePart = (FilePart) map.get("files");
					return filePart.transferTo( new File(rootDir + "/" + idUser + "/" + idRepository + "/" + fileName ));
				});
	}
	
	/*
	 * Update fileDocument : parameters FileName and path
	 */
	public Mono<FileEntity>updateNames(String fileName,String path, FileEntity fileEntity){
		fileEntity.setFileName(fileName);
		fileEntity.setPath(path);
		return fileRepository.save(fileEntity);
	}
}
 






























































































































































































































































































