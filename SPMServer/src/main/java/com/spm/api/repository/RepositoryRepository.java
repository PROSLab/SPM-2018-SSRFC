package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.Repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface RepositoryRepository extends ReactiveMongoRepository<Repository, String> {
	Flux<Repository> findAllByIdUser(ObjectId idUser);
	Mono<Repository> findRepoById(ObjectId id);
	Flux <Repository> findAllRepoBypublicR(Boolean publicR);
}
