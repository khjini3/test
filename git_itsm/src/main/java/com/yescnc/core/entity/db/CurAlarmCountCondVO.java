package com.yescnc.core.entity.db;

import java.io.Serializable;
import java.util.ArrayList;

public class CurAlarmCountCondVO implements Serializable, Cloneable {

	private static final long serialVersionUID = 7968366000350145478L;

	private long nSeqNo = -1;
	private ArrayList<Integer> alLvl3Ids = null;

	public CurAlarmCountCondVO() {
	}

	@Override
	public CurAlarmCountCondVO clone() {
		try {
			CurAlarmCountCondVO copiedOne = (CurAlarmCountCondVO) super.clone();
			return setMemberVar(this, copiedOne);
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return setMemberVar(this, new CurAlarmCountCondVO());
	}

	private CurAlarmCountCondVO setMemberVar(CurAlarmCountCondVO original,
			CurAlarmCountCondVO copiedOne) {
		copiedOne.nSeqNo = original.nSeqNo;
		copiedOne.alLvl3Ids = original.alLvl3Ids;
		return copiedOne;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n[nSeqNo : ").append(this.nSeqNo).append("\t/")
				.append("alLvl3Ids : ").append(this.alLvl3Ids).append("]");
		return sb.toString();
	}

	public long getSeqNo() {
		return nSeqNo;
	}

	public void setSeqNo(long nSeqNo) {
		this.nSeqNo = nSeqNo;
	}

	public ArrayList<Integer> getAlLvl3Ids() {
		return alLvl3Ids;
	}

	public void setAlLvl3Ids(ArrayList<Integer> alLvl3Ids) {
		this.alLvl3Ids = alLvl3Ids;
	}

}
