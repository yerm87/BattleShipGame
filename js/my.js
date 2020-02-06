//view module
var view={
	displayMessage: function(msg){
	    const messageArea = document.querySelector("#messageArea");
	    messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		const cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		const cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

//model
const model = {
	boardSize: 7,
	shipsNumber: 3,
	shipLength: 3,
	sunkShips: 0,
	ships: [
	   { location: ["", "", ""], hits: ["", "", ""] },
	   { location: ["", "", ""], hits: ["", "", ""] },
	   { location: ["", "", ""], hits: ["", "", ""] }
	],
	fire: function(guess){
		for(let i=0; i<this.shipsNumber; i++){
			const ship = this.ships[i];
			const index = ship.location.indexOf(guess);

			if(index>=0){
				ship.hits[index] = "hit";
				view.displayMessage("Good shot!")
				view.displayHit(guess);

				if(this.shipIsSunk(ship)){
					view.displayMessage("You drowned ship!!!");
					this.sunkShips++;
				}

				return true;
			}
		}
		
		view.displayMiss(guess);
		view.displayMessage("You missed...");
		
		return false;
	},

	shipIsSunk: function(ship){
		for(let i=0; i<this.shipLength; i++){
			if(!ship.hits[i].includes("hit")){
				return false
			}
		}
		return true
	},

	generateLocation: function(){
		let location;
		
		for(var i=0; i<this.shipsNumber; i++){
			do{
				location = this.generateShip();
			} while(this.collision(location));
			this.ships[i].location = location;
			
			console.log(this.ships);
		}
	},
	generateShip: function(){
			const x = Math.floor(Math.random()*2);
			let row;
			let column;

			if(x === 1){
				row = Math.floor(Math.random()*this.boardSize);
				column = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
			} else {
				row = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
				column = Math.floor(Math.random()*this.boardSize);
			}

			const arrayLocation = [];
			for(let i=0; i<this.shipLength; i++){
				if(x === 1){
				    arrayLocation.push(row+""+(column+i));
			    } else{
			    	arrayLocation.push((row+i)+""+column);
			    }
			}
			return arrayLocation;
	},
	collision: function(location){
		for(let i=0; i<this.shipsNumber; i++){
			const ship = this.ships[i];
			
			for(j=0; j<location.length; j++){

				if(ship.location.indexOf(location[j])>=0){			
					return true;
				}
			}
		}
		return false;
	}
};

//controller
const controller = {
	guesses: 0,
	guessProcess: function(guess){
		const location = generatedGuess(guess);

		if(location){
			this.guesses++;
			const hit = model.fire(location);

			if(hit && model.shipsNumber == model.sunkShips){
				view.displayMessage("You won!!! You made: " + this.guesses + " shots");

			}
		}
	}
};
const generatedGuess = guess => {
	const array = ["A", "B", "C", "D", "E", "F", "G"];

	if(guess === null || guess.length !== 2){
		alert("Enter valid value (example: 'A3')");
	} else{
		const charset = guess.charAt(0);
		const row = array.indexOf(charset);
		const column = guess.charAt(1);

		if(isNaN(row) || isNaN(column)){
			alert("Enter valid value (example: 'A3')");
		} else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("Enter valid value (example: 'A3')");
		} else{
			return row + column;
		}
	}
	return null;
}

const init = () => {
	const fireButton = document.getElementById("fireButton");
	fireButton.onclick = listenerOnClick;

	const inputField = document.getElementById("guessInput");
	inputField.onkeypress = listenerOnKeyPress;

	model.generateLocation();
}
const listenerOnClick = () => {
	const inputField = document.getElementById("guessInput");
	const guess = inputField.value;
	controller.guessProcess(guess);

	inputField.value = "";
}
const listenerOnKeyPress = event => {
	const fireButton = document.getElementById("fireButton");

	if(event.keyCode === 13){
		fireButton.click();
		return false;
	}
};

window.onload = init;
