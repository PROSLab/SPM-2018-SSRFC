package com.spm.api.handlers;

import java.io.File;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Vector;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FormFieldPart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import com.spm.api.entity.FileEntity;
import com.spm.api.entity.Repository;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.entity.Folder;
import com.spm.api.services.FileService;
import com.spm.api.utils.FileLib;
import com.spm.api.utils.Responses;
import java.nio.file.Path;
import java.nio.file.Paths;

import reactor.core.publisher.Mono;

@Component
public class FileHandler {
	
	private FileService fileService;
	
	@Value("${upload.rootDir}")
    private String rootDir;
	private String fileName;
	private String idFile;
	private Map<String, Part> map;
	
	public FileHandler(FileService fileService) {
		this.fileService = fileService;
	}
	
	public Mono<ServerResponse> uploadFile(ServerRequest request) {// just a test for files upload
		return request.body(BodyExtractors.toMultipartData())

                .flatMap(parts -> {

                    map = parts.toSingleValueMap();
                    FormFieldPart idUser = (FormFieldPart)map.get("idUser");
                    FormFieldPart idRepository = (FormFieldPart)map.get("idRepository");
                    FormFieldPart autore = (FormFieldPart)map.get("autore");

                    FormFieldPart fileType = (FormFieldPart)map.get("fileType");
                    FilePart filePart = (FilePart) map.get("files");

                    String idFolder = null;
                    
                    if(map.get("idFolder") != null) {
                    	FormFieldPart idFolderPart = (FormFieldPart)map.get("idFolder");
                    	idFolder = idFolderPart.value();
                    }                   
                    String [] splitarray=  filePart.filename().split(".bpmn");
                    String originalName = splitarray[0];
                    String mimetype = "bpmn";
                    
                    
                    
                    FileEntity file = new FileEntity (
            				new ObjectId( idUser.value() ),
            				new ObjectId( idRepository.value() ),
            				idFolder != null ? new ObjectId(idFolder) : null,
            				new Date(),
            				null, // id of file . varsion
            				originalName,
            				mimetype,
            				null,
            				1,
            				new Vector<Integer>(),
            				autore.value(),
            				null,
            				null,
            				null,
            				fileType.value()
 
            				
            		);
                    
                    return fileService.createFileSchema(file);
                })
                .flatMap(f -> {
                	idFile = f.getId();
					fileName = idFile + '.' + 1;
                    FilePart filePart = (FilePart) map.get("files");
                    FormFieldPart idUser = (FormFieldPart)map.get("idUser");
                    FormFieldPart idRepository = (FormFieldPart)map.get("idRepository");
                    String mimetype = "bpmn";

                    String idFolder = null;
                    
                    if(map.get("idFolder") != null) {
                    	FormFieldPart idFolderPart = (FormFieldPart)map.get("idFolder");
                    	idFolder = idFolderPart.value();
                    }  
					return fileService.uploadFilePath(rootDir, idUser.value(), idRepository.value(), idFolder, fileName, idFile, mimetype,filePart,f);

					/*
					 * TODO
					 * Fare nel service: (l'upload può essere o a livello di repo o di folder. Ricorda la "cartella nascosta").
					 * -- filePart.transferTo( new File(rootDir + "/" + filePart.filename()) ); --
					 * Aggiornare path e filename db.
					 * 
					 * ISSUE
					 * - l'upload di un file può essere considerato come nuova versione di un file esistente? NO!
					 */
					
					
                })
                .flatMap(f -> {
                	FormFieldPart idUser = (FormFieldPart)map.get("idUser");
                	FormFieldPart idRepository = (FormFieldPart)map.get("idRepository");
                	String path = rootDir + "/" + idUser.value() + "/" + idRepository.value();
                	String idFolder = null;
	                    
	                if(map.get("idFolder") != null) {
	                	FormFieldPart idFolderPart = (FormFieldPart)map.get("idFolder");
	                	idFolder = idFolderPart.value();
	                	path += "/" + idFolder;
	                }  
					
					
	                path += "/" + idFile;
					
					return fileService.updateNames(fileName, path, f);
					
				})
                .flatMap(res -> Responses.ok(res))
           				.onErrorResume(Exception.class, Responses::internalServerError);

                
    }
	
