package com.spm.api.services;

import java.io.File;
import java.io.IOException;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;

import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;

import reactor.core.publisher.Flux;
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
	@SuppressWarnings("static-access")
	public Mono<String> uploadPath(String rootDir, String idUser, String idRepository, String fileName, String mimetype){
		String path = rootDir + File.separator + idUser + File.separator + idRepository + File.separator + fileName + "." + mimetype;
		File dir = new File(path);
		
		if(!dir.exists()) {
			if (!dir.mkdirs()) {
				return Mono.error(new Exception("Directory not created"));
            }
		}
		
		try {
			dir.createNewFile();
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception("File not created"));
		}
		
		return Mono.just("OK");
	}
	
	/*
	 * Update fileDocument : parameters FileName and path
	 */
	public Mono<FileEntity>updateNames(String fileName,String path, FileEntity fileEntity){
		fileEntity.setFileName(fileName);
		fileEntity.setPath(path);
		return fileRepository.save(fileEntity);
	}
	
	/*
	 * Get all repo
	 */
	public Flux<Repository> getAll(ObjectId idUser) {
		
		return repositoryRepository.findAllByIdUser(idUser);
	}
}
 






























































































































































































































































































