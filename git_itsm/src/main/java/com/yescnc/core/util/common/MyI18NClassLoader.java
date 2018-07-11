package com.yescnc.core.util.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

public class MyI18NClassLoader extends ClassLoader {

	private String prefix = System.getProperty("nms.home") + "/web/base/data/properties/";

	private ClassLoader cl;

	public MyI18NClassLoader(ClassLoader cl) {
		this.cl = cl;
	}

	@Override
	public InputStream getResourceAsStream(String name) {
		File file = new File(prefix + name);
		try {
			return new BufferedInputStream(new FileInputStream(file));
		} catch (FileNotFoundException e) {
			// ignore
		}
		return cl.getResourceAsStream(name);
	}
}
