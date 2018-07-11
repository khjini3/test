package com.yescnc.core.lib.fm.healling;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import com.yescnc.core.util.common.MyI18N;

public class HealingUtil {

	public static void createParentDir(String file) throws Exception {
		createParentDir(new File(file));
	}
	
	public static void createParentDir(File file) throws Exception {
		File destFile = (file).getAbsoluteFile();
		File path = new File(destFile.getParent());
		
		try {
			path.mkdirs();
		} catch (SecurityException e) {
			throw new Exception("Couldn't make the file:"+file.getName());
		}
	}
	
	/**
	 * �ش� ���� �Ǵ� ���丮�� �ִ��� Ȯ���Ѵ�. Ȯ���Ѵ�.
	 * 
	 * @param filePath
	 * @return
	 */
	public static boolean isFileExists(String filePath) {
		File file = new File(filePath);
		return file.exists();
	}

	/**
	 * JDOM����  Document��  �о���δ�. (add by moggnik.ko -090824)
	 * 
	 * @param xmlFile
	 * @return Document xml doc
	 * @throws JDOMException
	 * @throws IOException
	 */
	public static Document loadXmlDoc(String xmlFile) throws JDOMException,
		IOException {
		Document doc;
		SAXBuilder builder = new SAXBuilder(false);
		if (xmlFile.startsWith("http") || xmlFile.startsWith("file:")) {
			doc = builder.build(new URL(xmlFile));
		} else {
			doc = builder.build(new File(xmlFile));
		}
		return doc;
	}
	
	public static String getDate(){
		String curDate = "";
		Date now = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		curDate = sdf.format(now); 		
		return curDate;
	}
	

	public static String getFmResources(String key) {
		return MyI18N.getString("project/fm-resources", key);
	}
	

	/**
	 * Full DN �� �޾Ƽ� Level3 ID�� ��ȯ ��
	 * @param fullDn Full DN. 1.1.1 format
	 * @return level3 id
	 */
	public static String getLevel3Id(String fullDn) {
		String level3Id = "";
		if (fullDn == null || "".equals(fullDn)) return level3Id;
		String[] tmp = fullDn.split("\\.");
		if (tmp.length == 3) level3Id = tmp[2];
		else level3Id = fullDn;
		return level3Id;
	}
	
	public static String getGroupId(String fullDn) {
		String groupId = "";
		if (fullDn == null || "".equals(fullDn)) return groupId;
		String[] tmp = fullDn.split("\\.");
		if (tmp.length >= 2) groupId = tmp[1];
		else groupId = fullDn;
		return groupId;
	}
	
	public static String getGroupAlias(String fullAlias) {
		String groupAlias = "";
		if (fullAlias == null || "".equals(fullAlias)) return groupAlias;
		String[] tmp = fullAlias.split("/");
		if (tmp.length == 3) groupAlias = tmp[1];
		else groupAlias = fullAlias;
		return groupAlias;
	}
	
	public static String getNeDnAlias(String fullAlias) {
		String groupAlias = "";
		if (fullAlias == null || "".equals(fullAlias)) return groupAlias;
		String[] tmp = fullAlias.split("/");
		if (tmp.length == 3) groupAlias = tmp[2];
		else groupAlias = fullAlias;
		return groupAlias;
	}
	
	public static String getParameterFromCdd(String cddSt) {
		String[] tmp = null;
		if (cddSt.indexOf(":::::") > 0) {
			tmp = cddSt.split(":::::");
		}
		else { 
			tmp = cddSt.split("::::");
		}
		return tmp[tmp.length-1];
	}
}