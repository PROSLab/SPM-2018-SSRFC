package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.FileEntity;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface FileRepository extends ReactiveMongoRepository<FileEntity, String> {

	Flux<FileEntity> findFileByIdFolder(ObjectId idFolder);


}
