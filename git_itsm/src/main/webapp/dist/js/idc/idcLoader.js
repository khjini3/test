function Idc3DLoader(canvasName) {
        /**
         * Create by 김현진
         * IDC Variable Setting
         * */
		this.canvas = document.querySelector(canvasName);
		this.engine = new BABYLON.Engine(this.canvas, true);
		this.scene = new BABYLON.Scene(this.engine);
        this.dataProvider = null;
		
		this.aniCheck = {};
		//현재 Scene 위치
        this.currentState = ""; 
        //Camera 초기값 설정
		this.currentCamera = {};
		this.camera = null;
		this.canvas2D = null;
		this.labelGroups = [];
		this.idc = null; 
        this.init();
        
        /**
         * 누수변수
         * */
        this.waterTopArr = []; //상단 누수 경로
        this.waterBottomArr = []; //하단 누수 경로
        
        //누수 발생 위치에 박스 관리
        this.topBoxArr = []; 
        this.bottomBoxArr = [];
        
        //누수 발생 위치에 라벨 관리
        this.topLabelArr = []; 
        this.bottomLabelArr = [];
        
        this.waterTop = null; //상단 누수 라인
        this.waterBottom = null; //하단 누수 라인
        
        this.canvas2dTop = null;
        this.canvas2dBottom = null;
        
        /**
         * 온습도
         * */
        this.temperArr = [];
        this.temperLabelGroup = []; 
        this.canvasTemper2D = null;
        this.temperFlug = false;
        /**
         * POPUP Variable
         * */
        this.popupCanvas = null;
        this.popupEngine = null;
        this.popupScene = null;
        this.popupCurrentCamera = {};
        this.popupCamera = null;
        this.popupCanvas2D = null; //라벨을 그리기 위한 Canvas
		this.popupLabelGroups = []; //Label을 관리하는 변수
		this.popupLineArr = []; //선을 관리하는 변수
		this.popupPositionArr = []; //Position값을 담는 변수
		this.popupSpheresArr = []; //Real Position을 계산하기 위한 Mesh
		this.popupServerArr = []; //실장 장비 리스트
		
		this.map = {};
		this.mapArr = {};
		/*실장장비 박스 크기 */
        this.boxWidth = 0; //1U Width
        this.boxHeight = 0; //1U Height
        this.boxDepth = 0; //1U Depth
        
        /*sprite변수*/
        this.spriteManger = null;
        this.arrowAni = null;
        
        /*assetManager*/
        this.assetsManager = null;
        this.popupAssetsManager = null;
        
        /*sub Navi*/
        this.buildingID = '';
        this.floorID = '';
    }
    
