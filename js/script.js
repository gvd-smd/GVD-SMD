var rotulo = 0;
var isGraphic = "sunburst"
var questionNum = 0;
var oldsemestre = [];
var jsonlido = false;
var semestre=[];
var jsonData =[];
var selectApagado = false;
var opts = [];
var v;
var expanded = false;
var json="json-completo/empty.json";
var winWidth=0,winHeight=0;
var testeTree;
var colorIndex;
var colors = ['#F5F5F5','#F5F5DC','#FDF5E6','#abc2dc','#FFF8DC','#FAEBD7','#FFE4C4','#E6E6FA','#FFE4E1','#E0FFFF','#FFE4B5','#FFEFD5','#F0F8FF','#FFFACD','#abd7dc','bbd7dc']
var colorsName = [];
var fontsize = 10;
var jsonArray=[{nome:"20151",origem:"json-completo/2015.1-completo.json",json:null},
{nome:"20152",origem:"json-completo/2015.2-completo.json",json:null},
{nome:"20161",origem:"json-completo/2016.1-completo.json",json:null},
{nome:"20162",origem:"json-completo/2016.2-completo.json",json:null}];

var selectQuestArray = []; 
var selectTreeArray = [];
var semestresCheck = [];

var comment_script = true;

function colored(name){
	var i =0;
	var colorVaga=-1;
	var NameFinded = false;
	for(i=0;i<colors.length;i++){
		if(!NameFinded && colorsName[i]==name){
			NameFinded=true;
			break;
		}else if(colorVaga==-1 && colorsName[i]==null){
			colorVaga=i;
		}
	}
	if(NameFinded){
		return colors[i];
	}else if(colorVaga!=-1){
		colorsName[colorVaga]=name;
		return colors[colorVaga];
	}else{
		return "#ccc";
	}
}