	public Mono<ServerResponse> downloadFile(ServerRequest request){
		
		String idFile = request.queryParam("idFile").get();
		String version = request.queryParam("version").get();
		String mimetype = "bpmn";
		
		// Return the file with fileSystem name
		/*return fileService.getFilePath(idFile, version, mimetype)
				.flatMap(res -> {
					File file = new File(res);
					Resource resource = new FileSystemResource(res);
					
					return Responses.okFile(resource, file);
				})
				.onErrorResume(Exception.class, Responses::badRequest);*/
		
		// Other solution for return the file with original name
		return fileService.getFileSpec(new ObjectId(idFile))
				.flatMap(f -> {
					String path = fileService.getFilePath(version, mimetype, f);
					Resource resource = new FileSystemResource(path);
					File file = new File(path);
					
					return Responses.okFile(resource, file, f);
				});
	}
	
	public Mono<ServerResponse> exportCollection(ServerRequest request){
			
		/* Prendere id del file per ricavare originalName e path della hidden folder,
		 * fare lo zip del contenuto della hidden folder e rinominarla con l'originalName + ".zip",
		 * poi download .zip*/
		
		String idFile = request.queryParam("idFile").get();
		return fileService.getFileSpec(new ObjectId(idFile))
				.flatMap(f -> {
					String originalName = f.getOriginalName();
					String dirPath = f.getPath();
					
					FileLib.zipDirectory(originalName, dirPath, idFile);
					
					String zipPath = "TMPZips" + File.separator + idFile + ".zip";
					Resource resource = new FileSystemResource(zipPath);
					File file = new File(zipPath);
					
					return Responses.okZip(resource, file, f);
				})
				.onErrorResume(Exception.class, Responses::internalServerError);
		
	}
		
	
	
	public Mono<ServerResponse> createRepository(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		Boolean publicR = request.queryParam("publicR").get().equals("true") ? true : false;
		String repositoryName = request.queryParam("repositoryName").get();
		String autore= request.queryParam("autore").get();
		
		Repository repo = new Repository(new ObjectId(idUser), new Date(), publicR, repositoryName,autore);
		
		return fileService.createRepositorySchema(repo) // create Repository Schema on DB
				.flatMap(repository -> fileService.createRepositoryPath(rootDir, repository.getIdUser().toHexString() , repository.getId()))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
	}
	
