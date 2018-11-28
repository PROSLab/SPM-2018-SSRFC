package com.spm.api.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.spm.api.entity.PasswordChange;

public interface PasswordChangeRepository extends ReactiveMongoRepository<PasswordChange, String> {}
