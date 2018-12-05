package com.spm.api.handlers;

import java.io.File;
import java.util.Map;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.spm.api.utils.Responses;

import reactor.core.publisher.Mono;

@Component
public class FileHandler {
	
	public Mono<ServerResponse> uploadFileTest(ServerRequest request) { // UN HANDLER CHE NON FA NIENTE
		return Responses.ok("OK");
	}
	
	/*public Mono<ServerResponse> uploadFileTest(ServerRequest request) { // NON FUNZIONA
		return request.body(BodyExtractors.toMultipartData())
				.filter(part -> part instanceof FilePart)
				.ofType(FilePart.class)
				.flatMap(filePart -> {
					String filename = filePart.filename();
					File file = new File("assets/" + filename);
					
					if(file.exists()) {
						file.delete();
					}
					else {
						try {
							file.createNewFile();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
					
					try {
					// create an asynchronous file channel to store the file on disk
					AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(file.toPath(), StandardOpenOption.WRITE);
					
					// pointer to the end of file offset
		            AtomicInteger fileWriteOffset = new AtomicInteger(0);
					// error signal
		            AtomicBoolean errorFlag = new AtomicBoolean(false);
		            
		            return filePart.content().doOnEach(dataBufferSignal -> {
		            	if(dataBufferSignal.hasValue() && !errorFlag.get()) {
		            		// read data from the incoming data buffer into a file array
		            		DataBuffer dataBuffer = dataBufferSignal.get();
		            		int count = dataBuffer.readableByteCount();
		            		byte[] bytes = new byte[count];
		            		dataBuffer.read(bytes);
		            		
		            		// create a file channel compatible byte buffer
		            		ByteBuffer byteBuffer = ByteBuffer.allocate(count);
		            		byteBuffer.put(bytes);
		            		byteBuffer.flip();
		            		
		            		// get the current write offset and increment by the buffer size
		            		int filePartOffset = fileWriteOffset.getAndAdd(count);
		            		
		            		fileChannel.write(byteBuffer, filePartOffset, null, new CompletionHandler<Integer, ByteBuffer> () {
		            			@Override
		            			public void completed(Integer result, ByteBuffer attachment) {
		            				// file part successfully written to disk, clean up
		            				byteBuffer.clear();
		            			}
		            			@Override
		            			public void failed(Throwable exc, ByteBuffer attachment) {
		            				errorFlag.set(true);
		            			}
		            		});
		            		
		            	}
		            }).doOnComplete(() -> {
		            	// all done, close the file channel
		            	try {
							fileChannel.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
		            }).doOnError(t -> {
		            	try {
							fileChannel.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
		            }).last().map(dataBuffer ->  {
		            	String res = filePart.filename() + " " + (errorFlag.get() ? "error" : "uploaded");
		            	return Mono.just(res);
		            });
		            
					} catch (IOException e) {
		                // unable to open the file channel, return an error
		                return Mono.error(e);
		            }
					
				}).flatMap(res -> Responses.ok(res));
	}*/

}