Idc3DLoader.prototype = {
        init: function() {
            var _this = this;
        	
        	window.addEventListener("resize", function () {
                 _this.engine.resize();
            });
        	
        },
        
        dumyEventDataInsert : function(){
        	sceneComp.idc.listNotifiCation("dumyEventDataInsert");
        },
        
        removeAllElement : function(){
        	this.removeAsset();
        	this.disposeLabel();
        	this.removeVariable();
        },
        
        //변수 초기화
        removeVariable : function(){
        	this.waterTopArr = [];
    		this.waterTopArr = [];
    		this.removeWaterLabel();
    		
    		this.temperArr = [];
    		this.removeTemperLabel();
    		this.temperFlug = false;
        },
        
        removeTemperLabel : function(){
        	for (var g = 0; g < this.temperLabelGroup.length; g++) {
        		this.temperLabelGroup[g].dispose();
    		}
    		
        	if(this.canvasTemper2D){
        		this.canvasTemper2D.dispose();
        	}
        	
    		this.temperLabelGroup = [];
        },
        
        //Label 지우기
        disposeLabel : function(){
        	for (var g = 0; g < this.labelGroups.length; g++) {
        		this.labelGroups[g].dispose();
    		}
    		
        	if(this.canvas2D){
        		this.canvas2D.dispose();
        	}
        	
    		this.labelGroups = [];
        },
        
        removeAsset : function(){
        	
        	this.engine.stopRenderLoop();
        	
        	if (this.engine.scenes.length !== 0) {
				while (this.engine.scenes.length > 0) {
					this.engine.scenes[0].dispose();
				}
			}
        	
        },
        
        initBuilds : function(result, state){
        	this.setData(result);
        	this.removeAllElement();
        	
        	this.engine.loadingUIBackgroundColor = "#041128ba";
        	
        	this.scene = new BABYLON.Scene(this.engine);
        	
        	var sceneRender = this.scene.getBoundingBoxRenderer();
        	sceneRender.showBackLines = false;
        	sceneRender.frontColor = new BABYLON.Color3(0.53, 0.99, 0);
        	
        	this.assetsManager = new BABYLON.AssetsManager(this.scene);
        	
        	this.currentState = state;
        	
        	//DB Camera
        	var jsonCamera = JSON.parse(_.filter(result, function(obj){
        		return obj.partitionType === "root";
        	})[0].camera);
        	
        	this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
        	
        	var camera = this.camera;
        	
    		for(var name in jsonCamera){
    			if(typeof(jsonCamera[name]) === "object"){
    				for(var subName in jsonCamera[name]){
    					camera[name][subName] = jsonCamera[name][subName];
    				}
    			}else{
    				camera[name] = jsonCamera[name];
    			}
    		}
    		
    		camera.lowerRadiusLimit = 1;
    		camera.upperRadiusLimit = 1000;
    		camera.wheelPrecision = 1;
    		camera.attachControl(this.canvas, true);
    		
    		this.currentCamera.radius = camera.radius;
    		this.currentCamera.beta = camera.beta;
    		this.currentCamera.alpha = camera.alpha;
    		this.currentCamera.targetX = camera.target.x;
        	this.currentCamera.targetY = camera.target.y;
        	this.currentCamera.targetZ = camera.target.z;
        	this.currentCamera.positionX = camera.position.x;
        	this.currentCamera.positionY = camera.position.y;
        	this.currentCamera.positionZ = camera.position.z;
    		
    		var baseLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    		
    		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), this.scene);
    		light.intensity = 0.8;
    		
    		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    		
    		var aniObj = this.aniCheck;
    		if(state === "building"){
    			aniObj.aniFlug = true;
    			this.scene.forceWireframe = true;
    		}else{
    			aniObj.aniFlug = false;
    			this.scene.forceWireframe = false;
    		}
    		
    		this.scene.registerBeforeRender(function () {
    	        light.position = camera.position;
    	        
    	        if(aniObj.aniFlug){
    	        	camera.alpha += 0.001;
    	        }
    	        
    	    });
    		
    		/*switch(state){
	    		case "building":
	    			this.createBuilding(result);
	    			break;
	    		case "floor":
	    			this.createFloors(result);
	    			break;
	    		case "room":
	    			this.createRoom(result);
	    			break;
    		}*/
    		
    		if(result.length > 0){
    			this.spriteManger = new BABYLON.SpriteManager("positionArrow", "dist/img/idc/arrow_blue_ani.png", 1, 40, this.scene);
    			
        		for(var i=0; i < result.length; i++){
            		var item = result[i];
            		if(item.modelName){
            			if(state === "floor"){
            				//빌딩정보까지 같이 넘어오기 때문에
            				if(item.modelName && item.modelType === "FLOOR"){
                    			this.createModel(item, this.scene, state);
                    		}
            			}else{
            				this.createModel(item, this.scene, state);
            			}
            			
            		}
            	}
            	
            	this.assetsManager.load();
            	
        	}else{
        		sceneComp.idc.createComplete(state);
        	}
        },
        
        createBuilding : function(result){
        	if(result.length > 0){
        		for(var i=0; i < result.length; i++){
            		var item = result[i];
            		if(item.modelName){
            			this.createModel(item, this.scene, "building");
            		}
            	}
            	
            	this.assetsManager.load();
        	}else{
        		sceneComp.idc.createComplete("building");
        	}
        	
        },
        
        createFloors : function(result){
        	
        	for(var i=0; i < result.length; i++){
        		var item = result[i];
        		if(item.modelName && item.modelType === "FLOOR"){
        			this.createModel(item, this.scene, "floor");
        		}
        	}
        	
        	this.assetsManager.load();
        },
        
        createRoom : function(result){
        	if(result.length > 0){
        		this.spriteManger = new BABYLON.SpriteManager("positionArrow", "dist/img/idc/arrow_blue_ani.png", 1, 40, this.scene);
            	for(var i=0; i < result.length; i++){
            		var item = result[i];
            		if(item.modelName){
            			this.createModel(item, this.scene, "room");
            		}
            	}
            	
            	this.assetsManager.load();
            	
        	}else{
        		sceneComp.idc.createComplete("room");
        	}
        },
        
        /*
         * POPUP Scene 생성 과정
         * */
        initPOPUP : function(canvas, item){
        	this.popupCanvas = canvas;
        	
        	this.popupEngine = new BABYLON.Engine(this.popupCanvas, true);
        	var popupEngine = this.popupEngine;
        	/*this.popupEngine.loadingUIText = "Loading...";
        	this.popupEngine.loadingUIBackgroundColor = "black";*/
        	
        	this.popupScene = new BABYLON.Scene(popupEngine);
        	
        	var sceneRender = this.popupScene.getBoundingBoxRenderer();
        	sceneRender.showBackLines = false;
        	sceneRender.frontColor = new BABYLON.Color3(0.53, 0.99, 0);
        	
        	var popupScene = this.popupScene;
        	this.popupAssetsManager = new BABYLON.AssetsManager(this.popupScene);
        	
        	this.popupCamera = new BABYLON.ArcRotateCamera("popupCamera", 0, 0, 0, BABYLON.Vector3.Zero(), popupScene);
        	var popupCamera = this.popupCamera;
        	
        	popupCamera.setPosition(new BABYLON.Vector3(-5.6, 2, -6.4));
        	popupCamera.target = new BABYLON.Vector3(0, 0, 0);
        	popupCamera.attachControl(popupCanvas, true);
        	popupCamera.wheelPrecision = 50; 
        	popupCamera.lowerRadiusLimit = 2.5;
        	popupCamera.upperRadiusLimit = 20;
        	popupScene.activeCamera.panningSensibility  = 1000;
        	popupScene.clearColor = new BABYLON.Color4(0, 0, 0, 0.2);
        	
        	this.popupCurrentCamera.radius = popupCamera.radius;
        	this.popupCurrentCamera.beta = popupCamera.beta;
        	this.popupCurrentCamera.alpha = popupCamera.alpha;
        	this.popupCurrentCamera.targetX = popupCamera.target.x;
        	this.popupCurrentCamera.targetY = popupCamera.target.y;
        	this.popupCurrentCamera.targetZ = popupCamera.target.z;
        	this.popupCurrentCamera.positionX = popupCamera.position.x;
        	this.popupCurrentCamera.positionY = popupCamera.position.y;
        	this.popupCurrentCamera.positionZ = popupCamera.position.z;
        	
        	var baseLight = new BABYLON.HemisphericLight("baseLight", new BABYLON.Vector3(0, 1, 0), popupScene);
    		var omni = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), popupScene);
    		omni.intensity = 0.8;
        	
    		popupScene.registerBeforeRender(function () {
    			if(popupCamera){
    				omni.position = popupCamera.position;
    			}
    	    });
    		
    		popupScene.executeWhenReady(function(){
    			//Scene 로딩이 다 완료 된 후
    			var mesh = w2popup.get().param;
    			switch(mesh.type){
	    			case "RACK":
	        			w2popup.getEventData();
	    				break;
	    			default :
	    				break;
    			}
    			
    		});
    		
    		this.createPOPUP(item);
        },
        
        createPOPUP : function(item){
        	var path =  "dist/models/"+item.modelName+"/";
        	var fileName = item.modelName+".babylon";
        	
        	if(item.type ==="RACK"){
        		path = "dist/models/rackFrame/";
        		fileName = "rackFrame.babylon";
        	}
        	
        	if(item.type ==="RACK"){
        		
        		BABYLON.SceneLoader.ImportMesh("", path, fileName, this.popupScene, function(meshes) {
            		meshes.forEach(function(value, index){
            			if(index ===0){
            				value.id = "rackFrame";
        					value.show = true;
        					value.isVisible = false;
            				sceneComp.createRackIn(item);
            				
            				sceneComp.popupAssetsManager.load();
            			}
            		});
        		});
        		
        	}else{
        		
        		this.popupAssetsManager.addMeshTask(item.modelName, "", path, fileName).onSuccess = function(task){
        			task.loadedMeshes.forEach(function(value, idx){
        				if(idx === 0){
        					switch(item.type){
	        					case "AIRCON":
		    		        	case "FINGER-SCAN":
		    		        	case "PDU":
		    		        	case "TEMPER":
		    		        	case "PDP":
		    		        		value.show = true;
		        					value.isVisible = false;
		        					
		        					var scene = sceneComp.popupScene;
		        					var cam = scene.cameras[0];
		        					var meshSize = value.getBoundingInfo().boundingBox.extendSize;
		        					
		        					var meshWidth = meshSize.x*2;
		        					var meshHeight = meshSize.y*2;
		        					var meshDepth = meshSize.z;
		        					
		        					var resultWidthHeight = 0;
		        					
		        					if(meshWidth < meshHeight){
		        						resultWidthHeight = meshHeight;
		        					}else{
		        						resultWidthHeight = meshWidth;
		        					}
		        					
		        					/*
		        					 * 하나의 대상을 기준으로 측정했을 때
		        					 * 오브젝트의 가로 세로 중에 더 큰값을 기준으로 카메라 한눈에 보이기 까지 거리가 21.7+오브젝트 Depth 였다.
		        					 * 해당 값을 가지고 비율을 계산 했을 때 아래와 같은 공식을 얻을 수 있다.
		        					 * 21.7(카메라거리)/오브젝트 x,y중에 큰값 * 대상의 x,y중 큰값+ 대상의 Depth + 여백;
		        					 * Helper 윤지민
		        					 * **/
		        					var meshRadius = 21.7/13.75 * resultWidthHeight+meshDepth+2;
		        					
		        					cam.setPosition(new BABYLON.Vector3(-12, 7, -21));
		        					cam.upperRadiusLimit = 100;
		        					cam.radius = meshRadius;
		        					cam.target = new BABYLON.Vector3(0, meshSize.y, 0);
		        					
		        					var pCam = sceneComp.popupCurrentCamera;
		        					pCam.radius = cam.radius;
		        		        	pCam.beta = cam.beta;
		        		        	pCam.alpha = cam.alpha;
		        		        	pCam.targetX = cam.target.x;
		        		        	pCam.targetY = cam.target.y;
		        		        	pCam.targetZ = cam.target.z;
		        		        	pCam.positionX = cam.position.x;
		        		        	pCam.positionY = cam.position.y;
		        		        	pCam.positionZ = cam.position.z;
		    		        		break;
        					}
        				}
        			});
        		}
        		
        		this.popupAssetsManager.load();
        	}
        	
        	
        	this.popupAssetsManager.onFinish  = function(task){
        		
        		sceneComp.popupEngine.runRenderLoop(function () {
        			sceneComp.popupScene.render();
        		});
        		
        		/*카메라 애니 */
    			sceneComp.arcAnimation(6, sceneComp.popupScene, "popup"); 
        	}
        	
        },
        
        /*
         * POPUP에서 사용된 UI 제거 작업 
         **/
        initArr : function(){
        	
        	/*라벨 제거*/
        	for(var a = 0; a < this.popupLabelGroups.length; a++){
        		if(this.popupLabelGroups.length > 0){
        			this.popupLabelGroups[a].dispose();
        		}
        	}
        	
        	this.popupLabelGroups = [];
        	
        	/*라인 제거*/
        	for(var b = 0; b < this.popupLineArr.length; b++){
        		if(this.popupLineArr.length > 0){
        			this.popupLineArr[b].dispose();
        		}
        	}
        	
        	this.popupLineArr = [];
        	
        	/*스피어 제거*/
        	for(var c = 0; c < this.popupSpheresArr.length; c++){
        		if(this.popupSpheresArr.length > 0){
        			this.popupSpheresArr[c].dispose();
        		}
        	}
        	
        	this.popupSpheresArr = [];
        	
        	/*장비 제거*/
        	for(var d = 0; d < this.popupServerArr.length; d++){
        		if(this.popupServerArr.length > 0){
        			this.popupServerArr[d].dispose();
        		}
        	}
        	
        	this.popupServerArr = [];
        	
        	if(this.popupCanvas2D){
        		this.popupCanvas2D.dispose();
        	}
        	
        	this.popupCanvas2D = null;
        	
        	this.popupEngine.stopRenderLoop();
        	
        	if (this.popupEngine.scenes.length !== 0) {
				while (this.popupEngine.scenes.length > 0) {
					this.popupEngine.scenes[0].dispose();
				}
			}
        	
        	// 대체 코드
        	
        	this.popupCanvas = null;
        	
        	this.popupPositionArr = [];
        },
        
        betweenCheck : function(start, middle, end){
			if(start <= middle && middle <= end){
				return true;
			}else{
				return false;
			}
		},
		
        //RackIn 서버 영역 재조정
        validateCheck : function(){
        	var arr = [];
			
			if(sceneComp.idc.rackAlign.toLocaleLowerCase() === "asc"){
				//생성된 범위값 중에서 중복 되는 것을 검출해서 삭제 및 업데이트 처리함.
				for (var name in this.map){
					var startP = parseInt(name);
					var endP = parseInt(this.map[name]);
					
					for (var subName in this.map){
						var subEndP = parseInt(this.map[subName]);
						if(startP != subName){
							if(startP <= subName && endP >= subName ){
								arr.push(subName);
								//삭제되어야할 End값이 더 크다면 큰걸로 업데이트
								if(endP < subEndP){
									endP = subEndP; 
								}
							}
						}
					}
				}
				
			}else{
				//생성된 범위값 중에서 중복 되는 것을 검출해서 삭제 및 업데이트 처리함.
				for (var name in this.map){
					var startP = parseInt(this.map[name]);
					var endP = parseInt(name);
					
					for (var subName in this.map){
						var subEndP = parseInt(this.map[subName]);
						if(endP != subName){
							if(startP <= subName && endP >= subName ){
								arr.push(subName);
								//삭제되어야할 End값이 더 크다면 큰걸로 업데이트
								if(endP > subEndP){
									endP = subEndP; 
								}
							}
						}
					}
				}
			}
			
			/*삭제 리스트 삭제*/
			for (var i=0; i < arr.length; i++){
				var delNum = arr[i];
				
				delete this.map[delNum];
				delete this.mapArr[delNum];
			}
        },
        
        /*
         * 랙 장비 안에 서버 배치를 하기 위한 전초과정
         * */
        createRackIn : function(mesh){
        	var dataProvider = mesh.dataProvider;
        	var item = mesh.info[0];
        	
        	this.popupCanvas2D = new BABYLON.ScreenSpaceCanvas2D(this.popupScene, {
    	        id: "ScreenCanvas"
    	    });
        	
        	var rackFrame = this.popupScene.getMeshByID("rackFrame");
        	
        	/*
        	 * Frame 생성
        	 * */
        	var rackMinimum = _.clone(rackFrame.getBoundingInfo().boundingBox.minimum);
			var rackMaximum = _.clone(rackFrame.getBoundingInfo().boundingBox.maximum);
    		
			rackMinimum.x += 0.3;
			rackMinimum.y += 0.3;
			rackMaximum.y -= 0.3;
			rackMaximum.x -= 0.3;
			
    		var minimum = new BABYLON.Vector3(rackMinimum.x, rackMinimum.y, rackMinimum.z);
    		var maximum = new BABYLON.Vector3(rackMaximum.x, rackMaximum.y, rackMaximum.z);
    		
    		var lineCount = item.unitSize;
    		
    		var gap = gap = (maximum.y - minimum.y) / lineCount;
    		
    		if(sceneComp.idc.rackAlign.toLocaleLowerCase() === "asc"){
    			/*
    			 * 오름차순
    			 * */
    			var ascNum = 0;
				for(var i=lineCount; i > 0; i-- ){
					
					if(i===lineCount){
						this.boxWidth = maximum.x - minimum.x;
						this.boxHeight = gap;
						this.boxDepth = maximum.z - minimum.z;
					}
					
					var rackArr = [];
					rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, maximum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, maximum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
					
					this.popupPositionArr.push(rackArr);
					
					var lines = BABYLON.Mesh.CreateLines("lines"+i, rackArr, this.popupScene);
					lines.color = new BABYLON.Color3(1, 1, 0);
					lines.show = true;
					lines.isVisible = false;
					lines.isPickable = false;
					this.popupLineArr.push(lines);
					
					var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.popupScene);
					sphere.position = new BABYLON.Vector3(minimum.x, maximum.y, minimum.z);
					sphere.isVisible = false;
					sphere.show = false;
					sphere.isPickable = false;
					this.popupSpheresArr.push(sphere);
					
					var txtLength = i.toString.length * 8 + 25;
					var positionX = minimum.x-40;
		        	var positionY = sphere.getBoundingInfo().boundingBox.maximum.y-20; 
		        	
		        	ascNum +=1;
		        	
					this.popupLabelGroups.push(new BABYLON.Group2D({
			            parent: this.popupCanvas2D, id: "frame#"+ i, width: 80, height: 40, trackNode: sphere, 
			            children: [
			                new BABYLON.Rectangle2D({ id: "frame#line"+i, width: txtLength, height: 20, x: positionX, isPickable:true, isVerticalSizeAuto : true,
			                y: positionY, origin: BABYLON.Vector2.Zero(), 
			                border: "#ffffffFF", fill: "#000000FF", opacity:0.5, roundRadius: 3, borderThickness:2, children: [
			                		//0부터 시작 하면 +1 제거
			                        new BABYLON.Text2D(ascNum+" P", { marginAlignment: "h:center, v:center", 
			                        fontName: "bold 10px Arial", defaultFontColor: new BABYLON.Color4(255,255,255,1)})
			                    ]
			                })
			            ]
			        }));
					
					maximum.y -= gap;
					
					/*마지막 Line일 경우 숨김 처리*/
					if(i === 1){
						var rackArr = [];
						rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
						rackArr.push(new BABYLON.Vector3(minimum.x, maximum.y, minimum.z));
						rackArr.push(new BABYLON.Vector3(minimum.x, maximum.y, maximum.z));
						rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, maximum.z));
						rackArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
						
						var lines = BABYLON.Mesh.CreateLines("lines", rackArr, this.popupScene);
						lines.color = new BABYLON.Color3(1, 1, 0);
						lines.isVisible = false;
						lines.show = true;
						lines.isPickable = false;
						this.popupLineArr.push(lines);
						
						var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.popupScene);
						sphere.position = new BABYLON.Vector3(minimum.x, maximum.y, minimum.z);
						sphere.isVisible = false;
						sphere.show = false;
						sphere.isPickable = false;
						this.popupSpheresArr.push(sphere);
					}
				}
				
    		}else{
    			/*
    			 * 내림차순
    			 * */
    			for(var i=0; i < lineCount; i++){
					if(i===0){
						var rackArr = [];
						rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
						rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, minimum.z));
						rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, maximum.z));
						rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, maximum.z));
						rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
						
						/*
						* 1Unit Size
						*/
						this.boxWidth = maximum.x - minimum.x;
						this.boxHeight = gap;
						this.boxDepth = maximum.z - minimum.z;
						
						var lines = BABYLON.Mesh.CreateLines("lines", rackArr, this.popupScene);
						lines.color = new BABYLON.Color3(0, 1, 0);
						lines.isVisible = false;
						lines.show = true;
						lines.isPickable = false;
						this.popupLineArr.push(lines);
					}
					
					minimum.y += gap;
					
					var rackArr = [];
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
					
					this.popupPositionArr.push(rackArr);
					
					var lines = BABYLON.Mesh.CreateLines("lines"+i, rackArr, this.popupScene);
					lines.color = new BABYLON.Color3(0, 1, 0);
					lines.isVisible = false;
					lines.show = true;
					lines.isPickable = false;
					this.popupLineArr.push(lines);
					
					var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.popupScene);
					sphere.position = new BABYLON.Vector3(minimum.x, minimum.y, minimum.z);
					sphere.isVisible = false;
					sphere.show = false;
					sphere.isPickable = false;
					this.popupSpheresArr.push(sphere);
					
					var txtLength = i.toString.length * 8 + 25;
					var positionX = minimum.x-40;
		        	var positionY = sphere.getBoundingInfo().boundingBox.minimum.y-20; 
		        	
					this.popupLabelGroups.push(new BABYLON.Group2D({
			            parent: this.popupCanvas2D, id: "frame#"+ i, width: 80, height: 40, trackNode: sphere, 
			            children: [
			                new BABYLON.Rectangle2D({ id: "frame#line"+i, width: txtLength, height: 20, x: positionX, isPickable:true, isVerticalSizeAuto : true,
			                y: positionY, origin: BABYLON.Vector2.Zero(), 
			                border: "#ffffffFF", fill: "#000000FF", opacity:0.5, roundRadius: 3, borderThickness:2, children: [
			                		//0부터 시작 하면 +1 제거
			                        new BABYLON.Text2D(i+1+" P", { marginAlignment: "h:center, v:center", 
			                        fontName: "bold 10px Arial", defaultFontColor: new BABYLON.Color4(255,255,255,1)})
			                    ]
			                })
			            ]
			        }));
				}
    			
    		}
    		
    		this.map = {};
    		this.mapArr = {};
    		var selectRack = item;
    		
    		if(sceneComp.idc.rackAlign.toLocaleLowerCase() === "asc"){
    			/*오름차순*/
    			for(var k=0; k < dataProvider.length; k++){
					var item = dataProvider[k];
					//위치 조정중
					item.endPosition = item.startPosition + item.unitSize - 1; 
					
					//시작값이 있으면서 유닛 사이즈보다 시작값이 작고 1보다 큰수일경우에만
					if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.endPosition <= selectRack.unitSize && item.startPosition >= 1){
						var dupleCheck = false;
						for(var name in this.map){
							var startP = name;
							var endP = this.map[name];
							
							//기존에 있는 장비의 시작 위치와 종료 위치 안에 있다면
							if(startP <= item.startPosition && endP >= item.endPosition){
								
								//중복임을 표시하여 start end 변동이 없다.
								dupleCheck = true;
							
							//새로 들어온 장비의 시작위치는 정상이지만 종료 위치가 더 클경우 
							}else if(this.betweenCheck(startP, item.startPosition, endP) && endP < item.endPosition ){
								
								this.map[name] = item.endPosition;
								this.mapArr[name] = [];
								
								dupleCheck = true;
								
							//새로들어온 장비의 종료 위치는 포함 되지만 시작 위치가 벗어날을 경우
							}else if(startP > item.startPosition && this.betweenCheck(startP, item.endPosition, endP)){
								
								delete this.map[name];
								delete this.mapArr[name];
								
								this.map[item.startPosition] = endP;
								this.mapArr[item.startPosition] = [];
							
							//기존에 있던 장비들의 영역 보다 더 넓거나 같은 경우 덮어씌우기
							}else if(startP >= item.startPosition && endP <= item.endPosition){
								
								delete this.map[name];
								delete this.mapArr[name];
								
								this.map[item.startPosition] = item.endPosition;
								this.mapArr[item.startPosition] = [];
								
							}
							
						}
						
						if(!dupleCheck){
							this.map[item.startPosition] = item.endPosition;
							this.mapArr[item.startPosition] = [];
						}
						
					}
					
				}
    			
    			//area 재조정
    			this.validateCheck();
    			
    			//서버 범위에 해당 하는 item 분류
				for(var m=0; m < dataProvider.length; m++){
					var item = dataProvider[m];
					
					if(item.unitIndex === null){
						item.unitIndex = 0;
					}
					
					if(!item["w2ui"]){
						item["w2ui"] = {};
					}
					
					for(var name in this.map){
						var startP = name;
						var endP = this.map[name];
						
						if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.modelName !== null && $.trim(item.modelName) !== "" ){
							
							if(startP <= item.startPosition && endP >= item.endPosition){
								this.mapArr[name].push(item);
							}
							
							if(item.startPosition > 0 && item.endPosition <= selectRack.unitSize){
								item["w2ui"].style = "color:#c0c0c0";
							}else{
								item["w2ui"].style = "color:red";
							}
							
						}else{
							item["w2ui"].style = "color:red";
						}
					}
					
				}
				
				w2ui['unitTableDiv'].refresh();
				
				for(var name in this.mapArr){
					this.setPosition(this.mapArr[name]);
				}
				
				/*
				* 중복 계산 종료
				*/
    			
    		}else{
    			/*내림차순*/
    			
    			for(var k=0; k < dataProvider.length; k++){
					var item = dataProvider[k];
					item.endPosition = item.startPosition - item.unitSize + 1;
					
					if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.endPosition >= 1 && item.startPosition <= selectRack.unitSize){
						var dupleCheck = false;
						for(var name in this.map){
							var startP = name;
							var endP = this.map[name];
							
							//기존에 있는 장비의 시작 위치와 종료 위치 안에 있다면
							if(startP >= item.startPosition && endP <= item.endPosition){
								
								//중복임을 표시하여 start end 변동이 없다.
								dupleCheck = true;
								
							//새로 들어온 장비의 시작위치가 정상이며 종료 위치가 기존 종료 위치보다 크거나 같을 경우 (즉 중복 위치일 경우)
							}else if(this.betweenCheck(endP, item.startPosition, startP) && endP > item.endPosition ){
								
								this.map[name] = item.endPosition;
								this.mapArr[name] = [];
								
								dupleCheck = true;
							
							//새로들어온 장비의 종료 위치는 포함 되지만 시작 위치가 벗어날을 경우
							}else if(startP < item.startPosition && this.betweenCheck(endP, item.endPosition, startP)){
								
								delete this.map[name];
								delete this.mapArr[name];
								
								this.map[item.startPosition] = endP;
								this.mapArr[item.startPosition] = [];
								
								dupleCheck = true;
								
							//기존에 있던 장비들의 영역 보다 더 넓거나 같은 경우 덮어씌우기
							}else if(startP <= item.startPosition && endP >= item.endPosition){
								delete this.map[name];
								delete this.mapArr[name];
								
								this.map[item.startPosition] = item.endPosition;
								this.mapArr[item.startPosition] = [];
								
								dupleCheck = true;
								
							}
							
						}
						
						if(!dupleCheck){
							this.map[item.startPosition] = item.endPosition;
							this.mapArr[item.startPosition] = [];
						}
						
					}
					
				}
				
				this.validateCheck();
				
				//서버 범위에 해당 하는 item 분류
				for(var m=0; m < dataProvider.length; m++){
					var item = dataProvider[m];
					
					if(item.unitIndex === null){
						item.unitIndex = 0;
					}
					
					if(!item["w2ui"]){
						item["w2ui"] = {};
					}
					
					for(var name in this.map){
						var startP = name;
						var endP = this.map[name];
						
						if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.modelName !== null && $.trim(item.modelName) !== "" ){
							
							if(startP >= item.startPosition && endP <= item.startPosition){
								this.mapArr[name].push(item);
							}
							
							if(item.startPosition > selectRack.unitSize || item.endPosition < 1){
								item["w2ui"].style = "color:red";
							}else{
								item["w2ui"].style = "color:#c0c0c0";
							}
							
						}else{
							item["w2ui"].style = "color:red";
						}
					}
					
				}
				
				w2ui['unitTableDiv'].refresh();
				
				for(var name in this.mapArr){
					this.setPosition(this.mapArr[name]);
				}
				
				/*
				* 중복 계산 종료
				*/
    		}
    		
        },
        
        /*Start Position이 같을 경우 IDX 순으로 배치하기 위한 메소드*/
        setPosition : function(itemArr){
        	//오름 차순 정렬
			var lens = itemArr.length;
			
			itemArr.sort(function(a,b){
				return a.unitIndex < b.unitIndex ? -1 : a.unitIndex > b.unitIndex ? 1 : 0;  
			});
			
			for(var i=0; i < itemArr.length; i++){
				var item = itemArr[i];
				if(item.modelName){
					this.setServerPosition(item, i, lens);
				}
			}
        },
        
        /*
         * POPUP에서 실장 장비 등록 하는 과정
         * */
        setServerPosition : function(item, idx, lens){
        	var path =  "dist/models/"+item.modelName+"/";
        	var fileName = item.modelName+".babylon";
        	
        	this.popupAssetsManager.addMeshTask(item.modelName, "", path, fileName).onSuccess = function(task){
        		task.loadedMeshes.forEach(function(value, index){
        			var popupScene = sceneComp.popupScene;
        			var boxWidth = sceneComp.boxWidth;
        			var boxHeight = sceneComp.boxHeight;
        			var boxDepth = sceneComp.boxDepth;
        			var groups = sceneComp.popupLabelGroups;
        			var serverArr = sceneComp.popupServerArr;
        			var positionArr = sceneComp.popupPositionArr;
        			var lineArr = sceneComp.popupLineArr;
        			
        			value.id = value.name = item.assetId;
        			value.item = item;
        			/*차후에 EventFlug값으로 제어*/
        			value.isPickable = true;
        			value.isVisible = false;
        			value.show = true;
        			value.type = "SERVER";
        			
        			/*같은 모델의 Material은 인스턴스 개념으로 잡혀있기 때문에 그걸 끊어주는 작업*/ 
        			var mat = value.material.clone(value.id);
        			value.material = mat;
        			
        			value.actionManager = new BABYLON.ActionManager(popupScene);
        			value.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, value, "showBoundingBox", false));
        			value.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, value, "showBoundingBox", true));
        			value.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
        				if(evt.sourceEvent.button === 0){
        					var popupScene = sceneComp.popupScene;
        					var serverArr = sceneComp.popupServerArr;
        					var pickInfo = popupScene.pick(popupScene.pointerX, popupScene.pointerY);
        					
        					if(pickInfo.hit){
        						var selectItem = pickInfo.pickedMesh;
        						
        						for(var i=0; i < serverArr.length; i++){
        							var mesh = serverArr[i];
        							if(selectItem.id === mesh.id){
        								
        								/*선택이 안된 모든 서버는 제자리로*/
        								if(mesh.position.z === -0.5){
        									//팝업창의 Properties값 초기화
        									w2ui['properties'].init();
        									//선택된 상태에서 다시 선택 되었을 경우 모두 초기화
        									mesh.position.z = 0;
        									for(var j=0; j < serverArr.length; j++){
		        								var item = serverArr[j];
		        								item.visibility = 1;
		        							}
		        							
		        							break;
        									
        								}else{
		        							mesh.position.z = -0.5;
		        							mesh.visibility = 1;
		        							//Sever Click
		        							sceneComp.idc.modelClickHandler(mesh, 'POPUP');
		        						}
        								
        								
        								
        							}else{
        								mesh.position.z = 0;
		        						mesh.visibility = 0.7;
        							}
        						}
        					}
        				}
        			}));
        			
        			serverArr.push(value);
        			
        			//실제 삽입된 오브젝트 크기
        			var meshSize = value.getBoundingInfo().boundingBox.extendSize; 
        			//일차방정식을 이용해서 해당 크기에 맞게 조절 한다.
        			var scaleX = boxWidth/ (meshSize.x * 2)/ lens;
        			var scaleY = boxHeight / (meshSize.y * 2) * item.unitSize;
        			var scaleZ = boxDepth / (meshSize.z * 2);
        			
        			value.scaling = {x:scaleX, y:scaleY, z:scaleZ};
        			//0부터 시작 하면 -1 제거
        			value.position.y = positionArr[item.startPosition-1][0].y - (boxHeight * item.unitSize / 2);
        			value.position.x = positionArr[item.startPosition-1][1].x + (boxWidth/lens) * (idx+1)- (boxWidth/lens/2);
        			
        			var len = 0;
        			
        			if(sceneComp.idc.rackAlign.toLocaleLowerCase() === "asc"){
        				/*오름차순*/
        				len = item.startPosition + item.unitSize;
        				
    					//삽입된 장비의 Unit 라인을 지우는 작업
        				for(var i=item.startPosition; i <= len; i++){
    						if(i===item.startPosition){
    							groups[i-1].children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(0,255,255,1);
    						}else if(i === len){
    							//서버의 맨 윗줄과 맨 아랫줄은 색을 바꾸지 않는다.
    						}else{
    							lineArr[i-1].isVisible = false;
    							lineArr[i].show = false; //editor와 다르게 idc에서만 사용
    							groups[i-1].children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(0,255,255,1);
    						}
    					}
        			}else{
        				/*내림차순*/
        				len = item.startPosition - item.unitSize;
        				
        				//삽입된 장비의 Unit 라인을 지우는 작업
    					for(var i=item.startPosition; i >= len ; i--){
    						if(i===item.startPosition){
    							groups[i-1].children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(0,255,255,1);
    						}else if(i === item.startPosition-item.unitSize){
    							//서버의 맨 윗줄과 맨 아랫줄은 색을 바꾸지 않는다.
    						}else{
    							lineArr[i].isVisible = false;
    							lineArr[i].show = false; //editor와 다르게 idc에서만 사용
    							groups[i-1].children[0].children[0].defaultFontColor = sceneComp.util.getRGBAfunc(0,255,255,1);
    						}
    					}
        			}
        			
        		});
        	}
        	
        },
        
        /*
         * 자산(모델) 생성 구간 
         * */
        createModel : function(model, targetScene, sceneType){
        	var modelInfo = model;
        	var path =  "dist/models/"+modelInfo.modelName+"/";
        	var fileName = modelInfo.modelName+".babylon";
        	
        	/* data 형식
        	 * {compId:'C00001', modelName: 'building', modelType:'B', eventFlug:'Y', toolTipFlug:'Y', toolTipTxt : '충남교육청', assetId : 'A0001',
    			positionX:-30, positionY:138, positionZ:172, scaleX:1, scaleY:1, scaleZ:1, rotationX:0, rotationY:0, rotationZ:0, load:false}*/
        	
        	this.assetsManager.addMeshTask(modelInfo.modelName, "", path, fileName).onSuccess = function(task){
        		
        		task.loadedMeshes.forEach(function(value,idx){
        			value.id = modelInfo.assetId;
           			value.name = modelInfo.toolTipTxt;
           			value.toolTipTxt = modelInfo.toolTipTxt; //sub navi에서 사용
           			value.modelName = modelInfo.modelName;
           			value.isVisible =  false;
           			value.isPickable =  false;
           			
           			var position = new BABYLON.Vector3(modelInfo.positionX, modelInfo.positionY, modelInfo.positionZ);
           			value.position = position;
           			var rotation = new BABYLON.Vector3(modelInfo.rotationX, modelInfo.rotationY, modelInfo.rotationZ);
           			value.rotation = rotation;
           			 
           			var scale = new BABYLON.Vector3(modelInfo.scaleX, modelInfo.scaleY, modelInfo.scaleZ);
           			value.scaling = scale;
           			 
           			value.type = modelInfo.modelType;
           			 
           			if(modelInfo.toolTipFlug === 'Y'){
        	        	 value.toolTip = true;
        	         }else{
        	        	value.toolTip = false;
        	        }
           			 
           			if(value.material === null){
           				var matIm = new BABYLON.StandardMaterial("matIm", targetScene);
            			value.material = matIm;
           			}else{
           				var mat = value.material.clone(value.id);
                		value.material = mat;
           			}
           			
           			if(value.type === "ROOM"){
        				/**
        				 * 방화
        				 * */
        				//방화를 주기 위해 원래 Material 속성 저장
        				/*value.id = "room";*/
        				var fireMat = new BABYLON.StandardMaterial('fireMat', targetScene);
        				fireMat.diffuseColor = BABYLON.Color3.Red();
    					var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, targetScene); //texture size
    					fireMat.emissiveTexture = fireTexture;
    					fireMat.opacityTexture = fireTexture;
    					fireMat.backFaceCulling = false;
        				
        				//방화를 주기 위해 원래 Material 속성 저장
        				value.orgMaterial = value.material;
        				value.fireMaterial = fireMat;
        				
        				/**
        				 * 누수
        				 * */
        				var waterTopArr = sceneComp.waterTopArr;
        				var waterBottomArr = sceneComp.waterBottomArr;
        				var minimum = value.getBoundingInfo().minimum;
        				var maximum = value.getBoundingInfo().maximum;
        				
        				//상단 누수 경로 그리기
        				waterTopArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
        				waterTopArr.push(new BABYLON.Vector3(minimum.x, maximum.y, minimum.z));
        				waterTopArr.push(new BABYLON.Vector3(minimum.x, maximum.y, maximum.z));
        				waterTopArr.push(new BABYLON.Vector3(maximum.x, maximum.y, maximum.z));
        				waterTopArr.push(new BABYLON.Vector3(maximum.x, maximum.y, minimum.z));
        				
        				//하단 누수 경로 그리기
        				waterBottomArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
        				waterBottomArr.push(new BABYLON.Vector3(minimum.x, minimum.y, minimum.z));
        				waterBottomArr.push(new BABYLON.Vector3(minimum.x, minimum.y, maximum.z));
        				waterBottomArr.push(new BABYLON.Vector3(maximum.x, minimum.y, maximum.z));
        				waterBottomArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
        				
        				var waterMat = new BABYLON.StandardMaterial("waterMat", targetScene);
        				waterMat.alpha = 0.3;
        				waterMat.diffuseColor = sceneComp.util.getRGBAfunc(0, 252, 255);
        				waterMat.backFaceCulling = false;
        				
        				sceneComp.waterTop = new BABYLON.Mesh.CreateTube("waterTop", waterTopArr, 3, 4, null, 0, targetScene, false, BABYLON.Mesh.FRONTSIDE);
        				sceneComp.waterBottom = new BABYLON.Mesh.CreateTube("waterBottom", waterBottomArr, 3, 4, null, 0, targetScene, false, BABYLON.Mesh.FRONTSIDE);
        				
        				var waterTop = sceneComp.waterTop;
        				var waterBottom = sceneComp.waterBottom;
        				
        				waterTop.material = waterBottom.material = waterMat;  
        			  	waterTop.convertToFlatShadedMesh();
        			  	waterBottom.convertToFlatShadedMesh();
        			  	waterTop.isVisible = waterBottom.isVisible = false;
        			  	waterTop.isPickable = waterBottom.isPickable = false;
        			  	waterTop.type = waterBottom.type = "waterLeak";
        			  	
        			 }else if(value.type === "TEMPER"){
         			  	/**
         				 * 항온/항습
         				 * */
        				var tMat = new BABYLON.StandardMaterial("tMat", targetScene);
        				tMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        				tMat.specularColor = new BABYLON.Color3(1, 1, 1);
        				tMat.emissiveColor = sceneComp.util.getRGBAfunc(0,150,255);
        				tMat.alpha = 0.8;
        				value.material = tMat;
        				
        				sceneComp.temperArr.push(value);
        			 }
           			
           			value.actionManager = new BABYLON.ActionManager(targetScene);
    	        	value.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, value, "showBoundingBox", false));
    	        	value.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, value, "showBoundingBox", true));
    	        	
    	        	if(modelInfo.eventFlug === 'Y'){
    	        		
    	        		value.eventFlug = true;
	       				value.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
	       				 
	       					 if(evt.sourceEvent.button === 0){
	       						 //왼쪽 버튼 클릭 시
	       						 var type = value.type;
	       						 switch(type){
		        						 case "BUILDING":
		        						 case "FLOOR":
		        							 if(type=="BUILDING"){
		        								 sceneComp.floorID = value.id;
		        							 }
		        							 //sceneComp.disposeLabel();
		        							 sceneComp.idc.modelClickHandler(value);
		        							 break;
		        						 default :
		        							 //console.log("자산 클릭");
		        							 break;
	       						 }
	       					 }
	       				 }));
       				 
	       			 }else{
	       				 value.eventFlug = false;
	       			 }
    	        	 
        		});
        		
        	}
        	
        	this.assetsManager.onFinish  = function(task){
        		
        		sceneComp.engine.runRenderLoop(function () {
            		sceneComp.scene.render();
                });
        		
        		switch(sceneType){
		   			 case 'building' :
		   			 	 sceneComp.arcAnimation(1, targetScene, sceneType); 
		   			 	break;
		   			 case 'floor' :
		   			 case 'room' :
		   				 sceneComp.arcAnimation(3, targetScene, sceneType); 
		   				 break;
		   			 default :
		   				 alert("등록되지 않는 케이스 입니다.");
		   			 	 break;
					 }
	        }
        	
        },
        
        /*
         * 카메라 애니메이션
         * */
        arcAnimation : function(fps, currentScene, sceneType){//speed, scene, "type"
        	 var toAlpha = 1;
        	 var toBeta = 1;
        	 var toRadius = 1;
        	 var currentCamera = currentScene.cameras[0];
        	 
        	 var animCamAlpha = new BABYLON.Animation("animCam", "alpha", 30,
                     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

			 var keysAlpha = [];
			 
			 keysAlpha.push({
				 frame: 0,
				 value: toAlpha
			 });
			 
			 keysAlpha.push({
				 frame: 100,
				 value: currentCamera.alpha
			 });
			
			 var animCamBeta = new BABYLON.Animation("animCam", "beta", 30,
			                     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			                     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			 var keysBeta = [];
			 
			 keysBeta.push({
				 frame: 0,
				 value: toBeta
			 });
			 
			 keysBeta.push({
				 frame: 100,
				 value: currentCamera.beta
			 });
			
			 var animCamRadius = new BABYLON.Animation("animCam", "radius", 30,
			                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
			 var keysRadius = [];
			 
			 keysRadius.push({
				 frame: 0,
				 value: toRadius
			 });
			 keysRadius.push({
				 frame: 100,
				 value: currentCamera.radius
			 });
			
			 animCamAlpha.setKeys(keysAlpha);
			 animCamBeta.setKeys(keysBeta);
			 animCamRadius.setKeys(keysRadius);
			 
			 currentCamera.animations.push(animCamAlpha);
	         currentCamera.animations.push(animCamBeta);
	         currentCamera.animations.push(animCamRadius);
	         
	         currentScene.beginAnimation(currentCamera, 0, 1, false, 1, function () {
	        	 
	        	 if(sceneType !=="popup"){ 
	        		 currentScene.meshes.forEach(function(value,idx){
	            		 if(value.type ==="waterLeak"){
	            			 value.isVisible = false;
	        			 }else{
	        				 value.isVisible = true;
	        			 }
		        	 }); 
	        	 }else{
	        		 //POPUP일 경우 
	        		 var selectItem = w2popup.get().param;
	        		 
	        		 currentScene.meshes.forEach(function(value, idx){
	        			 //console.log(selectItem);
	        			 if(value.show){
	        				 value.isVisible = true;
	        			 }else{
	        				 value.isVisible = false;
	        			 }
	        		 });
	        		 
	        		 
	        	 }
	        	 
	        	 currentScene.beginAnimation(currentCamera, 1, 100, false, fps, function () {
	        		 currentScene.meshes.forEach(function(value,idx){
	        			if(value.eventFlug){
	        				value.isPickable = true;
	        			}
	        		 });
	        		 
	        		 if(sceneType !=="popup"){ 
	        				//POPUP이 아닐경우에만 라벨 보이기
	        				currentScene.forceWireframe = false;
	        				
	        				if(sceneType === "room"){
		            			 for(var i=0; i < currentScene.meshes.length; i++){
		            				 var mesh = currentScene.meshes[i];
		            				 if(mesh.type === "TEMPER"){
		            					 sceneComp.createTemperLabel(currentScene);
		            					 break;
		            				 }
		            			 }
		            		 }
	        				
	        				sceneComp.createLabel(currentScene);
	        				//완료 메세지
	        				sceneComp.idc.createComplete(sceneType);
	        		}
	        	 });
	        	 
	        	
	         });
        },
        
        createTemperLabel : function(currentScene){
        	this.canvasTemper2D = new BABYLON.ScreenSpaceCanvas2D(currentScene, {
    	        id: "temperCanvas"
    	    });
        	
        	this.temperLabelGroup = [];
        	
        	for(var i=0; i < this.temperArr.length; i ++){
        		var temp = this.temperArr[i];
        		var str = "0℃  0%";
    			var txtLength = str.length * 8 + 25;
    			var positionX = Math.round(txtLength/2)*-1;
    			var positionY = Math.round(temp.getBoundingInfo().boundingBox.maximum.y)+0;//20
    			
    			this.temperLabelGroup.push(new BABYLON.Group2D({
    				parent: this.canvasTemper2D, id:"temper_"+temp.id, width:80, height:40, trackNode:temp,
    				children: [
    	                new BABYLON.Rectangle2D({ id: temp.id+"#"+i, width: txtLength, height: 26, x: positionX, isPickable:false,
    	                y: positionY, origin: BABYLON.Vector2.Zero(), 
    	                border: "#ffffffFF", fill: "#000000FF", opacity:0.2, roundRadius: 3, borderThickness:2, children: [
    	                        new BABYLON.Text2D(str, {marginAlignment: "h:center, v:center", 
    	                        fontName: "bold 12px Arial", defaultFontColor:new BABYLON.Color4(255,255,255,1)})
    	                    ]
    	                })
    	            ]
    			}));
        	}
        },
        
        disposeTemperLabel : function(){
        	for (var g = 0; g < this.temperLabelGroup.length; g++) {
        		this.temperLabelGroup[g].dispose();
    		}
    		
        	if(this.canvasTemper2D){
        		this.canvasTemper2D.dispose();
        	}
        	
    		this.temperLabelGroup = [];
        },
        
        temperSeverityCheck : function(dataProvider){
        	for(var j=0; j < dataProvider.length; j++){
    			var meshItem = this.scene.getMeshByID(dataProvider[j].id);
    			
    			if(meshItem){
    				
    				if(dataProvider[j].severity === 1){
        				meshItem.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
        			}else{
        				meshItem.material.emissiveColor = this.getSeverity(dataProvider[j].severity);
        			}
    				
        			
        			//온습도 라벨
    				if(this.temperLabelGroup.length > 0){
    					for(var k=0; k < this.temperLabelGroup.length; k++){
            				if(dataProvider[j].id === this.temperLabelGroup[k].id.split("_")[1]){
            					this.temperLabelGroup[k].children[0].children[0].text = dataProvider[j].temper +"℃ "+ dataProvider[j].hu+"%";
            				}
            			}
    				}
        			
    			}
    			
    		}
        },
        
        severityCheck : function(dataProvider, sceneType){
        	
        	var currentScene = null;
        	
        	if(sceneType === "popup"){
        		currentScene = this.popupScene;
        	}else{
        		currentScene = this.scene;
        	}
        	
        	_.each(_.filter(currentScene.meshes, function(obj){
        		return obj.eventFlug === true;
        	}), function(obj){
        		sceneComp.stopAni(obj, currentScene);
        		obj.material.diffuseColor = sceneComp.getSeverity(1);
        	});
        	
        	for(var i=0; i < dataProvider.length; i++){
        		var mesh = currentScene.getMeshByID(dataProvider[i].name);
        		
        		if(mesh){
        			if(mesh.id === dataProvider[i].name){
            			mesh.material.diffuseColor = this.getSeverity(dataProvider[i].severity);
    					
    					if(dataProvider[i].severity === 5){
    	        			this.playAni(mesh, currentScene);
    	        		}
            		}
        		}
        		
        	}
        },
        
        /*
         * Severity Play Animation 
         * */
        playAni : function(meshItem, currentScene){
        	var currentColor = meshItem.material.diffuseColor;
        	
        	var rKeys = [
				{frame:0, value:currentColor.r},
				{frame:10, value:1},
				{frame:20, value:currentColor.r}
			];
		
			var gKeys = [
					{frame:0, value:currentColor.g},
					{frame:10, value:1},
					{frame:20, value:currentColor.g}
				];
			
			var bKeys = [
					{frame:0, value:currentColor.b},
					{frame:10, value:1},
					{frame:20, value:currentColor.b}
				];
			
			var severityAni_r = new BABYLON.Animation("severityAni_r", "material.diffuseColor.r", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			var severityAni_g = new BABYLON.Animation("severityAni_g", "material.diffuseColor.g", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			var severityAni_b = new BABYLON.Animation("severityAni_b", "material.diffuseColor.b", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
			
			severityAni_r.setKeys(rKeys);
			severityAni_g.setKeys(gKeys);
			severityAni_b.setKeys(bKeys);
			
			if(meshItem.animations.length === 0){
				meshItem.animations.push(severityAni_r);
				meshItem.animations.push(severityAni_g);
				meshItem.animations.push(severityAni_b);
			}
			
			currentScene.beginAnimation(meshItem, 0, 20, true);
        },
        
        /*
         * Severity Stop Animation 
         * */
        stopAni : function(meshItem, currentScene){
        	currentScene.stopAnimation(meshItem, "severityAni_r");
        	currentScene.stopAnimation(meshItem, "severityAni_g");
        	currentScene.stopAnimation(meshItem, "severityAni_b");
        },
        
        getSeverity : function(val){
        	var color = null;
        	switch(val){
	        	case 1:
	        		color = this.util.getRGBAfunc(255,255,255);
	        		break;
	        	case 2:
	        		color = this.util.getRGBAfunc(0,255,0);
	        		break;
	        	case 3:
	        		color = this.util.getRGBAfunc(255,246,0);
	        		break;
	        	case 4:
	        		color = this.util.getRGBAfunc(255,108,0);
	        		break;
	        	case 5:
	        		color = this.util.getRGBAfunc(255,30,0);
	        		break;
        	}
    		return color;
        },
        
        /*
         * Scene Label 생성
         * */
        createLabel : function(currentScene){
        	this.canvas2D = new BABYLON.ScreenSpaceCanvas2D(currentScene, {
    	        id: "ScreenCanvas"
    	    });
        	
        	this.labelGroups = [];
        	
        	var assetList = this.scene.meshes;
        	
        	for (var i = 0; i < assetList.length; i++) {
        		var cube = assetList[i];
        		if(cube.toolTip){
        			
        			var txtLength = 0;
        			if(cube.type === 'RACK'){
        				txtLength = cube.name.length * 8 + 30;
        			}else{
        				txtLength = cube.name.length * 8 + 25;
        			}
        			
        			txtLength = cube.name.length * 8 + 30;
        			var labelPosition = cube.labelPosition;
        			var positionX = Math.round(txtLength/2)*-1;
        			var positionY = 0;
        			
        			//차후에 수정하기 위해 영역만 구분함.
        			switch(labelPosition){
        				case "top":
        					positionY = Math.round(cube.getBoundingInfo().boundingBox.maximum.y)+lineHeight ;
        					break;
        				case "left": 
        					positionY = Math.round(cube.getBoundingInfo().boundingBox.maximum.y/2);
        					break;
        				case "right":
        					positionY = Math.round(cube.getBoundingInfo().boundingBox.maximum.y/2);
        					break;
        				case "bottom":
        					positionY = cube.getBoundingInfo().boundingBox.minimum.y;
        					break;
        			}
        			
        			var child = new BABYLON.Group2D({
        				parent: this.canvas2D, id: "GroupTag#" + cube.id, width: txtLength, height: 40, trackNode:cube, 
        				children: [
    		                new BABYLON.Rectangle2D({id: cube.id+"#"+i, width: txtLength, height: 26, x: positionX, isPickable:true,
    		                y: positionY, origin: BABYLON.Vector2.Zero(), 
    		                border: "#ffffffFF", fill: "#000000FF", opacity:0.4, roundRadius: 3, borderThickness:2, children: [
    		                        new BABYLON.Text2D(cube.name, { marginAlignment: "h:center, v:center", 
    		                        fontName: "bold 12px Arial", defaultFontColor:new BABYLON.Color4(255,255,255,1)})
    		                    ]
    		                })
    		            ]
        			});
        			
        			this.labelGroups.push(child);
        			/*fontname : normal 12px Segoe UI  // bold 12px Arial //12pt Lucida Console*/
        		}
        	}
        	
        	
        },
        
        /*
         * 누수 발생
         * */
        waterLeakOccurrence : function(value, type){ //배열, 상단 or 하단
        	if(value.length > 0){
        		this.waterTop.isVisible = this.waterBottom.isVisible = true;
        		
        		var realSizeArr = [200,50,200,50]; //실제 사이즈 넣기
        		
        		var pathArr = [];
        		
        		if(type ==="top"){
        			
        			pathArr = this.waterTop.path3D.path;
        			
        			this.removeWaterLabel("top");
    		  		
    		  		this.canvas2dTop = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
    	    	        id: "canvas2dTop"
    	    	    });
    		  		
        		}else{
        			
        			pathArr = this.waterBottom.path3D.path;
        			
        			this.removeWaterLabel("bottom");
    		  		
        			this.canvas2dBottom = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
    	    	        id: "canvas2dBottom"
    	    	    });
        		}
        		
        		//배열이 아닌값이 들어오면 반환
        		if(!Array.isArray(value)){
    		  		return;
    		  		//alert("입력값을 확인해 주세요");
    		  	}
        		
        		//위치 계산
        		var waterValue = 0; //누수 발생 지점;
        		
        		for(var j=0; j < value.length; j++){
        			waterValue = value[j];
        			var box = BABYLON.MeshBuilder.CreateBox(type+"Box"+j, {width:2, height:5}, sceneComp.scene );
    		  		box.isVisible = false;
    		  		
    		  		if(type === "top"){
    		  			this.topBoxArr.push(box);
    		  		}else{
    		  			this.bottomBoxArr.push(box);
    		  		}
    		  		
    		  		//console.log("waterValue : " + waterValue);
    		  		
    		  		var sum = 0; //next 까지 거리 합산
    			  	var realSum = 0; //next 까지 실제 거리 합산
    			  	var currentSum = 0; //현재까지 3D 거리
    			  	var realCurrentSum = 0; //현재까지 실제 거리
    			  	
    			  	for(var i=1; i < pathArr.length; i++){
    			  		//이전위치
			  			var preX = pathArr[i-1].x; 
			  			var preZ = pathArr[i-1].z;
			  			//현재위치
			  			var currentX = pathArr[i].x;
			  			var currentZ = pathArr[i].z;
			  			var realSize = realSizeArr[i-1]; //실제 거리
			  			realSum += realSize; //지나온 거리 합계
			  			
			  			var tempX = Math.abs(currentX - preX);
			  			var tempZ = Math.abs(currentZ - preZ);
			  			
			  			//전위치와 현재위치간의 거리를 담는 임시 변수
			  			var imsiSum = Math.sqrt((tempX*tempX)+(tempZ*tempZ));
			  			//3D 상의 누수길이 합계
			  			sum += Math.abs(imsiSum); 
			  			
			  			//현재구간비율
						var ratio = Math.abs(imsiSum) / realSize;
						
						if(waterValue > realSum){
							currentSum = sum;
	  						realCurrentSum = realSum;
	  						continue; //지금까지 온 길이보다 크다면 패스
						}else{
							//가야할 거리
							var m = (waterValue-realCurrentSum)*ratio;
							//나머지 거리
	  						var n = sum-currentSum-m;
	  						
	  						var targetX = (preX*n+currentX*m)/(m+n);
	  						var targetZ = (preZ*n+currentZ*m)/(m+n);
	  						
	  						var pos = new BABYLON.Vector3(targetX, pathArr[i].y, targetZ);
	  						box.position = pos;
	  						
	  						var xCanvas = null;
				        	var labelName = "";
				        	if(type ==="top"){
				        		xCanvas = this.canvas2dTop;
				        		labelName = "상단 누수발생 ";
				        	}else{
				        		xCanvas = this.canvas2dBottom;
				        		labelName = "하단 누수발생 ";
				        	}
				        	
				        	var title = labelName + waterValue + "m";
							var txtLength = title.length * 8 + 25;
				        	var positionX = Math.round(txtLength/2)*-1;
				        	var positionY = box.getBoundingInfo().boundingBox.minimum.y;
				        	
				        	var waterLabel = new BABYLON.Group2D({
					            parent: xCanvas, id: "box #"+box.name+j , width: txtLength, height: 40, trackNode: box, 
					            children: [
					                new BABYLON.Rectangle2D({ id: box.name+"#"+j, width: txtLength, height: 26, x: positionX, isPickable:true,
					                y: positionY, origin: BABYLON.Vector2.Zero(), 
					                border: "#ffffffFF", fill: "#ff0000FF", opacity:0.5, roundRadius: 3, borderThickness:2, children: [
					                        new BABYLON.Text2D(title, { marginAlignment: "h:center, v:center", 
					                        fontName: "bold 12px Arial", defaultFontColor:new BABYLON.Color4(255,255,255,1)})
					                    ]
					                })
					            ]
					        });
				        	
				        	/*
	  						* 상하단 분리 작업
	  						*/
	  						if(type ==="top"){
								this.topLabelArr.push(waterLabel);
	  						}else{
	  							this.bottomLabelArr.push(waterLabel);
	  						}
							
							this.particleCreate(box);
	  						
	  						break;
						}
    			  	}// for i 종료
    			  	
    			  	//누수 센서 길이 보다 누수 지점길이가 더 클 경우 경고창 발생
    			  	if(waterValue > realSum){ 
    			  		alert(type+" 입력값 : "+waterValue + " > 총길이 :" + realSum);
    			  	}
    			  	
        		}//for j 종료
        		
        	}else{
        		//정상일경우
    			if(type ==="top"){
    				removeWaterLabel("top");
    			}else{
    				removeWaterLabel("bottom");
    			}
        	}
        	
        },
        
        //누수 라벨 지우기
        removeWaterLabel : function(type){
        	if(typeof(type) === "undefined") type = "all";
    		
    		if(type ==="top" || type === "all"){
    			if(this.canvas2dTop !== null){
    				this.canvas2dTop.dispose();
    	    	}
    			this.undefinedCheck(this.topBoxArr);
    			this.undefinedCheck(this.topLabelArr);
    		}
    		
    		if(type ==="bottom" || type === "all"){
    			if(this.canvas2dBottom !== null){
    				this.canvas2dBottom.dispose();
    	    	}
    			this.undefinedCheck(this.bottomBoxArr);
    			this.undefinedCheck(this.bottomLabelArr);
    		}
        },
        
        //누수 Canvas2D 지우기
        undefinedCheck : function(arr){
        	if(typeof(arr) !=="undefined"){
    			for(var i=0; i< arr.length; i++){
    				arr[i].dispose();
    			}
    			
    			arr = [];
    		}
        },
        
        resetCamera : function(value){
        	if(value === "popup"){
        		this.popupCamera.radius = this.popupCurrentCamera.radius;
            	this.popupCamera.beta = this.popupCurrentCamera.beta;
            	this.popupCamera.alpha = this.popupCurrentCamera.alpha;
            	this.popupCamera.target = new BABYLON.Vector3(this.popupCurrentCamera.targetX, this.popupCurrentCamera.targetY, this.popupCurrentCamera.targetZ);
        	}else{
        		this.camera.radius = this.currentCamera.radius;
            	this.camera.beta = this.currentCamera.beta;
            	this.camera.alpha = this.currentCamera.alpha;
            	//this.camera.setPosition(new BABYLON.Vector3(this.currentCamera.positionX, this.currentCamera.positionY, this.currentCamera.positionZ)); 
            	this.camera.target = new BABYLON.Vector3(this.currentCamera.targetX, this.currentCamera.targetY, this.currentCamera.targetZ);
        	}
        	 
        },
        
        particleCreate : function(mesh){
        	var particleSystem = new BABYLON.ParticleSystem("particles", 1000, sceneComp.scene);
        	//Texture of each particle
    	    particleSystem.particleTexture = new BABYLON.Texture("dist/img/idc/texture/flare.png", sceneComp.scene);
    	    
    	    // Where the particles come from
    	    particleSystem.emitter = mesh; // the starting object, the emitter
    	    particleSystem.minEmitBox = new BABYLON.Vector3(0, 20, 0); // Starting all from
    	    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 1, 0); // To...
    	    
    	    particleSystem.color1 = new BABYLON.Color4(0, 1, 1, 1);
    	    particleSystem.color2 = new BABYLON.Color4(0, 0, 1, 1);
    	    //particleSystem.colorDead = new BABYLON.Color4(0, 0, 1, 0.5);
    	    
    	    // Size of each particle (random between...
    	    particleSystem.minSize = 0.5;
    	    particleSystem.maxSize = 3;

    	    // Life time of each particle (random between...
    	    particleSystem.minLifeTime = 0.3;
    	    particleSystem.maxLifeTime = 1.5;

    	    // Emission rate
    	    particleSystem.emitRate = 1500;

    	    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    	    //particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    	    // Set the gravity of all particles
    	    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    	    // Direction of each particle after it has been emitted
    	    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
    	    particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

    	    // Angular speed, in radians
    	    particleSystem.minAngularSpeed = 0;
    	    particleSystem.maxAngularSpeed = Math.PI;

    	    // Speed
    	    particleSystem.minEmitPower = 1;
    	    particleSystem.maxEmitPower = 3;
    	    particleSystem.updateSpeed = 0.03;
    	    
    	    // Start the particle system
    	    particleSystem.start();
        },
        
        setIdc: function(idc){
        	this.idc = idc;
        },
        
        setData : function(value){
        	if(this.dataProvider){
        		this.dataProvider = null;
        	}
        	this.dataProvider = value;
        },
        
        getData : function(){
        	return this.dataProvider;
        }
        
    }
    
Idc3DLoader.prototype.util = {
    	/*두개의 배열을 입력 받아 비교하는 메소드 입니다.*/
		compare : function(a,b){
			var i = 0, j;
			  if(typeof a == "object" && a){
			    if(Array.isArray(a)){
			      if(!Array.isArray(b) || a.length != b.length) return false;
			      for(j = a.length ; i < j ; i++) if(!this.compare(a[i], b[i])) return false;
			      return true;
			    }else{
			      for(j in b) if(b.hasOwnProperty(j)) i++;
			      for(j in a) if(a.hasOwnProperty(j)){
			        if(!this.compare(a[j], b[j])) return false;
			        i--;
			      }
			      return !i;
			    }
			  }
			  return a === b;
    	},
    	
    	getRGBAfunc : function(r, g, b, a){
    		var s = 255;
    		var valueR = r/s;
    		var valueG = g/s;
    		var valueB = b/s;
    		
    		var color = null;
    		
    		if(a !== undefined){
    			color = new BABYLON.Color4(valueR, valueG, valueB, a);
    		}else{
    			color = new BABYLON.Color3(valueR, valueG, valueB);
    		}
    		
    		return color;
    	}
    	
    	
    }
    