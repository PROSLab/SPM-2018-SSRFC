package com.spm.api.services;

import java.io.File;

import org.springframework.stereotype.Component;

import com.spm.api.entity.Repository;
import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;

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
	 * 
	 */


	
	
}
 