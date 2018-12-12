package com.spm.api.services;

import java.util.Date;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;
import com.spm.api.entity.PasswordChange;
import com.spm.api.entity.User;
import com.spm.api.exceptions.BadRequestException;
import com.spm.api.exceptions.ForbiddenResourceOverrideException;
import com.spm.api.repository.PasswordChangeRepository;
import com.spm.api.repository.UserRepository;
import com.spm.api.utils.DateLib;
import com.spm.api.utils.Password;

import reactor.core.publisher.Mono;

@Component
public class UserService {
	private UserRepository userRepository;
	private PasswordChangeRepository passwordChangeRepository;
	private String uuid;

	public UserService(UserRepository userRepository, PasswordChangeRepository passwordChangeRepository) {
		this.userRepository = userRepository;
		this.passwordChangeRepository = passwordChangeRepository;
	}
	
	public Mono<Boolean> isNewUser(String email) {
		return userRepository.findByEmail(email)
				.flatMap(notUsed -> Mono.just(true))
				.switchIfEmpty(Mono.defer(() -> Mono.just(false)));
	}
	
	public Mono<User> createOne(User user) {	
		return this.isNewUser(user.getEmail())
				.flatMap(res -> {
					if(res == true) { // User exists
						return Mono.error(new ForbiddenResourceOverrideException());
					}
					else { // User not exists
						String hash = Password.hashPassword(user.getPassword());
						user.setPassword(hash);
						return userRepository.save(user); 
					}
				});
	}
	
	public Mono<User> verifyCredentials(String email, String password) {
		return userRepository.findByEmail(email)
				.flatMap(res -> { // User found
					boolean check = Password.checkPassword(password, res.getPassword());
					if(check == true) {
						return Mono.just(res); // return Mono<User> object
					}
					else {
						return Mono.error(new BadRequestException("Invalid password"));
					}
				})
				.switchIfEmpty( // User not found
						Mono.defer(() -> Mono.error(new BadRequestException("User not found")))
				);		
	}

	public Mono<String> createEmailLink(String email) {
		return userRepository.findByEmail(email)
				.flatMap(user -> {
					Date expDate = DateLib.tomorrow(); // expiration date of password recovery flow
					uuid = UUID.randomUUID().toString();
					String uuidHash = Password.hashPassword(uuid);
					Boolean used = false;
					PasswordChange psc = new PasswordChange(user.getId(), expDate, uuidHash, used);
					
					return passwordChangeRepository.save(psc);
				})
				.flatMap(psc -> {
					String url = "http://localhost:4200/NewPassword?uuid="+uuid+"&pgid="+psc.getId();
					return Mono.just(url);
				})
				.switchIfEmpty( // Email not found
						Mono.defer(() -> Mono.error(new BadRequestException("Email not found")))
				);		
	}
	
	public Mono<Boolean> verifyPasswordChange(String pgid, String plainHash) {
		// Verify code hash, expiration date e if code is used
		return passwordChangeRepository.findById(pgid)
				.flatMap(pwc -> {
					Boolean isValidHash = Password.checkPassword(plainHash, pwc.getCodeHash());
					Boolean isExpired = !(DateLib.isAfterToday(pwc.getExpDate()));
					Boolean isUsed = pwc.getUsed();
					
					if(isValidHash == false)
						return Mono.error(new BadRequestException("Hash not valid"));
					
					if(isExpired == true)
						return Mono.error(new BadRequestException("Request expired"));
					
					if(isUsed == true)
						return Mono.error(new BadRequestException("Token already used"));
					
					if(isValidHash == true && isExpired == false && isUsed == false)
						return Mono.just(true);
					else return Mono.just(false);
				})
				.switchIfEmpty( // PasswordChange not found
						Mono.defer(() -> Mono.error(new BadRequestException("PasswordChange not found")))
				);
	}
	
	public Mono<User> updatePassword(String pgid, String newPassword) {
		return passwordChangeRepository.findById(pgid)
				.flatMap(pwc -> { // Update used to true in PasswordChange schema
					pwc.setUsed(true);
					return passwordChangeRepository.save(pwc);
				})
				.flatMap(pwc -> { // Update password in User schema
					String idUser = pwc.getIdUser();
					
					return userRepository.findById(idUser)
					.flatMap(user -> {
						String hash = Password.hashPassword(newPassword);
						user.setPassword(hash);
						return userRepository.save(user);
					})
					.switchIfEmpty( // User not found
							Mono.defer(() -> Mono.error(new BadRequestException("User not found")))
					);	
				})
				.switchIfEmpty( // PasswordChange not found
						Mono.defer(() -> Mono.error(new BadRequestException("PasswordChange not found")))
				);
	}
	
	public Mono<User> getUser(ObjectId id) {
		return userRepository.findUserById(id);
	}
	

}
