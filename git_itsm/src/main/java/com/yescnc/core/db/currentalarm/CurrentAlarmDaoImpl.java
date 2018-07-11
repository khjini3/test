package com.yescnc.core.db.currentalarm;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.CurrentAlarmVO;

@Repository
public class CurrentAlarmDaoImpl implements CurrentAlarmDao {
	@Autowired
	private SqlSession sqlSession;

	@Override
	public List<CurrentAlarmVO> selectCurrentAlarm(CurrentAlarmVO vo) {
		List<CurrentAlarmVO> currentAlarmVoList = sqlSession.getMapper(CurrentAlarmMapper.class).selectCurrentAlarm(vo);
		for (CurrentAlarmVO currentAlarmVO : currentAlarmVoList) {
			fixTimeFormat(currentAlarmVO);
		}
		return currentAlarmVoList;
	}

	private static CurrentAlarmVO fixTimeFormat(CurrentAlarmVO currentAlarmVO) {
		if (currentAlarmVO == null) {
			return null;
		}

		currentAlarmVO.setAlarm_time(currentAlarmVO.getAlarm_time().split("\\.")[0]);
		if (currentAlarmVO.getClear_time() != null && currentAlarmVO.getClear_time().length() > 0) {
			currentAlarmVO.setClear_time(currentAlarmVO.getClear_time().split("\\.")[0]);
		}

		if (currentAlarmVO.getAck_time() != null && currentAlarmVO.getAck_time().length() > 0) {
			currentAlarmVO.setAck_time(currentAlarmVO.getAck_time().split("\\.")[0]);
		}

		return currentAlarmVO;
	}

	@Override
	public boolean updateCurrentAlarmAck(HashMap<String, ?> param) {
		return sqlSession.getMapper(CurrentAlarmMapper.class).updateCurrentAlarmAck(param);
	}

	@Override
	public boolean deleteCurrentAlarm(HashMap<String, ?> param) {
		return sqlSession.getMapper(CurrentAlarmMapper.class).deleteCurrentAlarm(param);
	}
}
