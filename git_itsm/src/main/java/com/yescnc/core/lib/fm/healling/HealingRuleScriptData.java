package com.yescnc.core.lib.fm.healling;

import java.io.Serializable;




public class HealingRuleScriptData implements Serializable {
	private static final long serialVersionUID = 1L;
	//public Boolean 	isChecked = false;
	private int		index 	= 0;
	private String 	command = null;
	private int 		gap 	= 0;	
	private String 	type	= HealingConstants.CLI_TYPE; // 1:CLI, 2:Shell script
	private String 	shellScript = "";
	
	public int getIndex() {
		return index;
	}

	public boolean isShell() {
		return HealingConstants.SHELL_TYPE.equals(type) ? true : false;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}
	
	public String getShellScript() {
		return shellScript;
	}
	public void setShellScript(String shellScript) {
		this.shellScript = shellScript;
	}
	public void setIndex(int idx) {
		this.index = idx;
	}
	
	public String getCommand() {
		return command;
	}
	public void setCommand(String command) {
		this.command = command;
	}
	public int getGap() {
		return gap;
	}
	public void setGap(int gap) {
		this.gap = gap;
	}
}
