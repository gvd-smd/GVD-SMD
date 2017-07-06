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
//var colors = ['#2d335b', '#535b2d', '#494949', '#d7d7d7', '9ad4ce','#9c6ce4' ,'#63c0df' ,'#ffffff' ,'#fff06c ','#ffb76c','#ebd7dc','#dbd7dc','#cbd7dc','#bbd7dc','#abd7dc',];
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



function addOptions(fromIndex){
	if(jsonlido && selectApagado){
        jsonData[semestre[fromIndex]] = eval(uneval(jsonArray[semestre[fromIndex]].json))
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
            if(isGraphic == "treemap" || isGraphic == "sunburst" || isGraphic == "tifoldTree" ){
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
        liChild.classList.add("treeLi")
		dados.append(liChild);

		var cssAlter = document.getElementById("JsAlterTree");
		if(isGraphic == "treemap" || isGraphic == "sunburst" || isGraphic == "tifoldTree" ){
			cssAlter.innerHTML=".treeLi {display:block} #graphics{height:80%}"
		}else{
			cssAlter.innerHTML=".treeLi {display:none} #graphics{height:100%}"
		}
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
		console.log("o q chegou"+isGraphic);
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
			console.log("Não foi possivel atualizar gráfico isGraphic invalido");
			break;
	}	
	var leg = document.getElementById("legenda");
	if(isGraphic == "barGraphic" || isGraphic == "pizzaGraphic" || isGraphic=="radarGraphic"){
		leg.style.display = "none"
	}else{
		leg.style.display = "block"
		putLegenda();
	}
	
}
function alterSemestre(value){
	console.log("Open alterSemestre")
	var rotulos = document.getElementById("semestres").getElementsByTagName("li");
	console.log(value)
	var checkeds=0;
	
	console.log(checkeds);
	if(semestresCheck[value]!=true){
		for(var i =0 ;i<semestresCheck.length;i++)
			checkeds+=(semestresCheck[i])?1:0;
		if(checkeds<2){
			semestresCheck[value]=true;
		}
	}else{
		semestresCheck[value]=false;
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
	if(indexJson<1 || indexJson>2){
		semestre[0]=null;
		semestre[1]=null;
		eraseGraphics();
		limpaLegenda();
	}else if(indexJson==1){
		semestre[1]=null;
		mudaSemestre(0);
	}else{
		if(jsonData[0] == null)
			mudaSemestre(value,0);
		else
			mudaSemestre(value,1);
	}

	
}
function mudaSemestre(value,Index){
	var fromIndex = 0;
	if(Index!=null)
		fromIndex = Index;
	console.log("Comp value!=null"+value)
    console.log("Semestres Dif:"+oldsemestre[fromIndex]+" - "+value)
    if(oldsemestre[fromIndex]!=semestre[fromIndex] || Index!=null){
    	console.log("entrou pois é diferentes"+fromIndex)
    	if(jsonArray[semestre[fromIndex]].json==null)
    		loadJSON(jsonArray[semestre[fromIndex]].origem, function(data) { jsonArray[semestre[fromIndex]].json=data ;jsonlido=true;addOptions(fromIndex);}, function(xhr) { console.error(xhr); });
        else{
        	jsonlido=true;
        }
        //var selectQuestion_list = document.getElementById("dados");
        var	dados = document.getElementById("dados").children[1];
		while (dados.hasChildNodes() ) {  dados.removeChild(dados.firstChild);}
		selectApagado=true;
		addOptions(fromIndex);
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
	console.log("QuestNum"+question);
	console.log("isGraphic"+isGraphic);
	var i = parseInt(question);
	var dados = document.getElementById("dados").children[1]
	var selected = dados.children[i]
	if(isGraphic == "treemap" || isGraphic == "sunburst" || isGraphic=="tifoldTree"){
		
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
				for(var j =0;j<opts.length;j++)
					if(opts[j])
						jsonData[semestre[index]].children[j]=eval(uneval(jsonArray[semestre[index]].json.children[j]));
					else
						jsonData[semestre[index]].children[j]={}
	}else{
		questionNum = question;
		var activeds = dados.getElementsByClassName("active")
		console.log(activeds);
		for (var j=0;j<activeds.length;j++) {  
			activeds[j].classList.remove("active")
		}
		selected.classList.add("active")
	}
	console.log("Out AlterQuest In atualGraphi")
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
	console.log("Colocando Legenda")
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
			//console.log(pergs0.name+" - "+colorsName[j])
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
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	console.log("------------DivW:"+divW);
	var width=winWidth*((divW==2)?0.49:1);
	grafPerc((divW==2)?49:100);

	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			drawTreemap(i,semestre[i],width,winHeightT);
	}
};

function sunburst(){
	isGraphic = "sunburst";
	
	console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW==2)?0.49:1);grafPerc((divW==2)?49:100);
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			drawSunburst(i,semestre[i],width,winHeightT);
	}
};

function tifoldTree(){
	isGraphic = "tifoldTree";
	console.log("Graphic:"+isGraphic);

	var divW=0
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW==2)?0.49:1);grafPerc((divW==2)?49:100);
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			drawTifoldTree(i,semestre[i],width,winHeightT);
	}
}

//Grafico em barras
function barGraphic(){	var question = questionNum;
	isGraphic = "barGraphic";
	console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW==2)?0.49:1);grafPerc((divW==2)?49:100);
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			drawBarGraphic(i,semestre[i],width,winHeight-fontsize*3);
	}
}

function RadarGraphic(){
	var question = questionNum;
	isGraphic = "radarGraphic";

	

	console.log("Graphic:"+isGraphic);
	var divW=0;
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW==2)?0.49:1);grafPerc((divW==2)?49:100);
	var mycfg = {
	  w: width,
	  h: winHeight,
	  maxValue: 0.6,
	  levels: 6,
	  ExtraWidthX: 300
	}
	for(var i =0;i<2;i++){
		if(semestre[i]!=null){
			drawRadar(i,semestre[i],width*0.8,winHeight*0.9)
		}
	}
	
}
//Grafico pizza
function pizzaGraphic(){
	var question = questionNum;
	isGraphic = "pizzaGraphic";
	console.log("Graphic:"+isGraphic);
	var divW=0
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			divW++;
	}
	var width=winWidth*((divW==2)?0.49:1);grafPerc((divW==2)?49:100);
	for(var i =0;i<2;i++){
		if(semestre[i]!=null)
			drawPizza(i,semestre[i],width,winHeight);
	}
}
function grafPerc(perc){
	var cssAlter = document.getElementById("JsAlterGraphicPerc");
	cssAlter.innerHTML=".graphic{width:"+perc+"%}";
}
