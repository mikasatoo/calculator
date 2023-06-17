// Object with each operator function
const operations = {
    add: function(x, y) {
        return x + y;
    },

    subtract: function(x, y) {
        return x - y;
    },

    multiply: function(x, y) {
        return x * y;
    },

    divide: function(x, y) {
        return x / y;
    },

    modulus: function(x, y) {
        return x % y;
    },

    sqrt: function(x) {
        return Math.sqrt(x);
    }
};

// References to HTML elements
const digitButtons = document.querySelectorAll("button.digit");
const decimalButton = document.getElementById(".");
const operatorButtons = document.querySelectorAll("button.operator");
const displayValue = document.getElementById("display-value");
const displayOperation = document.getElementById("display-operation");
const equalsButton = document.getElementById("equals");

// Other global variables
let decimalAccepted = "yes";    // indicates whether a decimal can be accepted in the current value
let currentValue = "";
let num1;
let operatorValue1 = "";
let operatorValue2 = "";
let num2;
let result;

// Function to run when digit is clicked
function selectDigit(digit) {
    // Call the updateCurrentValue() function
    updateCurrentValue(digit);

    // If the "." button has been clicked, change decimalAccepted setting to "no"
    if (digit === ".") {
        decimalAccepted = "no";
    };
};

// Function to update and display value as digits are entered
function updateCurrentValue(digit) {
    currentValue += digit;
    displayValue.textContent = currentValue;
};

// Function to set first number and operator/s for the calc when operator is selected
function setCalcVariables1(operatorId, operatorDisplay) {
    // Set value of num1:
    // If currentValue is blank and operatorId is NOT sqrt, set num1 to zero
    if (currentValue === "" && operatorId !== "sqrt") {
        num1 = 0;
        updateCurrentValue("0");
    // Else if currentValue is NOT blank, set num1 to currentValue (converted into a number)
    } else if (currentValue !== "") {
        num1 = Number(currentValue);
    };

    // If operator is blank, set OperatorValue1 and text for displayOperation
    if (operatorValue1 === "") {
        operatorValue1 = operatorId;
        displayOperation.textContent = currentValue + " " + operatorDisplay;
    // Else, set OperatorValue2 and append to displayOperation
    } else {
        operatorValue2 = operatorId;
        displayOperation.textContent += " " + operatorDisplay;
    };
    
    // Reset currentValue and decimalAccepted
    currentValue = "";
    displayValue.textContent = currentValue;
    decimalAccepted = "yes";
};

// Function to set number/s and operator/s for the calc when "equals" is selected
// ***** OR when another operator is selected
function setCalcVariables2() {
    // Set value of num1 or num2:
    // If currentValue is NOT blank...
    if (currentValue !== "") {
        // If num1 has not been defined yet (e.g. when using "sqrt"), set num1 to currentValue (converted into a number)
        if (num1 === undefined) {
            num1 = Number(currentValue);
        // Else, set num2 to currentValue (converted into a number)
        } else {
            num2 = Number(currentValue);
        };
    };

    // Call the operate() function:
    // If there is only one operator...
    if (operatorValue2 === "") {
        // If the operator is "sqrt", pass in only num1
        if (operatorValue1 === "sqrt") {
            operate(num1, operatorValue1);
        // Else, pass in num1 and num2
        } else {
            operate(num1, operatorValue1, num2);
        };
    // Else if there are two operators (operatorValue2 being "sqrt"), pass in num1, num2, and both operators
    } else {
        operate(num1, operatorValue1, num2, operatorValue2);
    };
    displayOperation.textContent += " " + currentValue + " " + "=";
    
    // Reset currentValue and decimalAccepted
    currentValue = "";
    decimalAccepted = "yes";
};

// Function to call relevant operation and display result (rounded to 10 dec. places)
function operate(x, operator1, y, operator2) {
    // If y is not defined, pass in only x
    if (y === undefined) {
        result = operations[operator1](x);
    // Else if operator2 is not defined, pass in x and y
    } else if (operator2 === undefined) {
        result = operations[operator1](x, y);
    // Else, set z by passing y into the second operation (sqrt) and then pass x and z into the first operation
    } else {
        z = operations[operator2](y);
        result = operations[operator1](x, z);
    };

    displayValue.textContent = Number(result.toFixed(10));
};


// Add event listener (click) to each digit button
function makeDigitsClickable() {
    digitButtons.forEach((digitButton => {
        digitButton.addEventListener("click", () => {
            // Exit this run of the function if the "." button has been clicked and decimalAccepted is set to "no"
            if (digitButton.id === "." && decimalAccepted === "no") {
                return;
            // Else, call the selectDigit() function
            } else {
                selectDigit(digitButton.id);
            };
        });
    }));
};

// Add an event listener (click) to each operator button
function makeOperatorsClickable() {
    operatorButtons.forEach((operatorButton => {
        operatorButton.addEventListener("click", () => {
            // If operatorValue1 is blank (i.e. no operator has been defined yet)
                // OR if operatorValue1 is not "sqrt" AND the "sqrt" button has been clicked AND operatorValue2 is blank (not yet entered), 
                // call the setCalcVariables1() function
            if ((operatorValue1 === "") || (operatorValue1 !== "sqrt" && operatorButton.id === "sqrt" && operatorValue2 === "")) {
                setCalcVariables1(operatorButton.id, operatorButton.textContent);
            // Else, exit this run of the function
            } else {
                return;
            };
        });
    }));
};

// Add an event listener (click) to the "equals" button
function makeEqualsClickable() {
    equalsButton.addEventListener("click", () => {
        // Call the setCalcVariables2() function if operatorValue1 and currentValue are NOT blank 
            // (i.e. one operator and two numbers OR sqrt and one number have been selected/entered)
        if ((operatorValue1 !== "" && currentValue !== "")) {
            setCalcVariables2();
        };
        // Otherwise, do nothing
    });
};

// Initialization
makeDigitsClickable();
makeOperatorsClickable();
makeEqualsClickable();