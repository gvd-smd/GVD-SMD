var qtdAtributos = 0;
var rotulo = 0;
var json = "json-sete/2015.1-sete.json";
var isGraphic = ""
var questionNum = 0;
var semestre="20151";
var jsonQuest ="";
var jsonlido = false;
var selectApagado = false;

function addOptions(){
	console.log(jsonlido+""+selectApagado)
	if(jsonlido && selectApagado){
		jsonlido = false;
		selectApagado = false;
		var list = document.getElementById("selectQuestion");
	    for(var i =0;i< jsonQuest.children.length;i++){
			var opt = document.createElement('option');
		    opt.value = i;
		    opt.innerHTML = jsonQuest.children[i].name;
		    list.appendChild(opt);
		}
		if(questionNum < jsonQuest.children.length){
			list.value = questionNum;
		}
		atualGraphi();
	}
}
function atualGraphi(){
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
			break;
	}	
}
function mudaSemestre(myRadio){
	if(myRadio != null){
		semestre = myRadio.value
		console.log("Radio Button"+ semestre)
	}
	var oldjson = json;
	if(semestre=="20151"){
        if (qtdAtributos==0) json = "json-sete/2015.1-sete.json";
        else if (qtdAtributos==1) json = "json-completo/2015.1-completo.json";
    }else if(semestre=="20152"){
        if (qtdAtributos==0) json = "json-sete/2015.2-sete.json";
        else if (qtdAtributos==1) json = "json-completo/2015.2-completo.json";
    }else if(semestre=="20161"){
        if (qtdAtributos==0) json = "json-sete/2016.1-sete.json";
        else if (qtdAtributos==1) json = "json-completo/2016.1-completo.json";
    }
    if(oldjson != json){
    	var s = "";
    	loadJSON(json,
         function(data) { jsonQuest = data ;jsonlido=true;addOptions();},
        function(xhr) { console.error(xhr); });
        var list = document.getElementById("selectQuestion");
        var indexchecked=0;
		while (list.hasChildNodes()) {  

		    list.removeChild(list.firstChild);
		}
		selectApagado=true;
		addOptions();
    }else{
    	atualGraphi()
    }
}
function loadJSON(path, success, error){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
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
	var notree=false;

	var tree = document.getElementById("selectQuestion");
	if(isGraphic == "barGraphic" || isGraphic == "pizzaGraphic"){
		notree=true;
		if(tree.style.display != 'block'){
			tree.style.display = 'block';
		}
		tree = document.getElementById("treeStuff");
		if(tree.style.display != 'none'){
			tree.style.display = 'none';
		}
	}else{
		if(tree.style.display != 'none'){
			tree.style.display = 'none';
		}
		tree = document.getElementById("treeStuff");
		if(tree.style.display != 'block'){
			tree.style.display = 'block';
		}
	}
}
function treemap(){
	isGraphic = "treemap";
	ControldivGraf();
	var radio = document.getElementById('size');
	radio.checked = true;
	var margin = {top: 40, right: 10, bottom: 10, left: 10},
	width = 1500 - margin.left - margin.right,
	height = 810 - margin.top - margin.bottom;

	var color = d3.scale.category20c();

	var treemap = d3.layout.treemap()
	.size([width, height])
	.sticky(true)
	.value(function(d) { return d.size; });

	var div = d3.select("body").append("div")
	.attr("id", "graphic")
	.attr("class", "treeMap")/*
	.style("position", "relative")
	.style("width", (width + margin.left + margin.right) + "px")
	.style("height", (height + margin.top + margin.bottom) + "px")
	.style("left", margin.left + "px")
	.style("top", margin.top + "px");*/
	console.log("Até Agora ok");
	d3.json(json, function(error, root) {
		if (error) throw error;
		var node = div.datum(root).selectAll(".node")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "node")
		.call(position)
		.style("background", function(d) { return d.children ? color(d.name) : null; })
		.text(function(d) { return d.children ? null : ""; });

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
            
            
		
		node.append("title")
		.text(function(d) { if(d.children){return d.name}});

		d3.selectAll("input").on("change", function change() {
			var value = this.value === "count"
			? function() { return 1; }
			: function(d) { return d.size; };

			node
			.data(treemap.value(value).nodes)
			.transition()
			.duration(1500)
			.call(position);
		});
	});

	function position() {
		this.style("left", function(d) { return d.x -200 + "px"; }) // deslocamento para a esquerda
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
		.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	}
};


//Function that creates the sunburst graphic
function sunburst(){
	isGraphic = "sunburst";
	ControldivGraf();
	var radio = document.getElementById('size');
	radio.checked = true;
	var width = 960,
	height = 700,
	radius = Math.min(width, height) / 2 - 20,
	color = d3.scale.category20c();

	var svg = d3.select("body").append("svg")
	/*.attr("width", width)
	.attr("height", height)*/
	.attr("class", "sunburst")
	.attr("id", "graphic")
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

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

		var path = svg.datum(root).selectAll("path")
		.data(partition.nodes)
		.enter().append("path")
				.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
				.attr("d", arc)
				.style("stroke", "#fff")
				.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
				.style("fill-rule", "evenodd")
				.each(stash);

				d3.selectAll("input").on("change", function change() {
					var value = this.value === "count"
					? function() { return 1; }
					: function(d) { return d.size; };

					path
					.data(partition.value(value).nodes)
					.transition()
					.duration(1500)
					.attrTween("d", arcTween);
				});
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
	var diameter = 960;

	var tree = d3.layout.tree()
	.size([360, diameter / 2 - 120])
	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	var svg = d3.select("body").append("svg")
	/*.attr("width", diameter)
	.attr("height", diameter - 150)*/
	.attr("id", "graphic")
	.attr("class", "tifoldTree")
	.append("g")
	.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	d3.json(json, function(error, root) {
		if (error) throw error;

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

	d3.select(self.frameElement).style("height", diameter - 150 + "px");
}
//Grafico em barras

function barGraphic(){
	//questionNum = question;
	var question = questionNum;
	isGraphic = "barGraphic";
	ControldivGraf();
	var margin = {top: 120, right: 20, bottom: 30, left: 40},
	width = 1460 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;

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
	/*.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)*/
	.attr("class", "barGraphic")
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(json, function(error, data) {
		if (error) throw error;
	x.domain(data.children[question].children.map(function(d) { return d.name; }));
	y.domain([0, d3.max(data.children[question].children, function(d) { return d.size; })]);

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
	.data(data.children[question].children)
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
	var width = 960,
	height = 800,
	radius = Math.min(width, height) / 2;

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


	var svg = d3.select("body").append("svg")
	.attr("id", "graphic")
	.attr("class", "pizza")
	/*.attr("width", width)
	.attr("height", height)*/

	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	
	d3.json(json, function(error, root) {
		if (error) return console.warn(error);
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
	rotulo=r;
    atualGraphi() ;
}
function alterQuest(question){
	questionNum = question;
	mudaSemestre(null);
}
function mudaQuantidadeAtributos(c) {
    qtdAtributos=c;
    mudaSemestre(null);
}