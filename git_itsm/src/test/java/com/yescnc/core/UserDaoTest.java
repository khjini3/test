package com.yescnc.core;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.yescnc.core.db.user.UserDao;
import com.yescnc.core.entity.db.UserVO;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserDaoTest {

	@Autowired
	private UserDao userDao;
	
	
	@Ignore
	@Test
	public void userSelectTest() {
	}
	

	
}
