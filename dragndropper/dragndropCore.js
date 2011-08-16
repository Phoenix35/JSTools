	var DragnDrop = {
		dragObject: null, // The dragged object
		parentObject: null, // The object used to bind dragging of dragObject
		
		dragObjectWidth: 0, // The width of the dragObject
		dragObjectHeight: 0, // The height of the dragObject
		parentObjectWidth: 0, // The binder's width
		parentObjectHeight: 0, // The binder's height
		
		positionX: 0, // The dragged object's position towards the container
		positionY: 0, // The dragged object's position towards the container
		
		mouseX: 0, // The cursor's coordinates
		mouseY: 0, 
		
		mouseOffsetX: 0, // The cursor's coordinates, taking the topleft corner of the dragged object as the origin
		mouseOffsetY: 0,
		
		parentPositionX: 0, // The origin point of the binding object, taking the (0,0) body point as the origin
		parentPositionY: 0,
		
		getMouseOffset: function(target, ev)
		{
			ev = ev || window.event;

			DragnDrop.getPosition(target, 1); // Getting the position of the object
			DragnDrop.mouseCoords(ev); // Getting the coordinates of the mouse
			// We update the difference between the mouse's position and the block's to be sure we don't have erratic movement.
			DragnDrop.mouseOffsetX = DragnDrop.mouseX - DragnDrop.positionX;
			DragnDrop.mouseOffsetY = DragnDrop.mouseY - DragnDrop.positionY;
		},
		
		// Get the position of the element that we are moving.
		getPosition: function(e, type)
		{		
			var left = 0;
			var top  = 0;

			while (e.offsetParent)
			{
				left += e.offsetLeft;
				top  += e.offsetTop;
				e     = e.offsetParent;
			}

			left += e.offsetLeft;
			top  += e.offsetTop;
			
			// Insert those new values in the object
			if(type == 1) // Mover
			{
				DragnDrop.positionX = left;
				DragnDrop.positionY = top;
			}
			else // Parent node used to bind it
			{
				DragnDrop.parentPositionX = left;
				DragnDrop.parentPositionY = top;
			}
		},
		
		mouseMove: function(ev)
		{
			ev = ev || window.event;
			DragnDrop.mouseCoords(ev); // Update mouse coordinates every time the mouse moves
			
			// As a consequence, update positionning of the element, regarding the new mouse coordinates
			if(DragnDrop.dragObject)
			{				
				DragnDrop.dragObject.style.position = 'absolute';
				
				var positionLeft = DragnDrop.mouseX - DragnDrop.mouseOffsetX - DragnDrop.parentPositionX;
				if(positionLeft < 0)
					positionLeft = 0;
				else if(positionLeft > (DragnDrop.parentObjectWidth - DragnDrop.dragObjectWidth))
					var positionLeft = DragnDrop.parentObjectWidth - DragnDrop.dragObjectWidth;
				
				
				var positionTop = DragnDrop.mouseY - DragnDrop.mouseOffsetY - DragnDrop.parentPositionY;
				if(positionTop < 0)
					var positionTop = 0;
				else if(positionTop > (DragnDrop.parentObjectHeight - DragnDrop.dragObjectHeight))
					var positionTop = DragnDrop.parentObjectHeight - DragnDrop.dragObjectHeight
				
				
				DragnDrop.dragObject.style.top = positionTop + "px";
				DragnDrop.dragObject.style.left = positionLeft + "px";
				DragnDrop.dragObject.style.cursor = "move";
				
				// Also give informations
				document.getElementById("cp1").value = positionLeft;
				document.getElementById("cp2").value = positionTop;
				document.getElementById("cp3").value = positionLeft + DragnDrop.dragObjectWidth;
				document.getElementById("cp4").value = positionTop + DragnDrop.dragObjectHeight;
				
				return false;
			}
		},
		
		// Release the moving node. Triggered by document.onmouseup
		mouseUp: function()
		{
			DragnDrop.dragObject = null;
		},
		
		makeDraggable: function(item, parent)
		{
			// We are hooking a block so that it becomes movable
			if(!item) return;
		
			item.onmousedown = function(ev)
			{
				// Set the item as dragged
				DragnDrop.dragObject = this;
				// Get mouse's coordinates against the topleft corner of the dragged element
				DragnDrop.getMouseOffset(this, ev);
				
				// Defining parent boject
				DragnDrop.parentObject = parent;
				DragnDrop.getPosition(parent, 0); // Store the parent's position
				
				// Saving in the JS object
				DragnDrop.dragObjectWidth = Number(this.style.width.replace('px',''));
				DragnDrop.dragObjectHeight = Number(this.style.height.replace('px',''));
				DragnDrop.parentObjectWidth = Number(parent.style.width.replace('px',''));
				DragnDrop.parentObjectHeight = Number(parent.style.height.replace('px',''));
				return false;
			}
		},
		
		// Update the JS object's values for the mouse's position. This function is triggered by document.onmousemove
		mouseCoords: function(ev)
		{
			if(ev.pageX || ev.pageY)
			{
				DragnDrop.mouseX = ev.pageX;
				DragnDrop.mouseY = ev.pageY;
				return;
			}
			DragnDrop.mouseX = ev.clientX + DragnDrop.parentObject.scrollLeft - DragnDrop.parentObject.clientLeft;
			DragnDrop.mouseY = ev.clientY + DragnDrop.parentObject.scrollTop - DragnDrop.parentObject.clientTop;
		},
		
		resizeMover: function(i, w, h)
		{
			DragnDrop.dragObjectWidth = w;
			DragnDrop.dragObjectHeight = h;
			if(node = document.getElementById(i))
			{
				node.style.width = w;
				node.style.height = h;
				// Placing it back to topleft corner to avoid strange behavior
				node.style.left = 0;
				node.style.top = 0;
			}
		}
	};
	
	document.onmousemove = DragnDrop.mouseMove;
	document.onmouseup   = DragnDrop.mouseUp;
	
	window.addEventListener("load", function() { DragnDrop.makeDraggable(document.getElementById('drag'), document.getElementById('dragParent')) }, false);