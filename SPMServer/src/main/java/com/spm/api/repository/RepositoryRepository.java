package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.Repository;

import reactor.core.publisher.Flux;

public interface RepositoryRepository extends ReactiveMongoRepository<Repository, String> {
	Flux<Repository> findAllByIdUser(ObjectId idUser);
}
