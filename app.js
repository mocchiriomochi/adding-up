'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefactureMap = new Map();

rl.on('line', lineString => {

    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefacture = columns[1];
    const popu = parseInt(columns[3]);

    if (year === 2010 || year === 2015) {

        var data = prefactureMap.get(prefacture) || { popu10: 0, popu15: 0, change: null };

        if (year === 2010) {
            data.popu10 = popu;
        } else {
            data.popu15 = popu;
        }

        if (prefactureMap.has(prefacture) === false) {
            prefactureMap.set(prefacture, data);
        }
    }
});

rl.on('close', () => {
    prefactureMap.forEach((val) => val.change = val.popu15 / val.popu10);
    const sortArray = Array.from(prefactureMap).sort((a, b) => b[1].change - a[1].change)    // 降順ソートする
    const resultStr = sortArray.map(([key, value]) => key + ": " + value.popu10 + "=>" + value.popu15 + "  変化率:" + value.change);
    console.log(resultStr);
});

