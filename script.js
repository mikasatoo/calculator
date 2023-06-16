// "add" operation
const add = function(x, y) {
    return x + y;
};

// "subtract" operation
const subtract = function(x, y) {
    return x - y;
};

// "multiply" operation - !! might need to change this to an array?? !!
const multiply = function(x, y) {
    return x * y;
};

// "divide" operation
const divide = function(x, y) {
    return x / y;
};

// "modulus" operation
const modulus = function(x, y) {
    return x % y;
};

// "sqrt" operation
const sqrt = function(x) {
    return Math.sqrt(x);
};

// "operate" function
function operate(x, operator, y) {
    result = operator(x, y);
    displayValue.textContent = result;
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
    console.log(digit);

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
    // Set num1 to currentValue if NOT blank (converted into a number)
    if (currentValue !== "") num1 = Number(currentValue);

    // If operator is blank, set OperatorValue1 and text for displayOperation
    if (operatorValue1 === "") {
        operatorValue1 = operatorId;
        displayOperation.textContent = currentValue + " " + operatorDisplay;
    // Else, set OperatorValue2 and append to displayOperation
    } else {
        operatorValue2 = operatorId;
        displayOperation.textContent += " " + operatorDisplay;
    }
    
    // Reset currentValue and decimalAccepted
    currentValue = "";
    updateCurrentValue("");
    decimalAccepted = "yes";
};



// ***** UP TO THIS FUNCTION 
    // - OPERATE FUNCTION ABOVE NOT WORKING (NEED TO OBJECTS FOR THE OPERATOR FUNCTIONS)
    // - NEED TO CONSIDER HOW TO ADJUST FOR sqrt BEING USED AS operatorValue1 OR operatorValue2
// *****

    // Function to set second number for the calc when "equals" is selected
    // !! OR when another operator is selected!!
function setCalcVariables2() {
    // Set num2 to currentValue if NOT blank (converted into a number)
    if (currentValue !== "") num2 = Number(currentValue);

    // Call the operate() function
    // If there is only one operator
    if (operatorValue2 === "") {
        operate(num1, operatorValue1, num2);
        displayOperation.textContent += " " + currentValue + "=";
    // Else if there are two operators
    } else {
        operate();
    }
    
    // Reset currentValue and decimalAccepted
    currentValue = "";
    updateCurrentValue("");
    decimalAccepted = "yes";
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
            // If operatorValue1 is blank 
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
        // if currentValue is NOT blank
            // OR if operatorValue1 is "sqrt" AND num1 is NOT undefined
            // call the setCalcVariables2() function
        if (currentValue !== "" || operatorValue1 === "sqrt" && num1 !== undefined) {
            setCalcVariables2();
        // Else, display an alert message
        } else {
            alert("You have not entered a valid operation!");
        };
    });
};

// Initialization
makeDigitsClickable();
makeOperatorsClickable();
makeEqualsClickable();