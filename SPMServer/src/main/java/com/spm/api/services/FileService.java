package com.spm.api.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Optional;
import java.util.Vector;

import org.apache.commons.io.FileUtils;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.entity.Folder;
import com.spm.api.repository.FileRepository;

import com.spm.api.repository.FolderRepository;
import com.spm.api.repository.RepositoryRepository;
import com.spm.api.utils.FileLib;
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
	 * uploadFile creazione path
	 * 
	 */
	public Mono<FileEntity> uploadFilePath(String rootDir, String idUser, String idRepository, String idFolder, String fileName, String idFile, String mimetype, FilePart filePart, FileEntity fileEntity) {
		String suffixPath = idFolder != null ? File.separator + idFolder + 
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
		
		filePart.transferTo( new File(strPath) );
		
		return Mono.just(fileEntity);
	}
	
	public Mono<String> pathForReplaceFile(String rootDir, String idUser, String idRepository, String idFolder, String fileName, String idFile, String mimetype, FilePart filePart) {
		String suffixPath = idFolder != null ? File.separator + idFolder + 
		          							   File.separator + idFile +
      							               File.separator + fileName + "." + mimetype
											 : File.separator + idFile +
											   File.separator + fileName + "." + mimetype;
		
		String strPath = rootDir + File.separator + idUser + File.separator + idRepository + suffixPath;
		
		/*Path path = Paths.get(strPath);
		
		try {
			Files.createDirectories(path.getParent());
		} catch (IOException e) {
			e.printStackTrace();
			return Mono.error(new Exception(e.getMessage()));
		}*/
		
		filePart.transferTo( new File(strPath) );
		
		return Mono.just("OK");
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
	public Flux<Repository> getAllPublicRepo(Boolean publicR) {
		 return repositoryRepository.findAllRepoBypublicR(publicR);
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
	public Flux <FileEntity> getAllFile(ObjectId idFolder,ObjectId idRepository) {
		return fileRepository.findFileByIdFolderAndIdRepository(idFolder,idRepository);
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
		String prefix = rootDir 
				+ File.separator + sourceFile.getIdUser().toHexString()
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
		
		File source = new File(sourcePath);
		File dest = new File(destinationPath);
		
		if(!source.exists()) {
			try {
				Files.createFile( Paths.get(destinationPath) );
			} catch (IOException e) {
				e.printStackTrace();
				return Mono.error( new Exception(e.getMessage()) );
			}
		}
		else {
			try {
				Files.copy(source.toPath(), dest.toPath());
			} catch (IOException e) {
				e.printStackTrace();
				return Mono.error( new Exception(e.getMessage()) );
			}
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
	/*
	 * Get a specific File
	 */
	public Mono<FileEntity> getFileSpec (ObjectId idFile) {
		return fileRepository.findFileById(idFile);
	}
	
	/*public Mono<File> createFileObjRepositoryPath(String rootDir, String idUser, String idRepository) {
		File file = new File(rootDir + File.separator + idUser + File.separator + idRepository);
		return Mono.just(file);
	}*/
	
	public Mono<Boolean> deleteFileVersion (FileEntity sourceFile, String rootDir, String mimetype, String version) {
		String prefix = rootDir 
				+ File.separator + sourceFile.getIdUser().toHexString() 
				+ File.separator + sourceFile.getIdRepository().toHexString();
		
		if(sourceFile.getIdFolder() != null) prefix += File.separator + sourceFile.getIdFolder().toHexString();
		
		String suffix = File.separator + sourceFile.getId() 
				+ File.separator + sourceFile.getId() + "." + version + "." + mimetype;
		
		File file = new File(prefix + suffix);
		
		if(FileLib.deleteFile(file)) {
			return Mono.just(true);
		}
		
		return Mono.error(new Exception("Can not delete file"));		
				
	}
	
	public Mono<FileEntity> updateDeletedVersionsArray(String idFile, String version) {
		return fileRepository.findById(idFile)
				.flatMap(f -> {
					if(Integer.parseInt(version) > f.getcVersion()) {
						return Mono.error(new BadRequestException("Version does not exist"));
					}
					
					Vector<Integer> vec = f.getDeletedVersions();
					
					if(vec != null) {
						if(vec.indexOf( Integer.parseInt(version) ) != -1)
							return Mono.error(new BadRequestException("File version already deleted"));
						else
							return Mono.just(f);
					}
					
					return Mono.just(f);
					
				})
				.flatMap(f -> {
					Vector<Integer> vec = f.getDeletedVersions() == null ? new Vector<Integer>() : f.getDeletedVersions();
					vec.add( Integer.parseInt(version) );
					Collections.sort(vec);
					f.setDeletedVersions(vec);
					
					return fileRepository.save(f);
					
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("File not found"))));
	}
	
	public String getFilePath(String version, String mimetype, FileEntity file) {
		String pathStr = file.getPath();
		pathStr += File.separator + file.getId() + "." + version + "." + mimetype;
		return pathStr;
	}
	
	public Mono<String> getFilePath(String version, String mimetype, String idFile){
		return fileRepository.findById(idFile)
				.flatMap(f -> {
					String pathStr = f.getPath();
					pathStr += File.separator + idFile + "." + version + "." + mimetype;
					
					return Mono.just(pathStr);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("File not found"))));
	}
	
	public Mono<String> updateMoveTo (String rootDir, String idUser, String idRepository,Optional <String> idFolder, String fileName, String idFile, String mimetype, Path paths) {
		String suffixPath = idFolder.isPresent() != false  ? File.separator + idFolder.get() + 
	               File.separator + idFile
				 : File.separator + idFile ;
				  

String strPath = rootDir + File.separator + idUser + File.separator + idRepository + suffixPath;

Path path = Paths.get(strPath);

try {
    Path sourc = paths;
    Path dest = path;
    Files.move(sourc, dest);
} catch (IOException e) {
	e.printStackTrace();
	return Mono.error(new Exception(e.getMessage()));
   
}
return Mono.just(strPath);
		

		
	}
	

	public Mono<FileEntity> updatePathFile(ObjectId idFile ,ObjectId idRepository,ObjectId idUser,Optional <String> idFolder, String newPath) {
		return fileRepository.findFileById(idFile)
				.flatMap(f -> {
					/*String foldergiusto = idFolder.isPresent() != false  ? foldergiusto=idFolder.get():null;*/
					String fold = null; 
					if(idFolder.isPresent()) {
						fold = idFolder.get();
					}
					f.setPath(newPath);
					f.setIdFolder(new ObjectId(fold));
					f.setIdUser(idUser);
					f.setIdRepository(idRepository);
					return fileRepository.save(f);
				})
				.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("File not found"))));
	}
	
	
	public Mono<FileEntity> searchFile(String idFile) {
		return fileRepository.findById(idFile);
				
	}
	
	/*public Mono<FileEntity> pathForReplaceFile(String rootDir, String idUser, String idRepository, String idFolder, String fileName, String idFile, String mimetype, FilePart filePart, FileEntity fileEntity) {
		String suffixPath = idFolder != null ? File.separator + idFolder + 
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
		
		filePart.transferTo( new File(strPath) );
		
		return Mono.just(fileEntity);
	}*/
	
	public Mono<FileEntity>  deleteFile(String idFile) {
	/*	return fileRepository.deleteById(new ObjectId(idFile));*/
		return fileRepository.deleteById(new ObjectId(idFile));
				
				
		}
		
	
public Mono<Boolean> deleteFileSistem( String idUser,String idRepository,String idFile,Optional <String> idFolder, String rootDir ) {
	String prefix = rootDir 
			+ File.separator + idUser
			+ File.separator + idRepository;
	
	if(idFolder.isPresent() != false) prefix += File.separator +idFolder.get();
	
	String suffix = File.separator + idFile; 
	File file = new File(prefix + suffix);
	try {
		FileUtils.cleanDirectory(file); ;
	} catch (IOException e) {
		e.printStackTrace();
		return Mono.error(new Exception(e.getMessage()));
	}
	
	
	if(FileLib.deleteFile(file)) {
		return Mono.just(true);
	}
	
	return Mono.error(new Exception("Can not delete file"));		
		
}

public Mono<FileEntity> updateValidity(String idFile, String soundness,String safeness,Boolean validity) {
	return fileRepository.findById(idFile)
			.flatMap(r -> {
				r.setSoundness(soundness);
				r.setSafeness(safeness);
				r.setValidity(validity);
				return fileRepository.save(r);
			})
			.switchIfEmpty(Mono.defer(() -> Mono.error(new Exception("f not found"))));
	
}
	
}

 













