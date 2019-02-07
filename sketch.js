function create2DArray(cols, rows) { //a 2D array is needed to store the state of each cell in the grid
	let gridArr = new Array(cols); //create an array for the columns in the grid
	for (let i = 0; i < gridArr.length; i++) { //loop through every value in the array
		gridArr[i] = new Array(rows); //create a rows array within each cell of our columns array
	}
	return gridArr;
}

let scale = 20; //can be edited to control the number of cells on the grid (lower values produce more cells)

function setup() { //used by p5.js to setup the canvas
  frameRate(8); //the game will run at 8 frames per second
  createCanvas(600, 400); //create a canvas 600 pixels wide, 400 pixels tall
	cols = width / scale; //calculate the number of columns on the grid
	rows = height / scale; //calculate the number of rows on the grid
	grid = create2DArray(cols, rows); //create a 2D array with this number of columns and rows
	for (let i = 0; i < cols; i++) { //loop through every cell in our 2D array and give them all a value of 0 (dead) by default
		for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
      document.getElementById("randomBtn").addEventListener("click", function() { //if the randomise button is pressed...
  			grid[i][j] = floor(random(2)); //set the value of all cells to 0 or 1 randomly
  		});
		}
	}
}

function draw() { //used by p5.js to draw onto the canvas
  background(0);
	for (let i = 0; i < cols; i++) { //for every cell on the grid
		for (let j = 0; j < rows; j++) {
			let x = i * scale;
			let y = j * scale;
			if (grid[i][j] == 1) { //if the cell is alive
				fill(255); //fill it with a white square
				rect(x, y, (scale-1), (scale-1));
			}
		}
	}
  document.getElementById("startBtn").addEventListener("click", function() { //when the start button is clicked...
  	setInterval( function() { //do the following once per interval...
  	next = create2DArray(cols, rows); //create a 2D array for the next stage of the game
  		for (let i = 0; i < cols; i++) {
  			for (let j = 0; j < rows; j++) {
  				next[i][j] = grid[i][j]; //inherit the current state of the game
  				let cell = grid[i][j];
  				let neighbours = countNeighbours(grid, i, j); //count the number of neighbours each cell has, using the countNeighbours function

  				if (cell == 1 && neighbours < 2) { //if a living cell has less than 2 neighbours, it dies
  					next[i][j] = 0;
  				} else if (cell == 1 && neighbours > 3) { //if a living cell has more than 3 neighbours, it dies
  					next[i][j] = 0;
  			  } else if (cell == 1 && (neighbours == 2 || neighbours == 3)) { //if a living cell has 2 or 3 neighbours, it stays alive
  					next[i][j] = 1;
  			  } else if (cell == 0 && neighbours == 3) { //if an empty cell has exactly 3 neighbours, a living cell is created
  					next[i][j] = 1;
  				}
  		}
  	}
  	grid = next; //change the grid to the next stage
  }, 500); //repeat every 500ms
  });
}

function countNeighbours(grid, x, y) { //takes the state of the grid and the position of a cell
	let sum = 0;
	for (let i = -1; i < 2; i++) { //loop through cells which may have living neighbours
		for (let j = -1; j < 2; j++) {
			let col = (x + i + cols) % cols; //calculate the positions of potential neighbours
			let row = (y + j + rows) % rows;
			sum += grid[col][row]; //add the value of these cells to the total
		}
	}
	sum -= grid[x][y]; //prevents cells from counting towards their own neighbour count
	return sum;
}

function mousePressed(gridArr) { //p5 will check if the mouse is currently pressed, when this happens...
	for (let i = 0; i < cols; i++) { //for each cell in the grid...
		for (let j = 0; j < rows; j++) {
					let x = i * scale; //convert the values to a measurable position
					let y = j * scale;
  		if (mouseX > x && mouseX < x + scale && mouseY > y && mouseY < y + scale){ //if the mouse was clicked within a cell...
				grid[i][j] = 1; //the cell gains life
			}
		}
  }
}
