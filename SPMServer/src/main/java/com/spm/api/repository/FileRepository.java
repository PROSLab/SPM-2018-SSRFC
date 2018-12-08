package com.spm.api.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.FileEntity;

public interface FileRepository extends ReactiveMongoRepository<FileEntity, String> {

}
