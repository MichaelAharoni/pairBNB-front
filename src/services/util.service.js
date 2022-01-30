export const utilService = {
    makeId,
    makeLorem,
    getRandomInt,
    delay,
    shuffleArray,
    getRandomName,
    generate,
    sortByWords,
    sortByNums
}

function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function shuffleArray(array) {
    var nums = [];
    for (var i = 0; i < array.length; i++) {
        var idx = getRandomInt(0, array.length - 1);
        var currNum = array[idx];
        nums[i] = currNum;
        array.splice(idx, 1);
    }
    return nums;
}

function generate(genLength = 5, str = 'abcdefghijklmnopqrst0123456789uvwxyzABCDEFGHIJKLMNOPQRSTUVWKYZ') {
    var res = '';
    var randIdx = 0;
    for (var i = 0; i < genLength; i++) {
        randIdx = Math.floor(Math.random() * str.length);
        res += str.charAt(randIdx);
    }
    return res;
}

function getRandomName(length = 4) {
    var str = 'abcdefghijklmnopqrstuvwxyz';
    var randomWord = '';
    for (var i = 0; i < length; i++) {
        var randIdx = parseInt(Math.random() * str.length)
        randomWord += str.charAt(randIdx);
        if (!i) randomWord = randomWord.toUpperCase();
    }
    return randomWord
}

function sortByWords(words) {
    words.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

function sortByNums(numbers) {
    numbers.sort(function (a, b) {
        return b.avg - a.avg;
    });
}



function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
    var txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

