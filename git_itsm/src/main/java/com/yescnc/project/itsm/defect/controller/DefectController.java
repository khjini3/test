package com.yescnc.project.itsm.defect.controller;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.project.itsm.defect.service.DefectService;

@RequestMapping("/defect")
@RestController
public class DefectController {
	private org.slf4j.Logger log = LoggerFactory.getLogger(DefectController.class);
	
	@Autowired
	DefectService defectService;
}
