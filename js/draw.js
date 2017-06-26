function drawTreemap(i,semest,width,height) {
	var margin = {top: 40, right: 10, bottom: 10, left: 10};
	var treemap = d3.layout.treemap()
	.size([width, height])
	.sticky(true)
	.value(function(d) { return d.size; });

	d3.select("#graphics").append("div")
	.attr("id", "graphic"+i)
	.attr("class", "graphic treeMap")
	div = d3.select("#graphic"+i).append("div")
	.attr("id", "g")
	.attr("class", "treeMap")
	.style("position", "relative");
	//if (error) throw error;
	var root = eval(uneval(jsonData[semest]));
	console.log(treemap.nodes);
	console.log(div[0]);
	console.log("drawTree----Posi:"+i)
	console.log("drawTree----Object:");
	console.log(root)
	var node = div.datum(root).selectAll(".node")
	.data(treemap.nodes)
	.enter().append("div")
	//.attr("class", "node")
	.attr("class", function(d) {T=d; return d.children ? "node pai" : "node filho"; })
	.call(position)
	.style("background", function(d,i) {if(i==0) return null;else return d.children ?  colored(d.name) : null })
	.text(function(d) { return d.children ? null : ""; });

	v=div;
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
		.text(function(d) { return d.children ? null : d.parent.name+'-'+d.name; });
    }else if (rotulo==6) {
    	node.append("text")
		.text(function(d) { return d.children ? null : ""; });
    }

	node.append("title").text(function(d) { if(d.children){return d.name}});
}

function drawSunburst(i,semest,width,height){
	var radius = Math.min(width, height) / 2 - 20,
	color = d3.scale.category20c();

	var svg = d3.select("#graphics").append("svg")
	.attr("class", "graphic sunburst")
	.attr("id", "graphic"+i)
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

	var root = eval(uneval(jsonData[semest]));
	var path = svg.datum(root).selectAll("path")
	.data(partition.nodes)
	.enter().append("path")
	.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	.attr("d", arc)
	.style("stroke", "#fff")
	.style("fill", function(d,i) { v=d;if(i==0) return null;else return d.children ?  colored(d.name) : colored(d.parent.name) })
	.style("fill-rule", "evenodd")
	.each(stash);
	d3.select(self.frameElement).style("height", height + "px");
}

function drawTifoldTree(i,semest,width,height){
	var radius = Math.min(width, height) / 2 - 20,
	color = d3.scale.category20c();
	var proporcao = (width>height)?(width/height):(height/width);

	var tree = d3.layout.tree()
	.size([360, radius - 120])
	.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

	var diagonal = d3.svg.diagonal.radial()
	.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

	var svg = d3.select("#graphics").append("svg")
	.attr("id", "graphic"+i)
	.attr("class", "graphic tifoldTree")
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var root = eval(uneval(jsonData[semest]));
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

	d3.select(self.frameElement).style("height", radius*2 - 150 + "px");
}
function drawBarGraphic(i,semest,width,height){
	var margin = {top: 120, right: 20, bottom: 30, left: 40};

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

	var svg = d3.select("#graphics").append("svg")
	.attr("id", "graphic"+i)
	.attr("class","graphic")

	var root = eval(uneval(jsonData[semest]));
	console.log(semest + " - " + jsonData[semest] + " - " +root.children+" - ");
	x.domain(root.children[questionNum].children.map(function(d) { return d.name; }));
	y.domain([0, d3.max(root.children[questionNum].children, function(d) { return d.size; })]);

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
	.data(root.children[questionNum].children)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return x(d.name); })
	.attr("width", x.rangeBand())
	.attr("y", function(d) { return y(d.size); })
	.attr("height", function(d) { return height - y(d.size); });
	

	
}

function drawPizza(i,semest,width,height){
	var radius = Math.min(width, height) / 2;
	
	var color = d3.scale.ordinal()
	.range(['#73becb','#2fb0cc','#69b487','#7b70c2','#8192cc','#81cc94','#7ecea3','#cea37e','#cec27e','#ce7e7e', "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 300);//deixar innerRadius igual a 0 pra que o gráfico vire um Gráfico de Pizza

	var pie = d3.layout.pie()
	.sort(null)
	.value(function (d) {
		return d.size;
	});

	var proporcao = (width>height)?(width/height):(height/width);
	var svg = d3.select("#graphics").append("svg")
	.attr("id", "graphic"+i)
	.attr("class", "graphic pizza")

	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var root = eval(uneval(jsonData[semest]));
	var g = svg.selectAll(".arc")
	.data(pie(root.children[questionNum].children))
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

}
function type(d) {
	d.size = +d.size;
	return d;
}
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

function position() {
	this.style("left", function(d) { return d.x + "px"; }) // deslocamento para a esquerda
	.style("top", function(d) { return d.y + "px"; })
	.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}