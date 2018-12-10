package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveMongoRepository<User, String> {
	Flux<User> findByName(String name);
	Mono<User> findByEmail(String email);
	Mono<User> findUserById(ObjectId id);
}
