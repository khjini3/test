package com.yescnc.project.itsm.productManager.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.yescnc.core.configuration.annotation.OperationLogging;
import com.yescnc.core.constant.CategoryKey;
import com.yescnc.core.entity.db.IpVO;
import com.yescnc.core.entity.db.UserVO;
import com.yescnc.jarvis.codeManager.service.CodeManagerService;
import com.yescnc.jarvis.entity.db.IdcCodeVO;
import com.yescnc.project.itsm.defect.controller.DefectController;
import com.yescnc.project.itsm.entity.db.ProductVO;
import com.yescnc.project.itsm.estimate.service.EstimateService;
import com.yescnc.project.itsm.productManager.service.ProductManagerService;

@RequestMapping("/productManager")
@RestController
public class ProductManagerController {

	private org.slf4j.Logger log = LoggerFactory.getLogger(DefectController.class);
	
	@Autowired
	ProductManagerService productManagerService;
	
	@Autowired
	CodeManagerService codeManagerService;
	
	@Autowired
	EstimateService estimateService;
	
	@OperationLogging(enabled=true)
	@RequestMapping(value = "/getProductList", method=RequestMethod.GET)
	public List<IdcCodeVO> getProductList() {
		List<IdcCodeVO> result = new ArrayList();
		result = productManagerService.getProductList();
		return result;
	}
	
	@OperationLogging(enabled=true)
	@RequestMapping(value = "/getModelList/{groupId}", method=RequestMethod.GET)
	public List<ProductVO> getModelList(@PathVariable("groupId") String groupId) {
		List<ProductVO> result = new ArrayList();
		ProductVO vo = new ProductVO();
		vo.setProduct_type(groupId);
		result = productManagerService.getModelList(vo);
		return result;
	}
	
	@RequestMapping(value = "/{cmd}/{seq}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer insertCode(@PathVariable("cmd") String cmd, @PathVariable("seq") String id, @RequestBody HashMap map) {
		return codeManagerService.insertCode(map);
	}
	
	@RequestMapping(value = "/{cmd}",method=RequestMethod.PUT, produces="application/json;charset=UTF-8")
	public Integer updateCode(@PathVariable("cmd") String cmd,  @RequestBody HashMap map) {
		return codeManagerService.updateCode(map);
	}
	
	@RequestMapping(value = "/{cmd}/{seq}",method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteCode(@PathVariable("cmd") String cmd, @PathVariable("seq") String id) {
		
		String[] codeArr = id.split("_");
		
		List list = new ArrayList();
		
		for(int i=0; i < codeArr.length; i++){
			String subId = codeArr[i];
			Map subMap = new HashMap();
			subMap.put("id", subId);
			list.add(subMap);
		}
		
		Map paramMap = new HashMap();
		
		paramMap.put("param", list);
		
		int result = codeManagerService.deleteCode(paramMap);
		
		return result;
	}
	
	@RequestMapping(value = "/search/{groupId}", method=RequestMethod.GET)
	public List<ProductVO> getSearchlList(@PathVariable("groupId") String groupId) {
		List<ProductVO> result = new ArrayList();
		ProductVO vo = new ProductVO();
		vo.setProduct_name(groupId);
		result = productManagerService.getSearchlList(vo);
		return result;
	}
	
	@RequestMapping(value = "/getSiteList", method=RequestMethod.GET)
	public Map<String, Object> getSiteList(){
		Map<String, Object> result = estimateService.getSiteList();
		return result;
	}
	
	@RequestMapping(value = "/modelAdd", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer insertModel(@RequestBody ProductVO vo) {
		return productManagerService.insertModel(vo);
	}
	
	@RequestMapping(value = "/modelEdit", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Integer updateModel( @RequestBody ProductVO vo) {
		System.out.println(vo+"TESTPRODUCT");
		return productManagerService.updateModel(vo);
	}
	
	@RequestMapping(value = "modelList/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteModelList(@PathVariable("seq") String id) {
		ProductVO vo = new ProductVO();
		vo.setProduct_type(id);
		return productManagerService.deleteModelList(vo);
	}
	
	@RequestMapping(value = "/multiDelete/{seq}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
	public Integer deleteModelMulti(@PathVariable("seq") String id) {
		
		int result = -1;
		List<String> multis = Arrays.asList(id.split(","));
		Iterator<String> iterator = multis.iterator();
		
		List<ProductVO> resultList = new ArrayList<>();
		Map<String, List<ProductVO>> map = new HashMap<String, List<ProductVO>>();		
		
		while(iterator.hasNext()){
			String tc_seq_multi = iterator.next();
//			int numInt = Integer.parseInt(tc_seq_multi);
			
			ProductVO multi = new ProductVO();
			multi.setProduct_id(tc_seq_multi);
			resultList.add(multi);
		}
		map.put("list", resultList);
		result = productManagerService.deleteIpMulti(map);
		
		return result;
	}
	
	//import // export
	@RequestMapping(value="/{cmd}/{type}", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
	public Map<String, Object> createAsset(HttpServletRequest request, HttpServletResponse response, @PathVariable("cmd") String cmd,@PathVariable("type") String type, @RequestBody HashMap map){
		HttpSession session = request.getSession();
		Map<String, Object> param = new HashMap<>();
		
		String paramType = "";
		
		if(!cmd.equals("delete") && !cmd.equals("multiUpdate")){
			if(map.get("type") instanceof String){
				paramType = (String)map.get("type");
			}else{
				paramType = (String)((HashMap)map.get("type")).get("text");
			}
		}
		
		param.put("param", map);
		int status = 0; //삽입:100, 삽입오류:-100, 삽입중복오류:-110,//삭제:200, 삭제오류:-200, //업데이트:300, 업데이트 오류 : -300
		
		switch(cmd){
		case "multiUpdate":
			param.put("type", "multiUpdate");
			ArrayList csvList = (ArrayList) map.get("crudList");
			
			int result= 0;
			int csvLen = csvList.size();
			for(int i =0; i< csvLen; i++){
				try{
					HashMap csvMap = (HashMap) csvList.get(i);
					result = productManagerService.csvAsset(csvMap);
										
				}catch(Exception e){
					e.printStackTrace();
				}
			}
			
			status = result;
						
			break;
		}
		
		param.put("status", status);
		
		return param;
	}
}
