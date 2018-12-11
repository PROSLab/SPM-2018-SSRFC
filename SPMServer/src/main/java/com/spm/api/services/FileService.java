package com.spm.api.services;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.entity.Folder;
import com.spm.api.repository.FileRepository;

import com.spm.api.repository.FolderRepository;
import com.spm.api.repository.RepositoryRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class FileService  {
	private FolderRepository folderRepository;
	private RepositoryRepository repositoryRepository;
	private FileRepository fileRepository;
	
	public FileService(RepositoryRepository repositoryRepository, FileRepository fileRepository, FolderRepository folderRepository) {
		this.repositoryRepository = repositoryRepository;
		this.fileRepository = fileRepository;
		this.folderRepository = folderRepository;
	}



	/*
	 * Create Repository DB Schema (here i work with DB)
	 */
	public Mono<Repository> createRepositorySchema(Repository repo) {
		return repositoryRepository.save(repo); // query to mongoDb
	}
	
	/*
	 * Create path for Repository (here i work with fileSystem)
	 */
	@SuppressWarnings("unused")
	public Mono<Object> createRepositoryPath(String rootDir, String idUser, String idRepository) {
		File files = new File(rootDir + File.separator + idUser + File.separator + idRepository);
		
		Object res = new Object() {
			private final String path = files.getPath();
			private final String user = idUser;
			private final String repository = idRepository;
			
			public String getPath() {
				return path;
			}
			public String getUser() {
				return user;
			}
			public String getRepository() {
				return repository;
			}
		};
		
		if(!files.exists()) {
			if (files.mkdirs()) {
				return Mono.just(res);
            } else {
                return Mono.error(new Exception("Directory not created"));
            }
		}
		
		return Mono.just(res);
	}
	
	/*
	 * Create File DB schema
	 */
	public Mono<FileEntity> createFileSchema(FileEntity file) {
		return fileRepository.save(file);
	}

	/*
	 * Create new bpmn file in the repository dir 
	 */
	public Mono<String> uploadPath(String rootDir, String idUser, String idRepository, String fileName, String mimetype){
		String strPath = rootDir + File.separator + idUser + File.separator + idRepository + File.separator + fileName + "." + mimetype;
		Path path = Paths.get(strPath);
		
		try {
			Files.createDirectories(path.getParent());
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception(e.getMessage()));
		}
		
		try {
			Files.createFile(path);
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception(e.getMessage()));
		}
		
		return Mono.just("OK");
	}
	
	/*
	 * Update fileDocument : parameters FileName and path
	 */
	public Mono<FileEntity>updateNames(String fileName,String path, FileEntity fileEntity){
		fileEntity.setFileName(fileName);
		fileEntity.setPath(path);
		return fileRepository.save(fileEntity);
	}
	
	/*
	 * Get all repo
	 */
	
	public Flux<Repository> getAll(ObjectId idUser) {
		
		 return  repositoryRepository.findAllByIdUser(idUser);
		
	}
/*
 * get a specific repo
 */

	public Mono<Repository> getRepoSpec(ObjectId idRepo) {
		return repositoryRepository.findRepoById(idRepo);
	}


/*
 * get all file in a repo
 */
public Mono<FileEntity> getAllFile(ObjectId idRepository) {
		
		return fileRepository.findFileByIdRepository(idRepository);
	}
	


/*
 * Create Folder DB Schema (here i work with DB)
 */
public Mono<Folder> createFolderSchema(Folder fold) {
	return folderRepository.save(fold); // query to mongoDb
}

/*
 * 
 * Create Path for Folders
 */
@SuppressWarnings("unused")
public Mono<Object> createFolderPath(String rootDir, String idUser, String idRepository,String idFolder) {
	File files = new File(rootDir + File.separator + idUser + File.separator + idRepository+ File.separator + idFolder);
	
	Object res = new Object() {
		private final String path = files.getPath();
		private final String user = idUser;
		private final String repository = idRepository;
		private final String folder=idFolder;
		public String getPath() {
			return path;
		}
		public String getUser() {
			return user;
		}
		public String getRepository() {
			return repository;
		}
		public String getFolder() {
			return folder;
		}
	};
	
	if(!files.exists()) {
		if (files.mkdirs()) {
			return Mono.just(res);
        } else {
            return Mono.error(new Exception("Directory not created"));
        }
	}
	
	return Mono.just(res);
}
public Mono<Folder>updatepath(String path,Folder folder){
	folder.setPath(path);
	return folderRepository.save(folder);
}




}
 






























































































































































































































































































