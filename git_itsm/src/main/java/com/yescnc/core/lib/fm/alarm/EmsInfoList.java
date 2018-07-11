package com.yescnc.core.lib.fm.alarm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Properties;
import java.util.Vector;

import org.springframework.context.ApplicationContext;

import com.yescnc.core.util.common.ConfigUtil;
import com.yescnc.core.util.common.LogUtil;


/**
 */
public class EmsInfoList {
	private final static String MS_ID_MYSELF_PROPERTIES = System.getProperty("nms.home")
			+ "/resource/properties/ms_id.properties";
	private final static String DEBUG = "[EmsInfoList] ";

	private static String m_mcAlias = "MC";
	private static String m_mcIp = "";

	//private static ArrayList<CmVLevel1> m_msList = null;
	private static Vector<String> m_msAliasList = new Vector<String>();
	private static Vector<String> m_msIpList = new Vector<String>();
	private static Vector<String> m_msConnStateList = new Vector<String>();
	private static Vector<String> m_msLevel1List = new Vector<String>();

	private static boolean m_isMCMS = false;

	private static Vector<HashMap<String, Object>> m_serverList = new Vector<HashMap<String, Object>>();
	private static Vector<HashMap<String, Object>> m_mcmsList = new Vector<HashMap<String, Object>>();

	private static EmsInfoList m_emsInfoList = null;

	private EmsInfoList() {

	}

	public synchronized static EmsInfoList getInstance() {

		if (m_emsInfoList == null) {
			m_emsInfoList = new EmsInfoList();
		}

		load();

		return m_emsInfoList;
	}

	public synchronized static void load() {

		LogUtil.info(DEBUG + " load");

		m_msAliasList.removeAllElements();
		m_msIpList.removeAllElements();
		m_msConnStateList.removeAllElements();
		m_msLevel1List.removeAllElements();
		m_serverList.removeAllElements();

		m_mcmsList.removeAllElements();

		loadMc();
		//loadMs();

		int mapNo = 0;

		if (!m_isMCMS) { // run only separated mc, ms

			// MC map
			HashMap mcMap = new HashMap<String, Object>();
			mcMap.put("NO", mapNo);
			mcMap.put("EMS", m_mcAlias);
			mcMap.put("IP", m_mcIp);
			m_serverList.add(0, mcMap);
			m_mcmsList.add(0, mcMap);

			mapNo++;
		}

		// MS map
		for (int i = 0; i < m_msAliasList.size(); i++) {
			HashMap msMap = new HashMap<String, Object>();
			msMap.put("NO", mapNo);
			msMap.put("EMS", m_msAliasList.get(i));
			msMap.put("IP", m_msIpList.get(i));
			msMap.put("LEVEL1_ID", m_msLevel1List.get(i));
			m_serverList.add(msMap);
			m_mcmsList.add(msMap);

			mapNo++;
		}

		LogUtil.info(DEBUG + "Total Server List No. : " + mapNo + ", Total Server List : " + m_serverList);
	}

	private static void loadMc() {

		LogUtil.info(DEBUG + " loadMc() ::  mcIp : " + m_mcIp);

		if (m_mcIp != null) {
			if (m_mcIp.equals("")) {
				String nms_home = System.getProperty("nms.home");
				String mcFile = nms_home + "/resource/properties/mc.properties";
				Properties properties = ConfigUtil.loadProperty(mcFile);
				m_mcIp = properties.getProperty("host");
			}
		}

		//m_mcAlias = HostInfo.getHostName();
	}
/*
	private static void loadMs() {
		LogUtil.info(DEBUG + " loadMs()");

		ApplicationContext context = ApplicationContextUtil.getContext();
		CmVLevel1DaoImpl cmVLevel1DaoImpl = (CmVLevel1DaoImpl) context.getBean("cmVLevel1DaoImpl");
		m_msList = cmVLevel1DaoImpl.getAllCmLevel1();

	}
	
	public static ArrayList<CmVLevel1> getMs() { 

		if (m_msList == null)
			loadMs() ;
		return m_msList ;
	}

	public synchronized Vector<HashMap<String, Object>> getMsList() {
		return (Vector<HashMap<String, Object>>) m_msList.clone();
	}
*/
	public synchronized Vector getMsIpList() {
		return (Vector) m_msIpList.clone();
	}

	public synchronized Vector getMsConnStateList() {
		return (Vector) m_msConnStateList.clone();
	}

	public synchronized Vector getMsLevel1List() {
		return (Vector) m_msLevel1List.clone();
	}

	public synchronized Vector<HashMap<String, Object>> getServerList() {
		return (Vector<HashMap<String, Object>>) m_serverList.clone();
	}

	public synchronized Vector<HashMap<String, Object>> getMcMsList() {
		return (Vector<HashMap<String, Object>>) m_mcmsList.clone();
	}

	public static Vector[] getMsInfo() {
		Vector[] result = new Vector[3];
		result[0] = m_msIpList;
		result[1] = m_msConnStateList;
		result[2] = m_msLevel1List;

		return result;
	}

	/**
	 * for static usage. same as getMsIdMyselfPrivate()
	 * 
	 * @return
	 */
	public static int getMsIdMyself() {
//		Properties prop = ConfigUtil.loadProperty(MS_ID_MYSELF_PROPERTIES);
//		String id = prop.getProperty("level1_id");
//		return Integer.parseInt(id);
		return 1;
	}

	/**
	 * for getMsNameMyself() method.(temp) same as getMsIdMyshelf()
	 * 
	 * @return
	 */
	private int getMsIdMyselfPrivate() {
		Properties prop = ConfigUtil.loadProperty(MS_ID_MYSELF_PROPERTIES);
		String id = prop.getProperty("level1_id");
		return Integer.parseInt(id);
	}

	/**
	 * get my own MS name.
	 * 
	 * @return
	 */
	public String getMsNameMyself() {
		int msIdString = getMsIdMyselfPrivate();
		String name = "";

		LogUtil.info(DEBUG + " msIdString : " + msIdString);
		//LogUtil.info(DEBUG + " msList : " + m_msList);
/*
		for (CmVLevel1 cm_level1 : m_msList) {
			if (cm_level1.getLevel1_id() == msIdString)
				return cm_level1.getEms_alias();
		}
		*/
		LogUtil.info(DEBUG + " Cannot find ems_alias for level1_id " + msIdString);
		return "N/A";
	}

	public static void setMcIp(String mcIp2) {
		if (mcIp2 == null) {
			mcIp2 = "";
		}
		m_mcIp = mcIp2;
	}

	public String getMcIp() {
		return m_mcIp;
	}

	public static void setIsMCMS(Boolean isMCMS2) {
		if (isMCMS2 == null) {
			isMCMS2 = false;
		}
		m_isMCMS = isMCMS2.booleanValue();
	}

	public boolean getIsMCMS() {
		return m_isMCMS;
	}

}
