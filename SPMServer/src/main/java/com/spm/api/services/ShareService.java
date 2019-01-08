package com.spm.api.services;

import org.springframework.stereotype.Component;

import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;

@Component
public class ShareService {
	private RepositoryRepository repositoryRepository;
	private FileRepository fileRepository;
	
	public ShareService(RepositoryRepository repositoryRepository, FileRepository fileRepository) {
		this.repositoryRepository = repositoryRepository;
		this.fileRepository = fileRepository;
	}
	
}
