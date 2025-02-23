
function generateRandomArray(size) {
    startTimer();
    setTimeout(function() {
        return `The array is ${arr}. The time taken was ${milliseconds} milliseconds.`;
    }, 1000)
}

let milliseconds = 0;
let array;
function startTimer() {
    let interval = setInterval(() => {
        millieseconds++;
    }, 1);
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100000));
    }
    array = arr
    endTimer();
}

function endTimer() {
    clearInterval(interval);
}

// Use this random array to test the functions
let randomArray = generateRandomArray(40000);

function function_1(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] > max) {
                max = arr[j];
            }
        }
    }
    return max;
}

function function_2(arr){
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}