package com.yescnc.core.main.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {
	//private org.slf4j.Logger log = LoggerFactory.getLogger(MainController.class);
	
	@Value("${navbar}")
	private String navbar;
	
	@RequestMapping(value = "/",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public String index() {
		return "main/login";
	}
	
	@RequestMapping(value = "/main",method=RequestMethod.GET, produces="application/json;charset=UTF-8")
	public String main() {
		if(navbar.matches("side")) {
			return "main/mainSide";
		} else if(navbar.matches("top")){
			return "main/mainTop";
		} else{
			return "main/mainTopSide";
		}
	}

	@RequestMapping(value = "/views/{menu}/{page}", method = RequestMethod.GET)
	public String getViews(@PathVariable String menu, @PathVariable String page) {
		String forward = menu + "/" + page;
		return forward;
	}
	
	@RequestMapping(value = "/views/{menu}/{sub}/{page}", method = RequestMethod.GET)
	public String getViews(@PathVariable String menu, @PathVariable String sub, @PathVariable String page) {
		String forward = menu + "/" + sub + "/" + page;
		return forward;
	}
}
