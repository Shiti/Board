		var canvas,context;
		var canvaso,contexto;
		
		var startX=0;
		var startY=0;
		
		var endX=0;
		var endY=0;
		
		var diffX=0;
		var diffY=0;
		
		var height=0;
		var width=0;

		var selectedTool;
		
		var started;
		
		var x,y;
		
		var bgcol="white";
		var linecol="black";
		
		var container;
		
		var parent=document.getElementById('board');
		
		var offsetX = 0;
		var offsetY = 0;

		function startApp(){
			$.fn.mColorPicker.init.replace = false;

				height=$(window).height()-50;
				width=$(window).width()-120;
				
				init();
				
				$(".tools").click(function(){
					$(".selected").removeClass("selected");
					$(this).addClass("selected");
					selectedTool=this.id;
					context.lineWidth=1;
					context.strokeStyle=linecol;
					
					if(selectedTool!="cursor")
					{
						if(document.getElementById('board').childNodes.length==1)
						{
							if((selectedTool=="rect")||(selectedTool=="circle")||(selectedTool=="line"))
							{
								document.getElementById('cnvs').style.cursor="crosshair";
		                                        }
							else 
							{
								document.getElementById('cnvs').style.cursor="default";
							}
							addTempCanvas();
						}
						if(selectedTool=="clearall")
						{
							clearCanvas();
						}
					}
					else 
					{
						$('#tempImg').remove();
					}
					
					
				});

				
				$('#linecolor').mColorPicker();
				$('#linecolor').bind('colorpicked', function(){
					linecol=($(this).val());
					context.strokeStyle=linecol;
				});

		}
		
		function init()
		{
			canvaso = document.getElementById('board');
			contexto = canvaso.getContext('2d');
			canvaso.height = height;
			canvaso.width = width;
			
			addTempCanvas();
			
			started=false; 

		}
		
		function addTempCanvas()
		{
			container = canvaso.parentNode;	
			canvas = document.createElement('canvas');
			canvas.id     = 'tempImg';
			canvas.width  = width;
			canvas.height = height;
			container.appendChild(canvas);
			context = canvas.getContext('2d');
			
			canvas.addEventListener('mousedown',mouseDown,false);
			canvas.addEventListener('mouseup',mouseUp,false);
			canvas.addEventListener('mousemove',mouseMove,false);
			canvas.addEventListener('mouseout',mouseOut,false);
			
			canvaso.addEventListener('mouseup', canvMouse, false);
		}

		function canvMouse(event)
		{
			if (selectedTool == "cursor") 
			{
				startX=event.screenX;
				startY=event.screenY;
			}
		}
		
		function mouseOut(event)
		{
			started=false;
		}
			
		function mouseMove(event)
		{
			context.strokeStyle=linecol;
			if (event.clientX || event.clientY == 0)
			{
				x=event.clientX;
				y=event.clientY;

				if(selectedTool=="pencil"||selectedTool=="brush"||selectedTool=="eraser")
				{					
					if(selectedTool!="pencil")
					{
						context.lineWidth=5;
					}
					
					if(selectedTool=="eraser")
					{	
						context.strokeStyle=bgcol;
					}
					
					if (started) 
					{
						context.lineTo(x, y);
						context.stroke();
						
					} 
					else 
					{
						context.beginPath();
						context.moveTo(x, y);
					}
				}
				
				else if(selectedTool=="clearall"||selectedTool=="cursor")
				{
				}
				else 
				{
					if(started)
					{
						context.clearRect(0, 0,width,height);
						drawShape(selectedTool,startX,startY,x,y);
					}
				}
			}
		}
		
		function mouseDown(event)
		{	
			startX=event.clientX;
			startY=event.clientY;
			started=true;
		}
		
		function mouseUp(event)
		{
			endX=event.clientX;
			endY=event.clientY;
			started=false;

			drawShape(selectedTool,startX,startY,endX,endY);
			img_update();
		}
		
		function img_update() 
		{
			contexto.beginPath();
			contexto.drawImage(canvas, 0, 0);
			contexto.closePath();
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		function drawShape(tool,cornerX,cornerY,corner2X,corner2Y)
		{
			switch(tool)
			{
				case "line": 
				{
					context.beginPath();
					context.moveTo(cornerX,cornerY);
					context.lineTo(corner2X,corner2Y);
					context.stroke();
					context.closePath();
				}
				break;
		
				case "rect":
				{			
					diffX=-corner2X+cornerX;
					diffY=-corner2Y+cornerY;
					context.strokeRect(cornerX,cornerY,-diffX,-diffY);			
				}
				break;

				case "circle":
				{
					x=(cornerX+corner2X)/2;
					y=(cornerY+corner2Y)/2;
					diffX=(cornerX-corner2X)*(cornerX-corner2X);
					diffY=(cornerY-corner2Y)*(cornerY-corner2Y);
					var radius=Math.sqrt(diffX+diffY)/2;
					context.beginPath();
					context.arc(x,y,radius,0,2*Math.PI,false);
					context.stroke();
				}
				break;
			}
		}
		

		function clearCanvas()
		{
			contexto.clearRect(0,0,width,height);
		}

		gapi.hangout.onApiReady.add(function(eventObj) 
                { 
                   if (eventObj.isApiReady) { 
                   	startApp(); 
                  }  
                }); 
