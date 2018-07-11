package com.yescnc.jarvis.db.tickerManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

import com.yescnc.jarvis.entity.db.TickerVO;

@Repository
public class TickerManagerDaoImpl implements TickerManagerDao {
	@Autowired
	private SqlSession sqlSession;
	
	private Logger log = LoggerFactory.getLogger(TickerManagerDaoImpl.class);

	@Override
	public List getTickerList() {
		return sqlSession.getMapper(TickerManagerMapper.class).getTickerList();
	}
	
	@Override
	public List getTickerScrollingList() {
		return sqlSession.getMapper(TickerManagerMapper.class).getTickerScrollingList();
	}

	@Override
	public List<TickerVO> searchTickerList(HashMap param) {
		List<TickerVO> result = sqlSession.getMapper(TickerManagerMapper.class).searchTickerList(param);
		return result;
	}

	@Override
	public Integer createTicker(HashMap map) {
		int result = 100;
		
		try {
			sqlSession.getMapper(TickerManagerMapper.class).createTicker(map);
		} catch (DuplicateKeyException e) {
			
			System.out.println(e.getMessage());
			result = -110;
			
		}catch (Exception e) {
			
			System.out.println(e.getMessage());
			result = -100;
		}
		
		return result;
	}

	@Override
	public Integer deleteTicker(HashMap map) {
		int result = 200;
		
		try {
			sqlSession.getMapper(TickerManagerMapper.class).deleteTicker(map);
		} catch (Exception e) {
			result = -200;
		}
		
		return result;
	}

	@Override
	public List dupleKeySearch(HashMap map) {
		return sqlSession.getMapper(TickerManagerMapper.class).dupleKeySearch(map);
	}

	@Override
	public Integer updateTicker(HashMap map) {
		int result = 300;
		
		try {
			sqlSession.getMapper(TickerManagerMapper.class).updateTicker(map);
		} catch (Exception e) {
			result = -300;
		}
		
		return result;
	}

}
