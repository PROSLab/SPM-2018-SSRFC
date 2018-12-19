package com.spm.api.services;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
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
	public Mono<String> uploadPath(String rootDir, String idUser, String idRepository, Optional<String> idFolder, String fileName, String idFile, String mimetype) {
		String suffixPath = idFolder.isPresent() == true ? File.separator + idFolder.get() + 
		          							               File.separator + idFile +
		          							               File.separator + fileName + "." + mimetype
														 : File.separator + idFile +
														   File.separator + fileName + "." + mimetype;
		
		String strPath = rootDir + File.separator + idUser + File.separator + idRepository + suffixPath;
		
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
		 return repositoryRepository.findAllByIdUser(idUser);
	}
	
	/*
	 * get a specific repo
	 */
	public Mono<Repository> getRepoSpec(ObjectId idRepo) {
		return repositoryRepository.findRepoById(idRepo);
	}
	
	/*
	 * Get a specific folder
	 */
	public Mono<Folder> getFolderSpec(ObjectId idFolder) {
		return folderRepository.findFolderById(idFolder);
	}

	/*
	 * get all file in a folder
	 */
	public Flux <FileEntity> getAllFile(ObjectId idFolder) {
		return fileRepository.findFileByIdFolder(idFolder);
	}

	/*
	 * get all Folder
	 */
	public Flux <Folder> getAllFolders(ObjectId idRepository) {
		return folderRepository.findFolderByIdRepository(idRepository);
	}


	/*
	 * Create Folder DB Schema (here i work with DB)
	 */
	public Mono<Folder> createFolderSchema(Folder fold) {
		return folderRepository.save(fold); // query to mongoDb
	}

	/*
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
	
	public Mono<Folder> updatepath(String path,Folder folder){
		folder.setPath(path);
		return folderRepository.save(folder);
	}
	
	/*
	 * Update cVersion, fileName of a File document db
	 */
	public Mono<FileEntity> updateFileEntity(String version, String idFile) {
		return fileRepository.findById(idFile)
				.flatMap(f -> {
					int newVersion = f.getcVersion() + 1;
					
					if(Integer.parseInt(version) > f.getcVersion()) {
						return Mono.error(new BadRequestException("Version does not exist"));
					}
					
					String newFileName = f.getId() + '.' + newVersion;
					
					f.setFileName(newFileName);
					f.setcVersion(newVersion);
					
					return fileRepository.save(f);
				});
	}

	public Mono<FileEntity> cloneFileVersion(FileEntity sourceFile, String version, String mimetype, String rootDir) {
		String prefix = rootDir + File.separator + sourceFile.getIdUser().toHexString()
							    + File.separator + sourceFile.getIdRepository().toHexString();
		
		String sourcePath = prefix;
		String destinationPath = prefix;
		
		if(sourceFile.getIdFolder() != null) {
			String pathFolder = File.separator + sourceFile.getIdFolder().toHexString();
			sourcePath += pathFolder;
			destinationPath += pathFolder;
		}
		
		String pathFile = File.separator + sourceFile.getId();
		sourcePath += pathFile + File.separator + sourceFile.getId() + '.' + version + '.' + mimetype;
		destinationPath += pathFile + File.separator + sourceFile.getId() + '.' + sourceFile.getcVersion() + '.' + mimetype;
		
		try {
			File source = new File(sourcePath);
			File dest = new File(destinationPath);
			Files.copy(source.toPath(), dest.toPath());
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception(e.getMessage()));
		}
		
		
		return Mono.just(sourceFile);
	}
	
	public Mono<Repository> updateRepoName(String idRepository, String newRepoName) {
		return repositoryRepository.findById(idRepository)
				.flatMap(r -> {
					r.setRepositoryName(newRepoName);
					return repositoryRepository.save(r);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("Repository not found"))));
		
	}
	
	public Mono<FileEntity> updateFileName(String idFile, String newFileName) {
		return fileRepository.findById(idFile)
				.flatMap(f -> {
					f.setOriginalName(newFileName);
					return fileRepository.save(f);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("File not found"))));
	}
	
	public Mono<Repository> updateRepoVisibility(String idRepository, Boolean newRepoVisibility) {
		return repositoryRepository.findById(idRepository)
				.flatMap(r -> {
					r.setPublicR(newRepoVisibility);
					return repositoryRepository.save(r);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("Repository not found"))));
		
	}
	
	public Mono<Folder> updateFolderName(String idFolder, String newFileName) {
		return folderRepository.findById(idFolder)
				.flatMap(f -> {
					f.setFolderName(newFileName);
					return folderRepository.save(f);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("File not found"))));
	}

}
 






























































































































































































































































































