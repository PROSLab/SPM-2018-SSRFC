package com.spm.api.utils;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

public class FileLib {
	
	// Recursive blocking-code delete files and folders
	public static void deleteFolder(File folder) {
		File[] files = folder.listFiles();
	    if(files != null) { //some JVMs return null for empty dirs
	        for(File f: files) {
	            if(f.isDirectory()) {
	                deleteFolder(f);
	            } else {
	                f.delete();
	            }
	        }
	    }
	    folder.delete();
	}
	
	// TEST: non-blocking delete files and folders
	public static void testAsyncDeleteFolder(File folder) {
		List<File> files = Arrays.asList(folder.listFiles());
		
		Flux.fromIterable(files)
			.expand(f -> { // delete files
				if(!f.isDirectory()) {
					Mono.fromCallable(() -> f.delete())
						.subscribeOn(Schedulers.elastic())
						.onErrorResume(IOException.class, Mono::error);
					
					
					return Mono.empty();
				}
				else return Mono.just(f);
			})
			.flatMap(d -> { // then delete folders
				if(d.isDirectory()) {
					Mono.fromCallable(() -> d.delete())
						.subscribeOn(Schedulers.elastic())
						.onErrorResume(IOException.class, Mono::error);
				} 
				
				return Mono.empty();
			});
	}
	
}
