package com.spm.api.services;

import org.springframework.stereotype.Component;

import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;
import com.spm.api.utils.Email;

import reactor.core.publisher.Mono;

@Component
public class ShareService {
	private RepositoryRepository repositoryRepository;
	private FileRepository fileRepository;
	private Email emailClient;
	
	public ShareService(RepositoryRepository repositoryRepository, FileRepository fileRepository, Email emailClient) {
		this.repositoryRepository = repositoryRepository;
		this.fileRepository = fileRepository;
		this.emailClient = emailClient;
	}
	
	public Mono<Repository> updateRepoVisibility(String idRepository, Boolean newRepoVisibility) {
		return repositoryRepository.findById(idRepository)
				.flatMap(r -> {
					r.setPublicR(newRepoVisibility);
					return repositoryRepository.save(r);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new BadRequestException("Repository not found"))));
		
	}
	
	public Mono<Boolean> sendEmailRepositoryLink(String idRepository, String emailTo) {
		String repoLink = "http://localhost:4200/shareRepository?idRepository="+idRepository;
		
		return emailClient.sendSimpleMessage(emailTo, "Share Repository", repoLink);
	}
	
}
