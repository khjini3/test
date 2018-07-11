package com.yescnc.core.lib.fm.alarm;

import java.util.Properties;

import com.yescnc.core.util.common.ConfigUtil;
import com.yescnc.core.util.common.ServiceUtil;


public class MyServerType {
	
	public static final String SERVER_TYPE = getServerType();

	private static String getServerType()
	{
		String serverType = ServiceUtil.getServerType();
		if( serverType == null )
		{
			return "";
		}
		else
		{
			return serverType;
		}
	}
	public static final String MC_IP = getMcIpAddr();
	public static final int MS_ID = EmsInfoList.getMsIdMyself();
	
	// INTEGRATED SERVER : case of "mc,ms" or "mc,ms,md_..."
	public static final boolean MCMS_INTEGRATED_SERVER = SERVER_TYPE.contains("mc") && SERVER_TYPE.contains("ms");
	
	// STANDALONE SERVER
	public static final boolean MC_STANDALONE_SERVER = SERVER_TYPE.contains("mc") && !SERVER_TYPE.contains("ms");
	public static final boolean MS_STANDALONE_SERVER = SERVER_TYPE.equals("ms");
	
	
	// ROLE
	public static final boolean MC_ROLE = SERVER_TYPE.contains("mc");
	public static final boolean MS_ROLE = SERVER_TYPE.contains("ms");
	
	private static String getMcIpAddr() {
		String mcFile = System.getProperty("nms.home") + "/resource/properties/mc.properties";
		Properties prop = ConfigUtil.loadProperty(mcFile);
		return prop.containsKey("host") ? prop.getProperty("host") : "";
	}
	
	public static String getInfo() {
		StringBuilder sb = new StringBuilder();
		sb.append("Server Info.")
				.append("\n----------------------------------------------------------------")
				.append("\n . Server Type : " + SERVER_TYPE)
				.append("\n . MC IP : " + MC_IP)
				.append("\n . MS ID : " + MS_ID)
				.append("\n . MC Role : " + MC_ROLE)
				.append("\n . MS Role : " + MS_ROLE)
				.append("\n . MC Standalone server : " + MC_STANDALONE_SERVER)
				.append("\n . MS Standalone server : " + MS_STANDALONE_SERVER)
				.append("\n . MCMS Integrated server : " + MCMS_INTEGRATED_SERVER)
				.append("\n----------------------------------------------------------------");
		return sb.toString();
	}
}
