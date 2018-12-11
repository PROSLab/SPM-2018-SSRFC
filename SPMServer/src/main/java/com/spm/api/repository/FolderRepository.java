package com.spm.api.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.Folder;


public interface FolderRepository extends ReactiveMongoRepository<Folder, String> {

}