	public Mono<ServerResponse> createFile(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository= request.queryParam("idRepository").get();
		Optional<String> idFolder= request.queryParam("idFolder");
		String originalName = request.queryParam("originalName").get();
		String mimetype = "bpmn";
		String autore = request.queryParam("autore").get();
		String fileType = request.queryParam("fileType").get();

		
		FileEntity file = new FileEntity (
				new ObjectId(idUser),
				new ObjectId(idRepository),
				idFolder.isPresent() == true ? new ObjectId(idFolder.get()) : null,
				new Date(),
				null,
				originalName,
				mimetype,
				null,
				1,
				new Vector<Integer>(),
				autore,
				null,
				null,
				null,
				fileType
		);
		
		return fileService.createFileSchema(file)
				.flatMap(f -> {
					idFile = f.getId();
					fileName = idFile + '.' + 1;
					return fileService.uploadPath(rootDir, idUser, idRepository, idFolder, fileName, idFile, mimetype);
				})
				.flatMap(notUsed -> {
					String path = rootDir + "/" + idUser + "/" + idRepository;
					
					if(idFolder.isPresent() == true) {
						path += "/" + idFolder.get();
					}
					
					path += "/" + idFile;
					
					return fileService.updateNames(fileName, path, file);
					
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
		
	}
	
	public Mono <ServerResponse> getAllRepo(ServerRequest request){
		String idUser = request.queryParam("idUser").get();
		return fileService.getAll(new ObjectId(idUser))
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	
	public Mono <ServerResponse> getRepoSpec(ServerRequest request){
		String idRepo = request.queryParam("id").get();
		return fileService.getRepoSpec(new ObjectId(idRepo))
				.flatMap(res -> Responses.ok(res));
	}
	
	public Mono <ServerResponse> getFolderSpec(ServerRequest request){
		String idFold = request.queryParam("id").get();
		return fileService.getFolderSpec(new ObjectId(idFold))
				.flatMap(res -> Responses.ok(res));
	}
	
	public Mono <ServerResponse> getAllFile(ServerRequest request){

		Optional<String> idFolder= request.queryParam("idFolder");
		String idRepository= request.queryParam("idRepository").get();
		return fileService.getAllFile(idFolder.isPresent() == true ? new ObjectId(idFolder.get()) : null,new ObjectId(idRepository))				
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	
	public Mono <ServerResponse> getAllFolders(ServerRequest request){
		String idRepository = request.queryParam("idRepository").get();
		return fileService.getAllFolders(new ObjectId(idRepository))
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	
	public Mono<ServerResponse> createFolder(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository=request.queryParam("idRepository").get();
		String folderName= request.queryParam("folderName").get();
		String autore = request.queryParam("autore").get();
		Folder fold = new Folder (new ObjectId(idUser),new ObjectId(idRepository),new Date(),folderName,null,autore);
		
		
		return fileService.createFolderSchema(fold)
				.flatMap(folder -> fileService.createFolderPath(rootDir,folder.getIdUser().toHexString(),folder.getIdRepository().toHexString(),folder.getId()))
						
				.flatMap(notUsed ->{
					
					String path=  rootDir + "/" + idUser + "/" + idRepository + "/"+ fold.getId();
					return fileService.updatepath(path, fold);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);
		/*
		 * 
		String idUser = request.queryParam("idUser").get();
		Boolean publicR = request.queryParam("publicR").get().equals("true") ? true : false;
		String repositoryName = request.queryParam("repositoryName").get();
		
		Repository repo = new Repository(new ObjectId(idUser), new Date(), publicR, repositoryName);
		
		return fileService.createRepositorySchema(repo) // create Repository Schema on DB
				.flatMap(repository -> fileService.createRepositoryPath(rootDir, repository.getIdUser().toHexString() , repository.getId()))
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError);*/
	}
	
	/*
	 * Params: idFile, version
	 * */
	public Mono<ServerResponse> createNewVersion(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String version = request.queryParam("version").get();
		String mimetype = "bpmn";
		
		return fileService.updateFileEntity(version, idFile)
				.flatMap(f -> {
					return fileService.cloneFileVersion(f, version, mimetype, rootDir);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(Exception.class, Responses::internalServerError)
				.onErrorResume(BadRequestException.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyRepoName(ServerRequest request) {
		String idRepository = request.queryParam("idRepository").get();
		String newRepoName = request.queryParam("newRepoName").get();
		
		return fileService.updateRepoName(idRepository, newRepoName)
				.flatMap(repo -> Responses.ok(repo))
				.onErrorResume(Exception.class, Responses::badRequest);
	}

	public Mono<ServerResponse> modifyFileName(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String newFileName = request.queryParam("newFileName").get();
		
		return fileService.updateFileName(idFile, newFileName)
				.flatMap(file -> Responses.ok(file))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyRepoVisibility(ServerRequest request) {
		String idRepository = request.queryParam("idRepository").get();
		Boolean newRepoVisibility = request.queryParam("newRepoVisibility").get().equals("true") ? true : false;
		
		return fileService.updateRepoVisibility(idRepository, newRepoVisibility)
				.flatMap(repo -> Responses.ok(repo))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyFolderName(ServerRequest request) {
		String idFolder = request.queryParam("idFolder").get();
		String newFileName = request.queryParam("newFolderName").get();
		
		return fileService.updateFolderName(idFolder, newFileName)
				.flatMap(file -> Responses.ok(file))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono <ServerResponse> getFileSpec(ServerRequest request){
		String idFile = request.queryParam("id").get();
		return fileService.getFileSpec(new ObjectId(idFile))
				.flatMap(res -> Responses.ok(res));
	}
	

	public Mono <ServerResponse> getAllRepoPublic(ServerRequest request){
		Boolean publicR = true;
		return fileService.getAllPublicRepo(publicR)
				.collectList()
				.flatMap(res -> Responses.ok(res));
				
	}
	public Mono <ServerResponse> deleteVersion(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String version = request.queryParam("version").get();
		String mimetype = "bpmn";
		
		return fileService.updateDeletedVersionsArray(idFile, version)
				.flatMap(f -> {
					return fileService.deleteFileVersion(f, rootDir, mimetype, version);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(BadRequestException.class, Responses::badRequest)
				.onErrorResume(Exception.class, Responses::internalServerError);

	}
	public Mono<ServerResponse> moveFile(ServerRequest request) {
		String idUser = request.queryParam("idUser").get();
		String idRepository= request.queryParam("idRepository").get();
		String idFile = request.queryParam("idFile").get();
		String mimetype = "bpmn";
		String paths= request.queryParam("paths").get();
        Path path=  Paths.get(paths);
		fileName = idFile + '.' + 1;
		 Optional <String> idFolder= request.queryParam("idFolder");
         
        
		return fileService.updateMoveTo(rootDir, idUser, idRepository, idFolder, fileName, idFile, mimetype, path)
				
				.flatMap(str -> {
					
					
			return fileService.updatePathFile(new ObjectId(idFile),new ObjectId(idRepository), new ObjectId(idUser) ,idFolder,str);
				})
				.flatMap(res -> Responses.ok(res))
				
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	public Mono<ServerResponse> modifyBodyFile(ServerRequest request) {// just a test for files upload
		return request.body(BodyExtractors.toMultipartData())
                .flatMap(parts -> {
                    map = parts.toSingleValueMap();
                    
                    // PARAMETRI PASSARE ALL'API: idUser, idRepository, idFolder, idFile, version, files
                    
                    // idUser
                    FormFieldPart idUser = (FormFieldPart)map.get("idUser");                 
                    // idRepository
                    FormFieldPart idRepository = (FormFieldPart)map.get("idRepository");                
                    // idFolder
                    String idFolder = null;
                    if(map.get("idFolder") != null) {
                    	FormFieldPart idFolderPart = (FormFieldPart)map.get("idFolder");
                    	idFolder = idFolderPart.value();
                    }                 
                    // idFile
                    FormFieldPart idFile = (FormFieldPart)map.get("idFile");                 
                    // version
                    FormFieldPart version = (FormFieldPart)map.get("version");  
                    //originalName
                   /* FormFieldPart originalName = (FormFieldPart)map.get("originalName");     */        

                    // files
                    FilePart filePart = (FilePart) map.get("files"); 
                    
                    String mimetype = "bpmn";
                    fileName = idFile.value() + '.' + version.value();
 
                    // Overloading di uploadFilePath
                    return fileService.pathForReplaceFile(rootDir, idUser.value(), idRepository.value(), idFolder, fileName, idFile.value(), mimetype, filePart);
                    
                })
                .flatMap(res -> Responses.ok(res));
				//.onErrorResume(Exception.class, Responses::internalServerError);
    }
	
	public Mono <ServerResponse> deleteFile(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String idRepository = request.queryParam("idRepository").get();
		String idUser = request.queryParam("idUser").get();
		Optional <String> idFolder = request.queryParam("idFolder");
         
                   
		
		return fileService.deleteFileSistem(idUser,idRepository,idFile,idFolder, rootDir)
		
				.flatMap(f -> {
					return fileService.deleteFile(idFile);
				})
				.flatMap(res -> Responses.ok(res))
				.onErrorResume(BadRequestException.class, Responses::badRequest)
				.onErrorResume(Exception.class, Responses::internalServerError);

	}
	
	public Mono<ServerResponse> addValidity(ServerRequest request) {
		String idFile = request.queryParam("idFile").get();
		String soundness = request.queryParam("soundness").get();;
		String safeness = request.queryParam("safeness").get();
		Boolean validity = request.queryParam("validity").get().equals("true") ? true : false;
		return fileService.updateValidity(idFile, soundness,safeness,validity)
				.flatMap(repo -> Responses.ok(repo))
				.onErrorResume(Exception.class, Responses::badRequest);
	}
	
	
	
}
	
	
















