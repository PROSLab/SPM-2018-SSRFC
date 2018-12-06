package com.spm.api.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.File;

public interface FileRepository extends ReactiveMongoRepository<File, String> {

}
