package com.spm.api.services;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;

import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.repository.FileRepository;
import com.spm.api.repository.RepositoryRepository;
import com.spm.api.utils.Email;

import reactor.core.publisher.Mono;

@Component
public class ShareService {
	private RepositoryRepository repositoryRepository;
	private FileRepository fileRepository;
	private Email emailClient;
	
	public ShareService(RepositoryRepository repositoryRepository, FileRepository fileRepository, Email emailClient) {
		this.repositoryRepository = repositoryRepository;
		this.fileRepository = fileRepository;
		this.emailClient = emailClient;
	}
	
	public Mono<Repository> updateRepoVisibility(String idRepository, Boolean newRepoVisibility) {
		return repositoryRepository.findById(idRepository)
				.flatMap(r -> {
					r.setPublicR(newRepoVisibility);
					return repositoryRepository.save(r);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new BadRequestException("Repository not found"))));
		
	}
	
	public Mono<Boolean> sendShareLink(String idRepository, String emailTo) {
		String link = "http://localhost:4200/repositoryID/"+idRepository;
		
		return emailClient.sendSimpleMessage(emailTo, "Share Repository", link);
	}
	
	public Mono<Boolean> sendShareLink(String idRepository, String idFile, String emailTo) {
		String link = "http://localhost:4200/repositoryID/"+idRepository+"/fileID/"+idFile;
		
		return emailClient.sendSimpleMessage(emailTo, "Share Model", link);
	}
	
	public Mono<Repository> createRepositorySchema(Repository repo) {
		return repositoryRepository.save(repo);
	}
	
	public Mono<FileEntity> getFileSchema(String idFile){
		return fileRepository.findById(idFile);
	}
	
	public Mono<FileEntity> createFileSchema(FileEntity file) {
		return fileRepository.save(file);
	}
	
	public Mono<String> createRepositoryPath(String rootDir, String idUser, String idRepository, String idFile) {
		File files = new File(rootDir + File.separator + idUser + File.separator + idRepository + File.separator + idFile);
		
		if(!files.exists()) {
			if (files.mkdirs()) {
				return Mono.just(files.getPath());
            } else {
                return Mono.error(new Exception("Directory not created"));
            }
		}
		
		return Mono.just(files.getPath());
	}
	
	public Mono<Boolean> copyDir(String source, String destination) {
		File srcDir = new File(source);
		File destDir = new File(destination);
		
		try {
			FileUtils.copyDirectory(srcDir, destDir);
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception("Can't copy directory.   " + e));
		}
		
		return Mono.just(true);
	}
	
	public Mono<Boolean> renameFileFolder(String path, String prefixPath, String name) {
		File file = new File(path);
		Boolean res = file.renameTo( new File(prefixPath + File.separator + name) );
		return Mono.just(res);
	}
	
	public Mono<Boolean> renameAllFileFolderFiles(String folderPath, String newFileName) {
		File myfolder = new File(folderPath);
		File[] file_array = myfolder.listFiles();
		
		for (int i = 0; i < file_array.length; i++) {
			File myfile = new File( folderPath + File.separator + file_array[i].getName() );
			
			String long_file_name = file_array[i].getName();
			String[] tokens = long_file_name.split("\\.");
			String new_file_name = newFileName + "." + tokens[1] + "." + tokens[2];
            
            if(myfile.renameTo( new File(folderPath + File.separator + new_file_name) ) == false)
            {
            	return Mono.error(new Exception("Can't raname file"));
            }
		}
		
		return Mono.just(true);
	}
	
	public Mono<FileEntity> updateNames(String fileName,String path, FileEntity fileEntity){
		fileEntity.setFileName(fileName);
		fileEntity.setPath(path);
		return fileRepository.save(fileEntity);
	}
	
}















