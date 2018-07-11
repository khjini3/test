package com.yescnc.core.util.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.List;
import java.util.Properties;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;

public class ConfigUtil {
	public static Element loadXml(String xmlFile) {
		/*
		 * try { org.jdom.input.SAXBuilder builder = new
		 * org.jdom.input.SAXBuilder(false);
		 * 
		 * Document doc = builder.build( new File( xmlFile ) );
		 * 
		 * return doc.getRootElement(); } catch ( Exception ex ) {
		 * System.out.println("can't load " + xmlFile + " file : " +
		 * ex.getMessage() ); return null; }
		 */
		Element root = null;
		try {
			org.jdom.input.SAXBuilder builder = new org.jdom.input.SAXBuilder(false);
			if (xmlFile.startsWith("http")) {
				Document doc = builder.build(new URL(xmlFile + "?rndval=" + System.nanoTime()));
				root = doc.getRootElement();
			} else {
				Document doc = builder.build(new File(xmlFile));
				root = doc.getRootElement();
			}
		} catch (Exception e) {
			System.out.println("can't load " + xmlFile + " file : " );
			//LogUtil.warning(e);
		}

		return root;
	}

	public static void setObjectFromElement(Object info, Element element) {
		List attrs = element.getAttributes();
		Attribute attr = null;
		for (int i = 0; i < attrs.size(); i++) {
			attr = (Attribute) attrs.get(i);
			setValue(info, attr.getName(), attr.getValue());
		}
	}

	public static void setValue(Object obj, String fieldName, Object value) {
		try {

			Class c = obj.getClass();
			Method m = c.getMethod("set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1), new Class[] { value.getClass() });
			m.invoke(obj, new Object[] { value });
		} catch (Exception e) {
			//LogUtil.warning(e);
			//e.printStackTrace();
		}
	}

	public static Object getValue(Object obj, String fieldName) {
		return getValue(obj, "get", fieldName);
	}

	public static Object isValue(Object obj, String fieldName) {
		return getValue(obj, "is", fieldName);
	}

	public static Object getValue(Object obj, String prefix, String fieldName) {
		try {
			Class c = obj.getClass();
			Method m = c.getMethod(prefix + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1), (Class[]) null);
			return m.invoke(obj, (Object[]) null);
		} catch (Exception e) {
			//e.printStackTrace();
			//LogUtil.warning(e);
			return null;
		}
	}

	/**
	 * make a new instance from a specific classname
	 * 
	 * @param className
	 *            class name
	 * @return Object
	 */
	public static Object newInstance(String className) {
		return newInstance(className, null);
	}

	/**
	 * make a new instance from a specific classname and arguments
	 * 
	 * @param className
	 *            class name to create
	 * @param args
	 *            arguments of constructor
	 * @return Object
	 */
	public static Object newInstance(String className, Object[] args) {
		try {
			if (className == null || className.length() == 0)
				return null;

			Class userClass = Class.forName(className);

			if (args == null)
				return userClass.newInstance();
			else {
				Class[] argsClass = new Class[args.length];
				for (int i = 0; i < args.length; i++)
					argsClass[i] = args[i].getClass();

				Constructor cstr = userClass.getDeclaredConstructor(argsClass);
				return cstr.newInstance(args);
			}
		} catch (Exception e) {
			//e.printStackTrace();
			//LogUtil.warning(e);
			return null;
		}
	}

	public static Properties loadProperty(String name) {
		
		//LogUtil.info("[loadProperty] file = " + name);
		
		Properties property = new Properties();
		BufferedInputStream in = null;

		try {
			in = new BufferedInputStream(new FileInputStream(name));
			property.load(in);
		} catch (Exception e) {
			//LogUtil.warning(e);
			//e.printStackTrace();
		} finally {
			if (in != null)
				try {
					in.close();
				} catch (IOException e) {
					//e.printStackTrace();
					//LogUtil.warning(e);
				}
		}

		return property;
	}

	public static Properties loadProperty(String name1, String name2) {
		
		//LogUtil.info("[loadProperty] file1 = " + name1 + "file2 = " + name2 );
		
		Properties property = new Properties();
		InputStream in = null;
		FileInputStream fin1 = null;
		FileInputStream fin2 = null;

		try {
			fin1 = new FileInputStream(name1);
			fin2 = new FileInputStream(name2);
			in = new SequenceInputStream(fin1, fin2);

			property.load(in);
		} catch (Exception e) {
			//e.printStackTrace();
			//LogUtil.warning(e);
		} finally {
			if (fin1 != null){
				try{
					fin1.close();
				}catch(IOException e){
					e.printStackTrace();
				}
			}
			if (fin2 != null){
				try{
					fin2.close();
				}catch(IOException e){
					e.printStackTrace();
				}
			}
			if (in != null){
				try{
					in.close();
				}catch(IOException e){
					e.printStackTrace();
				}
			}
		}

		return property;
	}

	public static boolean saveProperty(Properties property, String name) {
		FileOutputStream out = null;
		boolean result = true;
		try {
			out = new FileOutputStream(name);
			property.store(out, "");
		} catch (Exception e) {
			//LogUtil.warning(e);
			//e.printStackTrace();
			result = false;
		} finally {
			if (out != null)
				try {
					out.close();
				} catch (IOException e) {
					//LogUtil.warning(e);
					//e.printStackTrace();
				}
		}
		return result;
	}

}
