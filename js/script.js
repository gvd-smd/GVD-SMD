var rotulo = 0;
var isGraphic = ""
var questionNum = 0;
var semestre;
var jsonData ="";
var selectApagado = false;
var opts = [];
var v;
var expanded = false;
var json="json-completo/empty.json";
var winWidth=0,winHeight=0;
var testeTree;
var colorIndex;
var colors = ['#2d335b', '#535b2d', '#494949', '#d7d7d7', '9ad4ce','#9c6ce4' ,'#63c0df' ,'#ffffff' ,'#fff06c ','#ffb76c','#ebd7dc','#dbd7dc','#cbd7dc','#bbd7dc','#abd7dc'];
var colorsName = [];
var jsonArray=[{nome:"20151",origem:"json-completo/2015.1-completo.json",json:null},
{nome:"20152",origem:"json-completo/2015.2-completo.json",json:null},
{nome:"20161",origem:"json-completo/2016.1-completo.json",json:null}];

function colored(name){
	var i =0;
	var colorVaga=-1;
	var NameFinded = false;
	for(i=0;i<colors.length;i++){
		if(!NameFinded && colorsName[i]==name){
			NameFinded=true;
			break;
		}else if(colorsName[i]==null && colorVaga==-1){
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



function addOptions(){
	if(jsonlido && selectApagado){
        jsonData = eval(uneval(jsonArray[semestre].json))
		jsonlido = false;
		selectApagado = frameElement;
		var selectTreeOpt_list = document.getElementById("selectTreeOpt");
		var	selectQuestion_list = document.getElementById("selectQuestion");
	    for(var i =0;i< jsonArray[semestre].json.children.length;i++){
			console.log("Passou selectTreeOpt");
			var label = document.createElement("label"),radio = document.createElement("input");
		    radio.type = "checkbox";
		    radio.value = i;
		    radio.checked=(opts[i]==false)?false:true;///deve ser feito dessa forma pois opts[i] pode estar em estado inicial(undefined) ou null.
		    radio.addEventListener('click',function(){alterQuestTree(this.value)});
		    if(!radio.checked) jsonData.children[i]={};
		    label.setAttribute("style","background-color:"+((radio.checked)?"#30a294":"#fff"));
			label.appendChild(radio);
		    label.appendChild(document.createTextNode(jsonArray[semestre].json.children[i].name));
			selectTreeOpt_list.appendChild(label);

			var opt = document.createElement('option');
		    opt.value = i;
		    opt.innerHTML = jsonArray[semestre].json.children[i].name;
			selectQuestion_list.appendChild(opt);
		}
		if(questionNum < jsonArray[semestre].json.children.length){
			selectQuestion_list.value = questionNum;
		}
		atualGraphi();
	}
}
function atualGraphi(val){
	if(val!=null && val == "fromSelect"){
		isGraphic = document.getElementById("formulario").getElementsByTagName("select")[0].value;
		console.log("o q chegou"+isGraphic);
		mudaSemestre();
	}
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
		default:
			console.log("Não foi possivel atualizar gráfico isGraphic invalido");
			break;
	}	
}
function mudaSemestre(value){
	if(value != null && value == "fromSelect"){
		value = document.getElementById("formulario").getElementsByTagName("select")[1].value;
		console.log("Select Button"+ semestre);
	}
    if(value!=null){
    	oldsemestre=semestre;
    	semestre=value;
    }else if(semestre==null){
    	oldsemestre = semestre;
    	semestre=0;
    } 

    if(oldsemestre!=semestre){
    	if(jsonArray[semestre].json==null)
    		loadJSON(jsonArray[semestre].origem, function(data) { jsonArray[semestre].json=data ;jsonlido=true;addOptions();}, function(xhr) { console.error(xhr); });
        else{
        	jsonlido=true;
        }
        var selectQuestion_list = document.getElementById("selectQuestion");
        var selectTreeOpt_list = document.getElementById("selectTreeOpt");
		while (selectQuestion_list.hasChildNodes() || selectTreeOpt_list.hasChildNodes()) {  
			if(selectQuestion_list.hasChildNodes())
		    	selectQuestion_list.removeChild(selectQuestion_list.firstChild);
		    if(selectTreeOpt_list.hasChildNodes())
		    	selectTreeOpt_list.removeChild(selectTreeOpt_list.firstChild);
		}
		selectApagado=true;
		addOptions();
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

function ControldivGraf(){
	var element = document.getElementById("graphic");
	if(element != null){
		element.remove();
	}
	var select = document.getElementById("selectQuestion");
	if(isGraphic == "barGraphic" || isGraphic == "pizzaGraphic"){
		if(select.style.display != 'block'){
			select.style.display = 'block';
		}
		select = document.getElementsByClassName("multiselect")[0]
		if(select.style.display != 'none'){
			select.style.display = 'none';
		}
	}else{
		if(select.style.display != 'none'){
			select.style.display = 'none';
		}
		select = document.getElementsByClassName("multiselect")[0]
		if(select.style.display != 'block'){
			select.style.display = 'block';
		}
	}
}
function treemap(){
	isGraphic = "treemap";
	ControldivGraf();
	var margin = {top: 40, right: 10, bottom: 10, left: 10},
	width = winWidth,
	height = winHeight;
	var treemap = d3.layout.treemap()
	.size([width, height])
	.sticky(true)
	.value(function(d) { return d.size; });
	var proporcao = (width>height)?(width/height):(height/width);
	var div = d3.select("body").append("div")
	.attr("id", "graphic")
	.attr("class", "treeMap")

	div = d3.select("#graphic").append("div")
	.attr("id", "g")
	.attr("class", "treeMap")
	.style("position", "relative");

	console.log("Até Agora ok");
	d3.json(json, function(error, root) {
		if (error) throw error;

		root=eval(uneval(jsonData));
		var node = div.datum(root).selectAll(".node")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "node")
		.attr("class", function(d) {T=d; return d.children ? "node pai" : "node filho"; })
		.call(position)
		.style("background", function(d) {return d.children ?  colored(d.name) : null })
		.text(function(d) { return d.children ? null : ""; });

		v=node;
		console.log("Entrou");

        if (rotulo==0) { 
        	node.append("text")
			.text(function(d) { return d.children ? null : d.parent.name+'-'+d.name+'-'+d.size; });
        }else if (rotulo==1) {
        	node.append("text")
			.text(function(d) { return d.children ? null : d.name+'-'+d.size; });
        }else if (rotulo==2) {
        	node.append("text")
			.text(function(d) { return d.children ? null : d.size; });
        }else if (rotulo==3) {
        	node.append("text")
			.text(function(d) { return d.children ? null : d.name; });
        }else if (rotulo==4) {
        	node.append("text")
			.text(function(d) { return d.children ? null : d.parent.name; });
        }else if (rotulo==5) {
        	node.append("text")
			.text(function(d) { return d.children ? null : ""; });
        }

		node.append("title").text(function(d) { if(d.children){return d.name}});
	});

	function position() {
		this.style("left", function(d) { return d.x + "px"; }) // deslocamento para a esquerda
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
		.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}
};


//Function that creates the sunburst graphic
function sunburst(){
	isGraphic = "sunburst";
	ControldivGraf();
	var width = winWidth,
	height = winHeight,
	radius = Math.min(width, height) / 2 - 20,
	color = d3.scale.category20c();

	var proporcao = (width>height)?(width/height):(height/width);

	var svg = d3.select("body").append("svg")
	.attr("class", "sunburst")
	.attr("id", "graphic")
	.append("g")
	.attr("transform", "translate(" + width/2 + "," + height / 2 + ")");

	var partition = d3.layout.partition()
	.sort(null)
	.size([2 * Math.PI, radius * radius])
	.value(function(d) { return 1; });

	var arc = d3.svg.arc()
	.startAngle(function(d) { return d.x; })
	.endAngle(function(d) { return d.x + d.dx; })
	.innerRadius(function(d) { return Math.sqrt(d.y); })
	.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

	d3.json(json, function(error, root) {
		if (error) throw error;
		root=jsonData;
		var path = svg.datum(root).selectAll("path")
		.data(partition.nodes)
		.enter().append("path")
			.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
			.attr("d", arc)
			.style("stroke", "#fff")
			.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
			.style("fill-rule", "evenodd")
			.each(stash);
	});

	// Stash the old values for transition.
	function stash(d) {
		d.x0 = d.x;
		d.dx0 = d.dx;
	}

	// Interpolate the arcs in data space.
	function arcTween(a) {
		var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
		return function(t) {
			var b = i(t);
			a.x0 = b.x;
			a.dx0 = b.dx;
			return arc(b);
		};
	}

	d3.select(self.frameElement).style("height", height + "px");
};

function tifoldTree(){
	isGraphic = "tifoldTree";
	ControldivGraf();
	var width = winWidth,
	height = winHeight,
	radius = Math.min(width, height) / 2 - 20,
	color = d3.scale.category20c();
	var proporcao = (width>height)?(width/height):(height/width);

	var tree = d3.layout.tree()
	.size([360, radius - 120])
	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	var svg = d3.select("body").append("svg")
	.attr("id", "graphic")
	.attr("class", "tifoldTree")
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.json(json, function(error, root) {
		if (error) throw error;
		root=jsonData;
		var nodes = tree.nodes(root),
		links = tree.links(nodes);

		var link = svg.selectAll(".link")
		.data(links)
		.enter().append("path")
		.attr("class", "link")
		.attr("d", diagonal);

		var node = svg.selectAll(".node")
		.data(nodes)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

		node.append("circle")
		.attr("r", 4.5);

		node.append("text")
		.attr("dy", ".31em")
		.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
		.text(function(d) { return d.name; });
	});

	d3.select(self.frameElement).style("height", radius*2 - 150 + "px");
}

//Grafico em barras
function barGraphic(){	var question = questionNum;
	isGraphic = "barGraphic";
	ControldivGraf();
	var margin = {top: 120, right: 20, bottom: 30, left: 40},
	width = 1460 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;
	width = winWidth;height = winHeight;
	var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	.range([height, 0]);

	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	var svg = d3.select("body").append("svg")
	.attr("id", "graphic")

	d3.json(json, function(error, root) {
		if (error) throw error;
		root=jsonArray[semestre].json;
	x.domain(root.children[question].children.map(function(d) { return d.name; }));
	y.domain([0, d3.max(root.children[question].children, function(d) { return d.size; })]);

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Alunos");

	svg.selectAll(".bar")
	.data(root.children[question].children)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return x(d.name); })
	.attr("width", x.rangeBand())
	.attr("y", function(d) { return y(d.size); })
	.attr("height", function(d) { return height - y(d.size); });
	});

	function type(d) {
		d.size = +d.size;
		return d;
	}
}

//Grafico pizza
function pizzaGraphic(){
	var question = questionNum;
	isGraphic = "pizzaGraphic";
	ControldivGraf();
	var width=winWidth, height=winHeight,radius = Math.min(width, height) / 2;
	
	var color = d3.scale.ordinal()
	.range(["#3376C5", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 300);//deixar innerRadius igual a 0 pra que o gráfico vire um Gráfico de Pizza

	var pie = d3.layout.pie()
	.sort(null)
	.value(function (d) {
		return d.size;
	});

	var proporcao = (width>height)?(width/height):(height/width);
	var svg = d3.select("body").append("svg")
	.attr("id", "graphic")
	.attr("class", "pizza")

	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	d3.json(json, function(error, root) {
		if (error) return console.warn(error);
		root=jsonArray[semestre].json;
		var g = svg.selectAll(".arc")
		.data(pie(root.children[question].children))
		.enter().append("g")
		.attr("class", "arc");

		g.append("path")
		.attr("d", arc)
		.style("fill", function (d) {

			return color(d.data.name);
		});

		g.append("text")
		.attr("transform", function (d) {
			return "translate(" + arc.centroid(d) + ")";
		})
		.attr("dy", ".35em")
		.style("text-anchor", "middle")
		.text(function (d) {
			return d.data.name;
		});
	});		
}



function mudaRotulos(r){
	if(r.value!=null)
		rotulo=r.value;
	else
		rotulo=r;
    atualGraphi() ;
}
function alterQuest(question){
	questionNum = question;
	mudaSemestre(null);
}
function showCheckboxes() {
  var checkboxes = document.getElementById("selectTreeOpt");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}
function alterQuestTree(value){
	console.log("Alterando valor da Tree"+opts.length);
	var check = document.getElementById("selectTreeOpt");
	var i = parseInt(value);
	var label = check.getElementsByTagName("label");
	var input = check.getElementsByTagName("input");
	opts[i] = check.children[i].children[0].checked;
	if(opts[i]){
		label[i].setAttribute("style","background-color:#30a294");
	}else{
		label[i].setAttribute("style","background-color:#fff");
	}

	if(opts[i])
		jsonData.children[i]=eval(uneval(jsonArray[semestre].json.children[i]));
	else
		jsonData.children[i]={}
	atualGraphi();
}
function Click(event) {
  var checkboxes = document.getElementById("selectTreeOpt");
	if(winWidth==0 || winWidth==undefined){
		/*winWidth=document.getElementById("graphic").offsetWidth;
		winHeight=document.getElementById("graphic").offsetHeight/2;*/
		winWidth= window.innerWidth*0.8;
		winHeight= window.innerHeight;
	}
		
	v = event.target;
	if(!(event.target.parentNode.id == "selectTreeOpt" || event.target.parentNode.parentNode.id == "selectTreeOpt")  && event.target.classList[0] != "overSelect" && expanded){
		checkboxes.style.display = "none";
    	expanded = false;
   	}
}
	