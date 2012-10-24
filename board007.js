		var canvas,context;
		var canvasO,contextO;

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

		var bgCol="white";
		var lineCol="black";

		var container;

		var parent=document.getElementById('board');

		var offsetX = 0;
		var offsetY = 0;

		

		function setDefaults()
		{
			canvasO = document.getElementById('board');
			contextO = canvasO.getContext('2d');
			canvasO.height = height;
			canvasO.width = width;

			addTempCanvas();

			started=false; 

		}

		function addTempCanvas()
		{
			container = canvasO.parentNode;	
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

			canvasO.addEventListener('mouseup', canvMouse, false);
		}

		function canvMouse(event)
		{
			if (selectedTool === "cursor") 
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
			context.strokeStyle=lineCol;
			if (event.clientX || event.clientY === 0)
			{
				x=event.clientX;
				y=event.clientY;

				if(selectedTool==="pencil"||selectedTool==="brush"||selectedTool==="eraser")
				{					
					if(selectedTool!=="pencil")
					{
						context.lineWidth=5;
					}

					if(selectedTool==="eraser")
					{	
						context.strokeStyle=bgCol;
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

				else if(selectedTool==="clearall"||selectedTool==="cursor")
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
			contextO.beginPath();
			contextO.drawImage(canvas, 0, 0);
			contextO.closePath();
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
			contextO.clearRect(0,0,width,height);
		}

        function startApp(){
//			$.fn.mColorPicker.init.replace = false;

            height=$(window).height()-50;
            width=$(window).width()-120;

            setDefaults();

            $(".tools").click(function(){
                $(".selected").removeClass("selected");
                $(this).addClass("selected");
                selectedTool=this.id;
                context.lineWidth=1;
                context.strokeStyle=lineCol;

                if(selectedTool!=="cursor")
                {
                    if(document.getElementById('board').childNodes.length===1)
                    {
                        if((selectedTool==="rect")||(selectedTool==="circle")||(selectedTool==="line"))
                        {
                            document.getElementById('cnvs').style.cursor="crosshair";
                        }
                        else if(selectedTool==="pencil")
                        {
                            $('#cnvs').css('cursor',"url('https://github.com/Shiti/Board/blob/master/Pencil.cur'),auto");
                        }
                        else if(selectedTool==="brush")
                        {
                            $('#cnvs').css('cursor',"url('Brush.cur'),auto");
                        }
                        else if(selectedTool==="eraser")
                        {
                            $('#cnvs').css('cursor',"url('eraser.cur'),auto");
                        }
                        else
                        {
                            document.getElementById('cnvs').style.cursor="default";
                        }
                        addTempCanvas();
                    }
                    if(selectedTool==="clearall")
                    {
                        clearCanvas();
                    }
                }
                else
                {
                    $('#tempImg').remove();
                }


            });


            /*$('#lineColor').mColorPicker();
             $('#lineColor').bind('colorpicked', function(){
             lineCol=($(this).val());
             context.strokeStyle=lineCol;
             });*/

        }

		function init(){
			gapi.hangout.data.submitDelta( {'board': JSON.stringify(canvasO), 'drawingBoard': JSON.stringify(canvas)} );
			gapi.hangout.onApiReady.add(function(eventObj) 
	                { 
		         	try{
		                	if (eventObj.isApiReady) { 
		                   		startApp(); 
		                  	} 
		                }
		                catch(e){
		                	console.log(e);
		                }
	                }); 
                }
                init();

