package com.yescnc.core.db.widget;

//import org.apache.ibatis.jdbc.SQL;
import org.springframework.stereotype.Component;
/*
@Component
public class BuildQuery {
	public String getSelect(String keys, String values, String tableName, String condition) {

		SQL query = new SQL();
		
		if(values.equals("")) {
			query.SELECT(keys);
		} else {
			query.SELECT(keys);
			query.SELECT(values);
		}
		
		query.FROM(tableName).WHERE(condition);
		return query.toString();
		
	}
}
*/

@Component
public class BuildQuery {
	public String getSelect(String columns , String tableName, String condition) {

		String query = "";
		
		query += "select "+ columns+ " from "+ tableName;
		
		if(!condition.equals("")) {
			query += " where" + condition;
		} 
		
		return query;
	}
	public String getSelect(String keys, String values, String tableName, String condition) {
		String colums = "";
		String query = "";
		
		if(values.equals("")) {
			colums += keys + values;
		} else {
			colums += keys + "," + values;
		}
		
		query += "select "+ colums+ " from "+ tableName;
		
		if(!condition.equals("")) {
			query += " where" + condition;
		} 
		
		return query;
	}
}