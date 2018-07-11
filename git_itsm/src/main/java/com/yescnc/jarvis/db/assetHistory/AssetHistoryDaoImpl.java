package com.yescnc.jarvis.db.assetHistory;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.yescnc.core.entity.db.UserVO;


@Repository
public class AssetHistoryDaoImpl implements AssetHistoryDao {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public Integer insertHistory(Map map) {
		int result = 0;
		
		//오늘의 날짜 구하기
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyy-MM-dd HH:mm:ss", Locale.KOREA);
		Date currentTime = new Date();
		String dTime = formatter.format(currentTime);
		int changeCnt = (int)map.get("changeCnt");
		String status = (String)map.get("type");
		String locName = (String)map.get("locName");
		String historyText = "";
			
		switch(status){
			case "create":
				historyText = changeCnt + "건의 데이터를 생성 했습니다.";
				break;
			case "update":
				historyText = changeCnt + "건의 데이터를 업데이트 했습니다.";
				break;
			case "delete":
				historyText = changeCnt + "건의 데이터를 삭제 했습니다.";
				break;
			case "multiUpdate":
				historyText = changeCnt + "건의 데이터를 Import 했습니다.";
				break;
			case "assigned":
				historyText = changeCnt + "건의 데이터가 "+locName+"에 할당 되었습니다.";
				break;
			case "unassigned":
				historyText = changeCnt + "건의 데이터가 "+locName+"에서 해제 되었습니다.";
				break;
		}
		
		UserVO userVo = (UserVO) map.get("userVO");
		
		Map resultParam = new HashMap();
		resultParam.put("userId", userVo.getUserId());
		resultParam.put("ip", userVo.getIpAddress());
		resultParam.put("changeCnt", changeCnt);
		resultParam.put("historyText", historyText);
		resultParam.put("assetList", (String) map.get("crudTxt"));
		resultParam.put("cTime", dTime);
		resultParam.put("status", status);
		
		try {
			sqlSession.getMapper(AssetHistoryMapper.class).insertHistory(resultParam);
		} catch (Exception e) {
			result = -100;
		}
		return result;
	}
	
	@Override
	public ArrayList<HashMap<String, Object>> searchHistory(Map<String, Object> param){
		return sqlSession.getMapper(AssetHistoryMapper.class).searchHistory(param);
	}

	@Override
	public Integer getRowCount() {
		return sqlSession.getMapper(AssetHistoryMapper.class).getRowCount();
	}

}
