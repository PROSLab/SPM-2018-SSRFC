package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.Folder;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface FolderRepository extends ReactiveMongoRepository<Folder, String> {
	
	Flux<Folder> findFolderByIdRepository(ObjectId idRepository);
	Mono<Folder>findFolderById(ObjectId id);

}