function mudaSemestre(value,Index){
	var fromIndex = 0;
	if(Index!=null)
		fromIndex = Index;
	if(comment_script) console.log("Comp value!=null"+value)
    if(comment_script) console.log("Semestres Dif:"+oldsemestre[fromIndex]+" - "+value)
    if(oldsemestre[fromIndex]!=semestre[fromIndex] || Index!=null){
    	if(comment_script) {
			console.log("entrou pois é diferentes"+fromIndex)
			/*console.log("JsonData=");
			console.log(jsonData);
			console.log("semestre=")
			console.log(semestre)*/
		}
    	if(value!= null && semestre[fromIndex] != null && jsonArray[semestre[fromIndex]].json==null){
    		if(comment_script) console.log("load options and jsonArray ");
    		loadJSON(jsonArray[semestre[fromIndex]].origem, function(data) { jsonArray[semestre[fromIndex]].json=data ;jsonlido=true;addOptions(fromIndex);}, function(xhr) { console.error(xhr); });
    	}else{//renovando jsonData
        	var counterCheck=0;
			for(var i =0 ;i<semestresCheck.length;i++)
				if(semestresCheck[i]){
					//jsonData[i] = eval(uneval(jsonArray[i].json))
					semestre[counterCheck++]=i;
					UpdateJson(counterCheck-1);
				}else{
					jsonData[i] = null;
				}
			//if(comment_script){ console.log("JsonData="); console.log(jsonData); }
        	for(var i = counterCheck;i<semestresCheck.length;i++){
        		semestre.splice(counterCheck, 1);
	        }
	        jsonlido=true;
	        //atualGraphi();
        }
    	var	dados = document.getElementById("dados").children[1];
		while (dados.hasChildNodes() ) { dados.removeChild(dados.firstChild); }
		selectApagado=true;
		addOptions(fromIndex);//Bug
		//Prol está aqui a logica de carregar o Jsondata pois no renovando Json tento carregar todos e aqui ele tem a intenção de carregar os novos e os antigos.
    }else{
    	atualGraphi();
    }
}
function loadJSON(path, success, error){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
function isTree(){
	return (isGraphic == "treemap" || isGraphic == "sunburst" || isGraphic=="tifoldTree");
}
function UpdateJson(Id){
	if(comment_script) console.log("UpdateJson id:"+Id);
	if(jsonData[semestre[Id]] == null || !isTree())
        jsonData[semestre[Id]] = eval(uneval(jsonArray[semestre[Id]].json))
    else 
		for(var j =0;j<opts.length;j++)
			if(opts[j])
				jsonData[semestre[Id]].children[j]=eval(uneval(jsonArray[semestre[Id]].json.children[j]));
			else
				jsonData[semestre[Id]].children[j]={}
}

function addOptions(fromIndex){
	if(comment_script) console.log("addOptions="+(jsonlido && selectApagado))
	if(jsonlido && selectApagado){
		if(comment_script) console.log("fromIndex"+fromIndex);
		if(semestre[fromIndex]!=null){
        	for(var index =0;index<semestre.length;index++)
				if(semestre[index]!=null)
					UpdateJson(index);
		}else
    		fromIndex=0;

		jsonlido = false;
		selectApagado = frameElement;
		var	dados = document.getElementById("dados");
		dados = dados.children[1];

		
        var ul = document.createElement("ul");

	    for(var i =0;i< jsonArray[semestre[fromIndex]].json.children.length;i++){
            var liChild = document.createElement("li");
            var aChild = document.createElement("a");
            aChild.href="#";
            aChild.setAttribute( "onclick", "javascript: alterQuest("+i+");" );
            aChild.innerHTML=jsonArray[semestre[fromIndex]].json.children[i].name;
            if(opts[i]==null)
            	opts[i]=true;
        		

            liChild.append(aChild);
            if(isTree()){
            	if(opts[i])
            		liChild.classList.add("active")
            	else
            		jsonData[semestre[fromIndex]].children[i]={}
            }else{
            	if(i==questionNum)
            		liChild.classList.add("active")
            }

            dados.append(liChild);
		}

		var liChild = document.createElement("li");
        var aChild = document.createElement("a");
        aChild.href="#";
        aChild.setAttribute( "onclick", "javascript: uncheckDados();" );
        aChild.innerHTML="Deselecionar Todos";
        liChild.append(aChild);
        liChild.classList.add("treeLi")
        dados.append(liChild);


        liChild = document.createElement("li");
        aChild = document.createElement("a");
        aChild.href="#";
        aChild.setAttribute( "onclick", "javascript: checkDados();" );
        aChild.innerHTML="Selecionar Todos";
        liChild.append(aChild);
        liChild.classList.add("treeLi")//TODO: Alter from treeLi to treeOpts
		dados.append(liChild);


		var cssAlter = document.getElementById("JsAlterTree");
		if(isTree()){
			cssAlter.innerHTML=".treeLi {display:block} #graphics{height:80%}"
		}else{
			cssAlter.innerHTML=".treeLi {display:none} #graphics{height:100%}"
		}

		if(comment_script) console.log("JsonData=");
		if(comment_script) console.log(jsonData);
		atualGraphi();
	}
}
function atualGraphi(fromSelect){
	if(fromSelect!=null){
		isGraphic = fromSelect;
		var links = document.getElementById("menuUp").getElementsByTagName("a");
		for(var i = 0;i<links.length;i++){
			links[i].classList.remove("active")
			if(links[i].id == isGraphic)
				links[i].classList.add("active")
		}
		if(comment_script) console.log("o q chegou"+isGraphic);
		mudaSemestre();
	}
	eraseGraphics();

	switch(isGraphic){
		case "treemap":
			treemap();
			break;
		case "tifoldTree":
			tifoldTree();	
			break;
		case "sunburst":
			sunburst();
			break;
		case "barGraphic":
			barGraphic();
			break;
		case "pizzaGraphic":
			pizzaGraphic();
			break;
		case "radarGraphic":
			RadarGraphic();
			break;
		default:
			if(comment_script) console.log("Não foi possivel atualizar gráfico isGraphic invalido");
			break;
	}	
	var leg = document.getElementById("legenda");
	if(!isTree()){
		leg.style.display = "none"
	}else{
		leg.style.display = "block"
		putLegenda();
	}
	
}
function alterSemestre(value){
	if(comment_script) console.log("Open alterSemestre")
	var rotulos = document.getElementById("semestres").getElementsByTagName("li");
	if(comment_script) console.log("value"+value)
	var checkeds=0;
	if(semestresCheck[value]!=true){
		for(var i =0 ;i<semestresCheck.length;i++)
			checkeds+=(semestresCheck[i])?1:0;
		if(checkeds<4){
			semestresCheck[value]=true;
		}
	}else{
		semestresCheck[value]=false;
		var index=-1;
		for(var i=0;i<semestre.length;i++){
			if(semestre[i]==value){
				index=i;break;
			}
		}
		if(index!=-1){
			semestre[index]=null;
			semestre.splice(index, 1)
		}
	}
	var indexJson = 0;
	for(var i = 0;i<rotulos.length;i++){
		if(semestresCheck[i]){
			if(!rotulos[i].classList.contains("active")){
				rotulos[i].classList.add("active")
			}
		}else{
			rotulos[i].classList.remove("active")
		}
		if(rotulos[i].classList.contains("active")){
			semestre[indexJson++]=i;
		}
	}
	if(indexJson<1 || indexJson>4){
		semestre[0]=null;
		semestre[1]=null;
		eraseGraphics();
		limpaLegenda();
	}else if(indexJson==1){
		semestre[1]=null;
		mudaSemestre(value);
	}else{
		eraseGraphics();
		if(jsonData[0] == null)
			mudaSemestre(value,0);
		else{
			var index=-1;
			for(var i=0;i<semestre.length;i++){
				if(semestre[i]==value){
					index=i;break;
				}
			}
			if(index==-1){
				for(var i=0;i<semestre.length;i++){
					if(semestre[i]==null){
						index=i;break;
					}
				}
			}
			if(comment_script) console.log("index of semestre"+index);
			if(index!=-1){
				semestre[index]=value;
				mudaSemestre(value,index);
			}else{
				index=semestre.length;
				semestre[index]=value;
				mudaSemestre(value,index);
			}
		}
	}

	
}


function mudaRotulos(r){
	rotulo=r;

	var rotulos = document.getElementById("rotulos").getElementsByTagName("li");
	for(var i = 0;i<rotulos.length;i++){
		rotulos[i].classList.remove("active")
		if(rotulos[i].getElementsByTagName("a")[0].id == r)
			rotulos[i].classList.add("active")
	}
    atualGraphi() ;
}
function uncheckDados(){
	var dados = document.getElementById("dados").children[1];
	for(var index =0;index<semestre.length;index++){

		if(semestre[index]!=null)
		for(var j =0;j<opts.length;j++){
			opts[j]=false
			jsonData[semestre[index]].children[j]={}
			dados.children[j].classList.remove("active")
		}
	}
	atualGraphi();
}
function checkDados(){
	var dados = document.getElementById("dados").children[1];
	for(var index =0;index<semestre.length;index++){
		for(var j =0;j<opts.length;j++){
			opts[j]=true
			jsonData[semestre[index]].children[j]=eval(uneval(jsonArray[semestre[index]].json.children[j]));
			dados.children[j].classList.add("active")
		}
	}
	atualGraphi();
}
function alterQuest(question){
	if(comment_script) console.log("QuestNum"+question);
	if(comment_script) console.log("isGraphic"+isGraphic);
	var i = parseInt(question);
	var dados = document.getElementById("dados").children[1]
	var selected = dados.children[i]
	if(isTree()){
		
		if(opts[i]==null)
			opts[i]=true;
		else
			opts[i]=!opts[i];
		if(opts[i]){
			selected.classList.add("active")
		}else{
			selected.classList.remove("active")
		}

		//selected.classList.add("active")
		for(var index =0;index<semestre.length;index++)
			if(semestre[index]!=null)
				UpdateJson(index);
				/*for(var j =0;j<opts.length;j++)
					if(opts[j])
						jsonData[semestre[index]].children[j]=eval(uneval(jsonArray[semestre[index]].json.children[j]));
					else
						jsonData[semestre[index]].children[j]={}*/
	}else{
		questionNum = question;
		var activeds = dados.getElementsByClassName("active")
		if(comment_script) console.log(activeds);
		for (var j=0;j<activeds.length;j++) {  
			activeds[j].classList.remove("active")
		}
		selected.classList.add("active")
	}
	if(comment_script) console.log("Out AlterQuest In atualGraphi")
	atualGraphi();
}

function eraseGraphics(){
	var myNode = document.getElementById("graphics");
	while (myNode.lastChild) {
	    myNode.removeChild(myNode.lastChild);
	}
}
function limpaLegenda(){
	var myNode = document.getElementById("legenda");
	while (myNode.lastChild) {
	    myNode.removeChild(myNode.lastChild);
	}
	//leg.innerHTML = '';
}
function createItem(color){
	var item = document.createElement("div");
	item.id = "item";
	var circle = document.createElement("div");
	circle.className = "circle";
	circle.style.background = color;
	item.appendChild(circle);
	return item;
}

function putLegenda(){
	limpaLegenda();
	if(comment_script) console.log("Colocando Legenda")
	var leg = document.getElementById("legenda");
	var itens;
	var passed=0;
	if(semestre[0]!= null && jsonData[semestre[0]]!=null)
	for(var j =0;j<colors.length;j++){
		if(passed%4==0){
			itens = document.createElement("div");
			itens.id = "itens"
		}
		var i=0;
		for(i=0;i<jsonData[semestre[0]].children.length;i++){
			var pergs0 = jsonData[semestre[0]].children[i];

			var pergs1 ;
			//if(comment_script) console.log(pergs0.name+" - "+colorsName[j])
			if(semestre[1]!=null && jsonData[semestre[1]]!=null)
				pergs1 = jsonData[semestre[1]].children[i];

			if(pergs0.name != null && colorsName[j] == pergs0.name){
				break;
			}else if(pergs1!=null && pergs1.name != null && colorsName[j] == pergs1.name){
				break;
			}
		}
		if(i<jsonData[semestre[0]].children.length){
			var j;
			var item = createItem(colors[i]);
			itens.appendChild(item);
			leg.appendChild(itens);
			item.innerHTML += colorsName[i];
			passed++;
		}
		
	}
}
function alterFont(value){
	var cssAlter = document.getElementById("JsAlterFont");
	cssAlter.innerHTML=".node {font: "+value+"px sans-serif;}#graphics text{font: "+value+"px sans-serif;}"

	var links = document.getElementById("fontes").getElementsByTagName("li");
	for(var i = 0;i<links.length;i++){
		links[i].classList.remove("active")
		if(links[i].getElementsByTagName("a")[0].id == value)
			links[i].classList.add("active")
	}
}

function treemap(){
	isGraphic = "treemap";
	var divW=0
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	if(comment_script) console.log("------------DivW:"+divW);

	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeightT*((divW>2)?0.49:1);
	grafPercWH(divW);
	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawTreemap(i,semestre[i],winWidth,height);
		else if(semestre[i]!=null)
			drawTreemap(i,semestre[i],width,height);
	}
};

