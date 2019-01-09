package com.spm.api.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;


public class FileLib {
	
	// Recursive delete files and folders
	public static void deleteFolder(File folder) {
	    File[] files = folder.listFiles();
	    if(files!=null) { //some JVMs return null for empty dirs
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
	
	// delete file
	public static boolean deleteFile(File file) {
		return file.delete();
	}
	
	// copy directory
	public static void copyDir(String source, String destination) {
		File srcDir = new File(source);
		File destDir = new File(destination);
		
		try {
			FileUtils.copyDirectory(srcDir, destDir);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	// zip folder
	public static void zipDirectory(String originalName, String dirPath, String idFile) {
		 File dir = new File(dirPath);
		 String zipDirName = null;
		 /*TMPZips is the main root for temporary zip archives*/
		 File rootDir = new File("TMPZips");
		 
		 if(!rootDir.exists()) 
			 	rootDir.mkdirs();
	
		 zipDirName = "TMPZips" + File.separator + idFile + ".zip"; 
	     
		 /*List of files path inside directory*/
	     List<String> filesListInDir = new ArrayList<String>();
	     File[] files = dir.listFiles();
	     
	     for(File file : files){
	         filesListInDir.add(file.getAbsolutePath());
	     }
	     
	     try {
	    	 
			FileOutputStream fos = new FileOutputStream(zipDirName);
			ZipOutputStream zos = new ZipOutputStream(fos);
			
			for(String filePath : filesListInDir){
				
				ZipEntry ze = new ZipEntry(filePath.substring(dir.getAbsolutePath().length()+1, filePath.length()));
				zos.putNextEntry(ze);
				FileInputStream fis = new FileInputStream(filePath);
                byte[] buffer = new byte[1024];
                int len;
                while ((len = fis.read(buffer)) > 0) {
                    zos.write(buffer, 0, len);
                }
                zos.closeEntry();
                fis.close();
                
			}
			
			zos.close();
            fos.close();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	} 
	
}
