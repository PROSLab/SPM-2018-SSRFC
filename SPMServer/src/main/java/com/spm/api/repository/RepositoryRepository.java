package com.spm.api.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.Repository;

public interface RepositoryRepository extends ReactiveMongoRepository<Repository, String> {

}
