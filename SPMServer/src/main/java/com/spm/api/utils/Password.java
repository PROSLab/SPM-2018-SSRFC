package com.spm.api.utils;

import org.springframework.security.crypto.bcrypt.BCrypt;

public class Password {
	
	public static String hashPassword(String plainPassword) {
		String pwHash = BCrypt.hashpw(plainPassword, BCrypt.gensalt());
		return pwHash;
	}
	
	public static boolean checkPassword(String plainPassword, String storedHashPassword) {
		if (BCrypt.checkpw(plainPassword, storedHashPassword))
			return true;
		
		return false;
	}

}
