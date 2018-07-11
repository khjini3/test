package com.yescnc.core.db.widget;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import com.yescnc.core.util.json.JsonCacheResult;
import com.yescnc.core.util.json.JsonResult;
import com.yescnc.core.widget.controller.KpiWidgetController;

@Repository("widgetRepository")
public class WidgetRepository {
	private org.slf4j.Logger log = LoggerFactory.getLogger(KpiWidgetController.class);
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JsonResult widgetExcute(String query) {
		//log.info("Total Query :  " + query);
		JsonResult result = Preconditions
				.checkNotNull((JsonResult) jdbcTemplate.query(query, new WidgetResultSetExtractor()));
		return result;
	}
	
	/*public JsonResult widgetExcute(String column, String tableName, String condition) {
		String query = "select " + column + " from " + tableName;
		if(!condition.equals("")) query += " where " + condition;
		
		log.info("Split Query :  " + query);
		JsonResult result = Preconditions
				.checkNotNull((JsonResult) jdbcTemplate.query(query, new WidgetResultSetExtractor()));
		return result;
	}*/
	
	public JsonCacheResult excute(String query, int flag) {
		JsonCacheResult result = Preconditions
				.checkNotNull((JsonCacheResult) jdbcTemplate.query(query, new KpiWidgetResultSetExtractor(flag)));
		return result;
	}
	
	class KpiWidgetResultSetExtractor implements ResultSetExtractor {

		private int type;
		
		public KpiWidgetResultSetExtractor(int type){
			this.type = type;
		}
		@Override
		public Object extractData(ResultSet paramResultSet) throws SQLException, DataAccessException {
			// TODO Auto-generated method stub
			JsonCacheResult result = new JsonCacheResult();
			
			try {
				ResultSetMetaData rm = paramResultSet.getMetaData();
				int cols = rm.getColumnCount();
				
				if(type == 1){
					Map<String,ArrayList<Object>> dataArr = new HashMap<String,ArrayList<Object>>();
					for (int i = 1; i <= cols; i++) {
						String col = rm.getColumnLabel(i);
						ArrayList<Object> subData = Lists.newArrayList();
						dataArr.put(col, subData);
					}
					
					while (paramResultSet.next()) {
						for (int i = 1; i <= cols; i++) {
							String col = rm.getColumnLabel(i);
							if(dataArr.containsKey(col)){
								ArrayList<Object> tmpArr  = dataArr.get(col);
								tmpArr.add(paramResultSet.getString(col));
								dataArr.put(col, tmpArr);
							}
						}
					}
					result.setData("data", dataArr);
					result.setResult(true);

				}else if (type ==2){
					ArrayList<Object> dataArr = Lists.newArrayList();
	
					while (paramResultSet.next()) {
						HashMap<String, String> map = new HashMap<String, String>();
						for (int i = 1; i <= cols; i++) {
							map.put(rm.getColumnLabel(i), paramResultSet.getString(i));
						}
						dataArr.add(map);
					}
					result.setData("data", dataArr);
					result.setResult(true);
				}else if(type ==3) {
					ArrayList<Object> dataArr = Lists.newArrayList();
					ArrayList<String> strArr = Lists.newArrayList();

					for (int i = 1; i <= cols; i++) {
						strArr.add(rm.getColumnLabel(i));
					}

					while (paramResultSet.next()) {
						HashMap<String, String> map = new HashMap<String, String>();
						for (int i = 1; i <= cols; i++) {
							map.put(rm.getColumnLabel(i), paramResultSet.getString(i));
						}
						dataArr.add(map);
					}

					result.setData("field", strArr);
					result.setData("data", dataArr);
					result.setResult(true);
				} else {
					result.setResult(false);
				}

			} catch (Exception e) {
				result.setResult(false);
			}

			return result;
		}
	}

	class WidgetResultSetExtractor implements ResultSetExtractor {

		@Override
		public Object extractData(ResultSet paramResultSet) throws SQLException, DataAccessException {
			// TODO Auto-generated method stub
			JsonResult result = new JsonResult();

			try {
				ResultSetMetaData rm = paramResultSet.getMetaData(); // ResultSetMetaData getMetaData() throws SQLException;
				int cols = rm.getColumnCount(); // int getColumnCount() throws SQLException;

				ArrayList<Object> dataArr = Lists.newArrayList();
				ArrayList<String> strArr = Lists.newArrayList(); // column name

				for (int i = 1; i <= cols; i++) {
					strArr.add(rm.getColumnLabel(i)); // String getColumnLabel(int column) throws SQLException;
				}

				while (paramResultSet.next()) {
					HashMap<String, String> map = new HashMap<String, String>();
					for (int i = 1; i <= cols; i++) {
						map.put(rm.getColumnLabel(i), paramResultSet.getString(i));
					}
					dataArr.add(map);
				}

				result.setData("field", strArr);
				result.setData("data", dataArr);
				result.setResult(true);
			} catch (Exception e) {
				result.setResult(false);
			}

			return result;
		}
	}
}
