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
const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");

// Other global variables
let isDecimalAccepted = "yes";
let currentValue = "";
let num1;
let operator;
let extraSqrtOperator;
let num2;
let nextOperator;
let result;

// Function to update currentValue and isDecimalAccepted when digit is clicked
function selectDigit(digit) {
    const isDecimal = digit === ".";

    updateCurrentValue(digit);
    if (isDecimal) isDecimalAccepted = "no";
};

// Function to update and display currentValue as digits are entered
function updateCurrentValue(digit) {
    const isDisplayOperationBlank = displayOperation.textContent === "";
    const isOperatorDefined = operator != undefined;

    currentValue += digit;

    if (!isDisplayOperationBlank && !isOperatorDefined) {
        displayOperation.textContent = currentValue;
    } else {
        displayValue.textContent = currentValue;
    };
};

// Function to set first number in the calculator operation when operator is selected
function setNum1(operatorId) {
    const isCurrentValueBlank = currentValue === "";
    const isThisOperatorSqrt = operatorId === "sqrt";
    const isResultDefined = result != undefined;

    if (isCurrentValueBlank) {
        if (isResultDefined) {
            num1 = result;
        } else if (!isThisOperatorSqrt) {
            num1 = 0;
            updateCurrentValue("0");
        };
    } else if (!isCurrentValueBlank) {
        num1 = Number(currentValue);
    };
};

// Function to set operator in the calculator operation when operator is selected
function setOperator(operatorId, operatorDisplay) {
    operator = operatorId;
    displayOperation.textContent = currentValue + " " + operatorDisplay;

    currentValue = "";
    displayValue.textContent = currentValue;
    isDecimalAccepted = "yes";
};

// Function to set extraSqrtOperator in the calculator operation when sqrt operator is selected
function setExtraSqrtOperator(operatorId, operatorDisplay) {
    extraSqrtOperator = operatorId;
    displayOperation.textContent += " " + operatorDisplay;
};

// Function to set second number in the calculator operation when "equals" or another operator is selected
    // and call the getResult() function
function setNum2(operatorId) {
    const isEqualsSelected = operatorId === "equals";

    num2 = Number(currentValue);
    if (!isEqualsSelected) nextOperator = operatorId;
    getResult();

    currentValue = "";
    displayValue.textContent = currentValue;
    isDecimalAccepted = "yes";
};

// Function to get the result by calling the relevant operation
function getResult() {
    const isNum1Defined = num1 != undefined;
    const isExtraSqrtOperatorDefined = extraSqrtOperator != undefined;

    if (!isNum1Defined) {   // operation is sqrt of num2
        result = operations[operator](num2);
    } else if (!isExtraSqrtOperatorDefined) {   // operation is operator of num1 and num2
        result = operations[operator](num1, num2);
    } else {    // operation is operator of num1 and (sqrt of num2)
        let intermediate = operations[extraSqrtOperator](num2); 
        result = operations[operator](num1, intermediate);
    };
};

// Function to display result (rounded to 10 dec. places) when "equals" or another operator is selected
    // and reset and redefine variables
function displayResult(buttonId, buttonDisplay) {
    const isEqualsSelected = buttonId === "equals";
    
    if (isEqualsSelected) {
        displayOperation.textContent += " " + currentValue + " " + "=";
        num1 = null;
        operator = null;
    } else {
        displayOperation.textContent = Number(result.toFixed(10)).toString() + " " + buttonDisplay;
        num1 = result;
        operator = nextOperator;
    };

    displayValue.textContent = Number(result.toFixed(10)).toString();
    extraSqrtOperator = null;
    num2 = null;
};

// Function to delete the last digit entered when the DELETE button is clicked (and a number is being entered)
function deleteLastDigit() {
    const lastDigit = currentValue.substring(currentValue.length - 1, currentValue.length);
    const isDisplayValueBlank = displayValue.textContent === "";

    if (lastDigit === ".") isDecimalAccepted = "yes";
    currentValue = currentValue.substring(0, currentValue.length - 1);

    if (!isDisplayValueBlank) {
        displayValue.textContent = currentValue;
    } else {
        displayOperation.textContent = currentValue;
    };
};

// Function to delete the last operator when the DELETE button is clicked (and an operator was last entered)
function deleteLastOperator() {
    const isExtraSqrtOperatorDefined = extraSqrtOperator != undefined;
    const isNum1Defined = num1 != undefined;

    if (!isExtraSqrtOperatorDefined) {
        operator = null;
        if (isNum1Defined) {
            currentValue = num1.toString();
            num1 = null;
            if (currentValue.includes(".") === true) isDecimalAccepted = "no";
        };
    } else {
        extraSqrtOperator = null;
    };

    let operationStr = displayOperation.textContent;
    operationStr = operationStr.substring(0, operationStr.length - 2);
    displayOperation.textContent = operationStr;
};

// Function to reset all data (stored values and display) when the CLEAR button is clicked
function clearData() {
    isDecimalAccepted = "yes";
    currentValue = "";
    operator = null;
    extraSqrtOperator = null;
    num1 = null;
    num2 = null;
    nextOperator = null;
    result = null;

    displayValue.textContent = "";
    displayOperation.textContent = "";
};


// Add event listener (click) to each digit button
function makeDigitsClickable() {
    digitButtons.forEach((digitButton => {
        digitButton.addEventListener("click", () => {
            const isDecimal = digitButton.id === ".";

            if (isDecimal && isDecimalAccepted === "no") {
                return;
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
            const isOperatorDefined = operator != undefined;
            const isExtraSqrtOperatorDefined = extraSqrtOperator != undefined;
            const isThisOperatorSqrt = operatorButton.id === "sqrt";
            const isCurrentValueBlank = currentValue === "";

            if (!isOperatorDefined) {
                setNum1(operatorButton.id);
                setOperator(operatorButton.id, operatorButton.textContent);
            } else if (!isExtraSqrtOperatorDefined && isThisOperatorSqrt) {
                setExtraSqrtOperator(operatorButton.id, operatorButton.textContent);
            } else if (isOperatorDefined && !isCurrentValueBlank) {
                setNum2(operatorButton.id);
                displayResult(operatorButton.id, operatorButton.textContent);
            };
        });
    }));
};

// Add an event listener (click) to the "equals" button
function makeEqualsClickable() {
    equalsButton.addEventListener("click", () => {
        const isCurrentValueBlank = currentValue === "";
        const isOperatorDefined = operator != undefined;
        
        if (isOperatorDefined && !isCurrentValueBlank) {
            setNum2(equalsButton.id);
            displayResult(equalsButton.id, equalsButton.textContent);
        };
    });
};

// Add an event listener (click) to the "DELETE" button
function makeDeleteClickable() {
    deleteButton.addEventListener("click", () => {
        const isCurrentValueBlank = currentValue === "";
        const isOperatorDefined = operator != undefined;
        const isExtraSqrtOperatorDefined = extraSqrtOperator != undefined;

        if (!isCurrentValueBlank) {
            deleteLastDigit();
        } else if (isCurrentValueBlank && (isOperatorDefined || isExtraSqrtOperatorDefined)) {
            deleteLastOperator();
        };
    });
};

// Add an event listener (click) to the "CLEAR" button
function makeClearClickable() {
    clearButton.addEventListener("click", () => {
        clearData();
    });
};


// Initialization
makeDigitsClickable();
makeOperatorsClickable();
makeEqualsClickable();
makeDeleteClickable();
makeClearClickable();