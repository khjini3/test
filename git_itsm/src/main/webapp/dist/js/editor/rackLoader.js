function Rack3DLoader(canvasName) {
	/**
     * Create by 김현진
     * Rack Editor Variable Setting
     * */
	this.canvas = document.querySelector(canvasName);
	this.engine = new BABYLON.Engine(this.canvas, true);
	this.scene = new BABYLON.Scene(this.engine);
	
	this.assetsManager = null;
	this.subAssetsManager = null;
	
	/*
	 * Rack Line 관련 
	 * */
	this.canvas2D = null; //Rack Num Canvas
	this.groups = []; //rack Num label
	this.lineArr = [];
	this.spheresArr = [];
	this.positionArr = [];
	this.serverArr = []; //Server List
	
	this.canvasLabel = null; //Server Name Canvas
	this.labelGroups = []; //Server Name Label
	
	this.currentCamera = {};
	
	//Unit Size
	this.boxWidth=0;
	this.boxHeight = 0;
	this.boxDepth = 0;
	
	this.map = {};
	this.mapArr = {};
	
	/*서버 생성 여부*/
	this.xFlug = false;
	
	/*********************/
	
	this.init();
}

Rack3DLoader.prototype = {
		
		init : function(){
			var _this = this;
			
			window.addEventListener("resize", function () {
                 _this.engine.resize();
            });
		},
		
		initRackEditor : function(){
			this.scene = new BABYLON.Scene(this.engine);
			var sceneRender = this.scene.getBoundingBoxRenderer();
        	sceneRender.showBackLines = false;
        	sceneRender.frontColor = this.getRGBAfunc(234, 255, 0);
        	this.assetsManager = new BABYLON.AssetsManager(this.scene);
        	
        	this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
        	var camera = this.camera;
        	camera.setPosition(new BABYLON.Vector3(3, 2, -8));
    		
        	camera.radius = 10;
        	
        	camera.wheelPrecision = 20; 
    		camera.lowerRadiusLimit = 5;
    		camera.upperRadiusLimit = 20;
    		camera.wheelPrecision = 50;
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
    		
    		this.scene.activeCamera.panningSensibility  = 1000;
    		
    		var baseLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
    		
    		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), this.scene);
    		light.intensity = 0.8;
    		
    		this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.1);
    		
    		this.scene.registerBeforeRender(function () {
        		light.position = camera.position;
        	});
    		
    		this.createGround();
    		
    		this.createRackEditor();
		},
		
		resetCamera : function(){
			this.camera.radius = this.currentCamera.radius;
        	this.camera.beta = this.currentCamera.beta;
        	this.camera.alpha = this.currentCamera.alpha;
        	this.camera.target = new BABYLON.Vector3(this.currentCamera.targetX, this.currentCamera.targetY, this.currentCamera.targetZ);
		},
		
		createGround : function(){
			var ground = BABYLON.MeshBuilder.CreateGround("ground", {
		        width: 4000,
		        height: 4000
		    }, this.scene);
			
			var groundMaterial = new BABYLON.GridMaterial("groundMaterial", this.scene);
			groundMaterial.majorUnitFrequency = 5;
			groundMaterial.minorUnitVisibility = 0.45;
			groundMaterial.gridRatio = 3;
			groundMaterial.backFaceCulling = false;
			groundMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
			groundMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);;
			groundMaterial.opacity = 0.98;
			
			ground.material = groundMaterial;
			ground.id = "ground";
			ground.isPickable = false;
			ground.isVisible = true;
			
			ground.position.y = -3.24;
		},
		
		createRackEditor : function(){
			var path =  "dist/models/rackFrame/";
        	var fileName = "rackFrame.babylon";
        	
        	BABYLON.SceneLoader.ImportMesh("", path, fileName, this.scene, function(meshes) {
        		var rackFrame = meshes[0];
        		rackFrame.id = "rackFrame";
        		rackFrame.type = "rackFrame";
        		that.elements.sceneComp.assetsManager.load();
        	});
        	
        	var engine = this.engine;
        	var scene = this.scene;
        	
    		this.assetsManager.onFinish  = function(task){
    			engine.runRenderLoop(function () {
    				scene.render();
        		});
        	}
        	
		},
		
		disposeGUI : function(){
			for(var m=this.scene.meshes.length-1; m >= 0; m--){
				var mesh = this.scene.meshes[m];
				
				if(mesh.id!=="rackFrame" && mesh.id!=="ground"){
					this.scene.removeMesh(mesh);
				}
			}
			
			for(var g = 0; g < this.groups.length; g++) {
				this.groups[g].dispose();
			}
			
			for(var i = 0; i < this.lineArr.length; i++) {
				this.lineArr[i].dispose();
			}
			
			for(var j = 0; j < this.spheresArr.length; j++) {
				this.spheresArr[j].dispose();
			}
			
			for(var k=0; k < this.serverArr.length; k++){
				this.serverArr[k].dispose();
			}
			
			if(typeof(canvas2D) !=="undefined"){
				this.canvas2D.dispose();
			}
			
			this.groups = [];
			this.lineArr = [];
			this.spheresArr = [];
			this.positionArr = [];
			
			this.serverArr = [];
		},
		
		rackInit : function(){
			this.disposeLabel();//Server Label
			this.disposeGUI();
			this.resetCamera();
			$("#parameter_Opacity").attr('disabled', true);
		},
		
		lineAlphaProc : function(value){
			console.log(value);
			_.each(this.lineArr, function(field){
				if(field.isVisible){
					field.alpha = value;
				}
			});
		},
		
		createRackInLine : function(item){
			this.xFlug = false;
			
			$("#showName").attr("checked", false);
			$("#showName").attr('disabled', true);
			
			this.disposeLabel();//Server Label
			this.disposeGUI();
			
			this.canvas2D = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
		        id: "ScreenCanvas"
		    });
			
			var rackFrame = this.scene.getMeshByID("rackFrame");
			
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
			
			var gap = (maximum.y - minimum.y) / lineCount;
			
			//that.rackAlign = "asc"; 
			
			if(that.rackAlign.toLocaleLowerCase() === "asc"){
				//오름 차순
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
					
					this.positionArr.push(rackArr);
					
					var lines = BABYLON.Mesh.CreateLines("lines"+i, rackArr, this.scene);
					lines.color = new BABYLON.Color3(1, 1, 0);
					lines.isPickable = false;
					this.lineArr.push(lines);
					
					var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.scene);
					sphere.position = new BABYLON.Vector3(minimum.x, maximum.y, minimum.z);
					sphere.isVisible = false;
					sphere.isPickable = false;
					this.spheresArr.push(sphere);
					
					var txtLength = i.toString.length * 8 + 25;
					var positionX = minimum.x-40;
		        	var positionY = sphere.getBoundingInfo().boundingBox.maximum.y-20; 
		        	
		        	ascNum +=1;
					this.groups.push(new BABYLON.Group2D({
			            parent: this.canvas2D, id: "frame#"+ i, width: 80, height: 40, trackNode: sphere, 
			            children: [
			                new BABYLON.Rectangle2D({ id: "frame#line"+i, width: txtLength, height: 20, x: positionX, isPickable:true,
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
						
						var lines = BABYLON.Mesh.CreateLines("lines", rackArr, this.scene);
						lines.color = new BABYLON.Color3(1, 1, 0);
						lines.isPickable = false;
						this.lineArr.push(lines);
						
						var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.scene);
						sphere.position = new BABYLON.Vector3(minimum.x, maximum.y, minimum.z);
						sphere.isVisible = false;
						sphere.isPickable = false;
						this.spheresArr.push(sphere);
					}
				}
				
			}else{
				//내림차순
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
						
						var lines = BABYLON.Mesh.CreateLines("lines", rackArr, this.scene);
						lines.color = new BABYLON.Color3(0, 1, 0);
						lines.isPickable = false;
						this.lineArr.push(lines);
					}
					
					minimum.y += gap;
					
					var rackArr = [];
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, minimum.z));
					rackArr.push(new BABYLON.Vector3(minimum.x, minimum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, maximum.z));
					rackArr.push(new BABYLON.Vector3(maximum.x, minimum.y, minimum.z));
					
					this.positionArr.push(rackArr);
					
					var lines = BABYLON.Mesh.CreateLines("lines"+i, rackArr, this.scene);
					lines.color = new BABYLON.Color3(0, 1, 0);
					lines.isPickable = false;
					this.lineArr.push(lines);
					
					var sphere = BABYLON.Mesh.CreateSphere("sphere"+i, 16, 0.1, this.scene);
					sphere.position = new BABYLON.Vector3(minimum.x, minimum.y, minimum.z);
					sphere.isVisible = false;
					sphere.isPickable = false;
					this.spheresArr.push(sphere);
					
					var txtLength = i.toString.length * 8 + 25;
					var positionX = minimum.x-40;
		        	var positionY = sphere.getBoundingInfo().boundingBox.minimum.y-20; 
		        	
					this.groups.push(new BABYLON.Group2D({
			            parent: this.canvas2D, id: "frame#"+ i, width: 80, height: 40, trackNode: sphere, 
			            children: [
			                new BABYLON.Rectangle2D({ id: "frame#line"+i, width: txtLength, height: 20, x: positionX, isPickable:true,
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
			
		},
		
		//Rack안에 실장 장비 지우기
		disposeRackIn : function(){
			
			for(var k=0; k < this.serverArr.length; k++){
				this.serverArr[k].dispose();
			}
			
			this.serverArr = [];
			
			w2ui["rackEditor_server_properties"].clear();
		},
		
		//Position Label 색상 초기화
		lineInit : function(){
			for(var i=0; i < this.groups.length; i++){
				var item = this.groups[i];
				item.children[0].children[0].defaultFontColor = this.getRGBAfunc(255,255,255,1);
			}
			
			for(var j=0; j < this.lineArr.length; j++){
				var line = this.lineArr[j];
				line.isVisible = true;
			}
		},
		
		betweenCheck : function(start, middle, end){
			if(start <= middle && middle <= end){
				return true;
			}else{
				return false;
			}
		},
		
		validateCheck : function(){
			var arr = [];
			
			if(that.rackAlign.toLocaleLowerCase() === "asc"){
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
			
			for (var i=0; i < arr.length; i++){
				var delNum = arr[i];
				
				delete this.map[delNum];
				delete this.mapArr[delNum];
			}
			
		},
		
		generateServer : function(){
			
			this.xFlug = true;
			
			this.subAssetsManager = new BABYLON.AssetsManager(this.scene);
			
			$("#showName").attr('disabled', false);
			
			var dataProvider = [];
			var w2Data =  w2ui["rackInGrid"].records;
			
			//getChanges()를 유지 하기 위해서 해당 데이터를 복사해서 사용함.
			for(var i=0; i < w2Data.length; i++){
				
				var im = _.clone(w2Data[i]);
				
				if(im.w2ui && im.w2ui.hasOwnProperty("changes")){
					var changeArr = im.w2ui.changes;
					for(var name in changeArr){
						im[name] = changeArr[name];
					}
				}
				
				dataProvider.push(im);
			}
			
			var selectRack = that.selectRackItem;
			
			this.lineInit();
			
			this.disposeRackIn(); 
			
			/*
			* 중복된 서버의 시작 위치와 종료위치를 계산 하는 프로세스
			*/
			this.map = {};
			this.mapArr = {};
			
			if(that.rackAlign.toLocaleLowerCase() === "asc"){
				
				for(var k=0; k < dataProvider.length; k++){
					var item = dataProvider[k];
					item.endPosition = item.startPosition + item.unitSize - 1;
					
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
								
								/*delete this.map[name];
								delete this.mapArr[name];*/
								
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
						
						var currentItem = w2ui["rackInGrid"].get(item.recid);
						
						if(!currentItem["w2ui"]){
							currentItem["w2ui"] = {};
						}
						
						if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.modelName !== null && $.trim(item.modelName) !== "" ){
							
							if(startP <= item.startPosition && endP >= item.endPosition){
								this.mapArr[name].push(item);
							}
							
							
							if(!currentItem["w2ui"]){
								currentItem["w2ui"] = {};
							}
							
							if(item.startPosition > 0 && item.endPosition <= selectRack.unitSize){
								currentItem["w2ui"].style = "color:#c0c0c0";
							}else{
								currentItem["w2ui"].style = "color:red";
							}
							
						}else{
							currentItem["w2ui"].style = "color:red";
						}
					}
					
				}
				
				this.refreshCheck();
				
				for(var name in this.mapArr){
					this.setPosition(this.mapArr[name]);
				}
				
				this.subAssetsManager.load();
				
				this.subAssetsManager.onFinish  = function(task){
					that.elements.sceneComp.labelValidateCheck();
				}
				
				/*
				* 중복 계산 종료
				*/
				
			}else{
				
				//내림차순
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
						
						var currentItem = w2ui["rackInGrid"].get(item.recid);
						
						if(!currentItem["w2ui"]){
							currentItem["w2ui"] = {};
						}
						
						if(item.startPosition !== null && $.trim(item.startPosition) !== "" && item.modelName !== null && $.trim(item.modelName) !== "" ){
							
							if(startP >= item.startPosition && endP <= item.endPosition){
								this.mapArr[name].push(item);
							}
							
							
							if(!currentItem["w2ui"]){
								currentItem["w2ui"] = {};
							}
							
							if(item.startPosition > selectRack.unitSize || item.endPosition < 1){
								currentItem["w2ui"].style = "color:red";
							}else{
								currentItem["w2ui"].style = "color:#c0c0c0";
							}
							
						}else{
							currentItem["w2ui"].style = "color:red";
						}
					}
					
				}
				
				this.refreshCheck();
				
				for(var name in this.mapArr){
					this.setPosition(this.mapArr[name]);
				}
				
				this.subAssetsManager.load();
				
				this.subAssetsManager.onFinish  = function(task){
					that.elements.sceneComp.labelValidateCheck();
				}
				
				/*
				* 중복 계산 종료
				*/
				
			}
			
			
		},
		
		labelValidateCheck : function(){

			var status = $("#showName").prop("checked");
							
			if(status){
				this.disposeLabel();
				this.createLabel();
			}
		},
		
		refreshCheck : function(){
			/*var changeData = w2ui['rackInGrid'].getChanges();
			
			if(changeData.length > 0){
				var dataAC = w2ui['rackInGrid'].records;
				
				for(var i=0; i < dataAC.length; i++){
					var item = dataAC[i];
					
					if(item.w2ui.hasOwnProperty("w2ui")){
						
					}
				}
				
			}else{
				w2ui['rackInGrid'].refresh();
			}*/
			
			w2ui['rackInGrid'].refresh();
		},
		
		/* 같은 포지션에 중복 배치 될경우 idx 우선순위로 배치 */
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
		
		setServerPosition : function(item, idx, lens){
			
			var path =  "dist/models/"+item.modelName+"/";
        	var fileName = item.modelName+".babylon";
        	
			this.subAssetsManager.addMeshTask(item.modelName, "", path, fileName).onSuccess = function(task){
				task.loadedMeshes.forEach(function(value, index){
					var mesh = value;
					var scene = that.elements.sceneComp.scene;
					var boxWidth = that.elements.sceneComp.boxWidth;
					var boxHeight = that.elements.sceneComp.boxHeight;
					var boxDepth = that.elements.sceneComp.boxDepth;
					var getRGBAfunc = that.elements.sceneComp.getRGBAfunc;
					var serverArr = that.elements.sceneComp.serverArr;
					var groups = that.elements.sceneComp.groups;
					var lineArr = that.elements.sceneComp.lineArr;
					var positionArr = that.elements.sceneComp.positionArr;
					
					mesh.id = item.assetId;
					mesh.name = item.assetName;
					mesh.isPickable = true;
					mesh.type = "server";
					
					mesh.actionManager = new BABYLON.ActionManager(scene);
					mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "showBoundingBox", false));
					mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "showBoundingBox", true));
					mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
						
						if(evt.sourceEvent.button === 0){
							
							var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
							
							if(pickInfo.hit){
								
								var selectItem = pickInfo.pickedMesh;
								
								/*Animation*/
								var serverArr = that.elements.sceneComp.serverArr;
								
								for(var i=0; i < serverArr.length; i++){
									var mesh = serverArr[i];
									
									if(selectItem.id === mesh.id){
										
										/*선택이 안된 모든 서버는 제자리로*/
	    								if(mesh.position.z === -0.5){
	    									//팝업창의 Properties값 초기화
	    									w2ui['rackEditor_server_properties'].clear();
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
		        							/*
		        							 * Sever Click
		        							 * Properties
		        							*/
		        							that.elements.sceneComp.setProperties(selectItem);
		        						}
										
										
									}else{
										mesh.position.z = 0;
		        						mesh.visibility = 0.7;
									}
									
									
								}
								
							}
						}
					}));
					
					
					mesh.item = item;
					serverArr.push(mesh);
					
					var meshSize = mesh.getBoundingInfo().boundingBox.extendSize; //실제 삽입된 오브젝트 크기
					
					//일차방정식
					var scaleX = boxWidth/ (meshSize.x * 2)/ lens;
					var scaleY = boxHeight / (meshSize.y * 2) * item.unitSize;
					var scaleZ = boxDepth / (meshSize.z * 2);
					
					mesh.scaling = {x:scaleX, y:scaleY, z:scaleZ};
					
					//0부터 시작 하면 -1 제거
					mesh.position.y = positionArr[item.startPosition-1][0].y - (boxHeight * item.unitSize / 2);
					mesh.position.x = positionArr[item.startPosition-1][1].x + (boxWidth/lens) * (idx+1)- (boxWidth/lens/2);
					
					var len = 0;
					
					if(that.rackAlign.toLocaleLowerCase() === "asc"){
						
						len = item.startPosition + item.unitSize;
						//삽입된 장비의 Unit 라인을 지우는 작업
						for(var i=item.startPosition; i <= len; i++){
							if(i===item.startPosition){
								groups[i-1].children[0].children[0].defaultFontColor = getRGBAfunc(0,255,255,1);
							}else if(i === len){
								//서버의 맨 윗줄과 맨 아랫줄은 색을 바꾸지 않는다.
							}else{
								lineArr[i-1].isVisible = false;
								groups[i-1].children[0].children[0].defaultFontColor = getRGBAfunc(0,255,255,1);
							}
						}
						
					}else{
						//삽입된 장비의 Unit 라인을 지우는 작업
						len = item.startPosition - item.unitSize;
						for(var i=item.startPosition; i >= len ; i--){
							if(i===item.startPosition){
								groups[i-1].children[0].children[0].defaultFontColor = getRGBAfunc(0,255,255,1);
							}else if(i === item.startPosition-item.unitSize){
								//서버의 맨 윗줄과 맨 아랫줄은 색을 바꾸지 않는다.
							}else{
								lineArr[i].isVisible = false;
								groups[i-1].children[0].children[0].defaultFontColor = getRGBAfunc(0,255,255,1);
							}
						}
					}
					
					
				});
			};
		},
		
		setProperties : function(mesh){
			var item = mesh.item;
			w2ui['rackEditor_server_properties'].record = {
				id:item.assetId,
				name:item.assetName,
				model:item.modelName,
				unitSize:item.unitSize,
				unitIndex:item.unitIndex,
				startPosition:item.startPosition
			}
			
			w2ui['rackEditor_server_properties'].refresh();
			
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
    	},
    	
    	showHideGrid : function(visible){
    		var ground = that.elements.sceneComp.scene.getMeshByID("ground");
    		if(visible){
    			//show
    			ground.isVisible = true;
    		}else{
    			//hide
    			ground.isVisible = false;
    		}
    	},
    	
    	showHideName : function(visible){
    		if(visible){
    			//show
    			this.createLabel();
    		}else{
    			//hide
    			this.disposeLabel();
    		}
    	},
    	
    	//Server Label 생성
    	createLabel : function(){
    		this.canvasLabel = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
    	        id: "labelCanvas"
    	    });
    		
    		this.labelGroups = [];
    		
    		var serverList = _.filter(this.scene.meshes, function(obj){
    			return obj.type==="server";
    		});
    		
    		for (var i = 0; i < serverList.length; i++) {
    			var mesh = serverList[i];
    			
    			var txtLength = 0;
    			txtLength = mesh.name.length * 8 + 30;
    			
    			var positionX = Math.round(txtLength/2)*-1;
    			var positionY = 0;
    			
    			var child = new BABYLON.Group2D({
    				parent: this.canvasLabel, id: "ServerTag#" + mesh.id, width: txtLength, height: 40, trackNode:mesh, 
    				children: [
		                new BABYLON.Rectangle2D({id: mesh.id+"#"+i, width: txtLength, height: 26, x: positionX, isPickable:true,
		                y: positionY, origin: BABYLON.Vector2.Zero(), 
		                border: "#ffffffFF", fill: "#000000FF", opacity:0.7, roundRadius: 3, borderThickness:1, children: [
		                        new BABYLON.Text2D(mesh.name, { marginAlignment: "h:center, v:center", 
		                        fontName: "bold 12px Arial", defaultFontColor:new BABYLON.Color4(234,255,0,1)})
		                    ]
		                })
		            ]
    			});
    			
    			this.labelGroups.push(child);
    		}
    		
    	},
    	
    	//Server Label 삭제
    	disposeLabel : function(){
    		for (var g = 0; g < this.labelGroups.length; g++) {
        		this.labelGroups[g].dispose();
    		}
    		
        	if(this.canvasLabel){
        		this.canvasLabel.dispose();
        	}
        	
    		this.labelGroups = [];
    	}
		
}