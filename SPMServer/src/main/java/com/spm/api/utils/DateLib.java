package com.spm.api.utils;

import java.util.Calendar;
import java.util.Date;

public class DateLib {
	
	public static Date tomorrow() {
		Date today = new Date();
		Calendar c = Calendar.getInstance();
		c.setTime(today);
		c.add(Calendar.DATE, 1);
		today = c.getTime();
		return today;
	}
	
	public static boolean isAfterToday(Date date) {
		Date today = new Date();
		return date.after(today);
	}
}
