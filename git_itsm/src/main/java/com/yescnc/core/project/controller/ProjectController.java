package com.yescnc.core.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.entity.db.ProjectVO;

@RequestMapping("/project")
@RestController
public class ProjectController {
	//private org.slf4j.Logger log = LoggerFactory.getLogger(CustomWidgetController.class);
	
	@Autowired
	
	
	@RequestMapping(method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public List<ProjectVO> selectProjectList() {
		return null;
	}
	
}