function sunburst(){
	isGraphic = "sunburst";
	
	if(comment_script) console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeightT*((divW>2)?0.49:1);

	grafPercWH(divW);
	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawSunburst(i,semestre[i],winWidth,height);
		else if(semestre[i]!=null)
			drawSunburst(i,semestre[i],width,height);
	}
};

function tifoldTree(){
	isGraphic = "tifoldTree";
	if(comment_script) console.log("Graphic:"+isGraphic);

	var divW=0
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeightT*((divW>2)?0.49:1);

	grafPercWH(divW);

	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawTifoldTree(i,semestre[i],winWidth,height);
		else if(semestre[i]!=null)
			drawTifoldTree(i,semestre[i],width,height);
	}
}

//Grafico em barras
function barGraphic(){	var question = questionNum;
	isGraphic = "barGraphic";
	if(comment_script) console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeight*((divW>2)?0.49:1);

	grafPercWH(divW);
	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawBarGraphic(i,semestre[i],winWidth,height-fontsize*3);
		else if(semestre[i]!=null)
			drawBarGraphic(i,semestre[i],width,height-fontsize*3);
	}

}

function RadarGraphic(){
	var question = questionNum;
	isGraphic = "radarGraphic";
	if(comment_script) console.log("Graphic:"+isGraphic);
	var divW=0;
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeight*((divW>2)?0.49:1);

	grafPercWH(divW);
	var mycfg = {
	  w: width,
	  h: height,
	  maxValue: 0.6,
	  levels: 6,
	  ExtraWidthX: 300
	}
	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawRadar(i,semestre[i],winWidth,height);
		else if(semestre[i]!=null){
			drawRadar(i,semestre[i],width,height)
		}
	}
}
//Grafico pizza
function pizzaGraphic(){
	var question = questionNum;
	isGraphic = "pizzaGraphic";
	if(comment_script) console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<4;i++){
		if(semestre[i]!=null)
			divW++;
	}
	if(comment_script) console.log("Pizza graphics"+divW)

	var width=winWidth*((divW>=2)?0.49:1);
	var height=winHeight*((divW>2)?0.49:1);
	grafPercWH(divW);
	for(var i =0;i<4;i++){
		if(i==divW-1 && divW==3)
			drawPizza(i,semestre[i],winWidth,height);
		else if(semestre[i]!=null)
			drawPizza(i,semestre[i],width,height);
	}
}
function grafPercWH(grafs){
	var cssAlter = document.getElementById("JsAlterGraphicPerc");
	var strin = "";
	strin =".graphic{width:"+((grafs>=2)?49:100)+"%; height:"+((grafs>2)?49:100)+"%} ";
	if(grafs==3){
		cssAlter.innerHTML=strin+".graphic:nth-child(3){width: 100%;margin-top: 1%;}";
	}else if(grafs==4){
		cssAlter.innerHTML=strin+".graphic:nth-child(3){margin-right: 2%;margin-top: 1%;} .graphic:nth-child(4){margin-top: 1%;}";
	}else{
		cssAlter.innerHTML=strin;
	}
}

