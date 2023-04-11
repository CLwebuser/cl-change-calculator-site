// worker.js
self.addEventListener("message", (e) => {
    const { oneYen, fiveYen, tenYen, fiftyYen, hundredYen, fiveHundredYen, thousandYen, fiveThousandYen, tenThousandYen, payment} = e.data;

// 合計金額を計算
let totalAmount = oneYen + 5 * fiveYen + 10 * tenYen + 50 * fiftyYen + 100 * hundredYen + 500 * fiveHundredYen + 1000 * thousandYen + 5000 * fiveThousandYen + 10000 * tenThousandYen;

// お釣りを計算
let change = totalAmount - payment;

if (change < 0) {
    self.postMessage({ type: "insufficient_payment" });
    return;
  }  

// DPテーブルを初期化
const dp = new Array(change + 1).fill(Infinity);
dp[0] = 0;
    
// コインの種類
const coins = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];

// DPテーブルを更新
for (let i = 0; i < coins.length; i++) {
for (let j = coins[i]; j <= change; j++) {
dp[j] = Math.min(dp[j], dp[j - coins[i]] + 1);
}
}

// 最適な支払いとお釣りを初期化
let bestPayment = {
    oneYen: 0,
    fiveYen: 0,
    tenYen: 0,
    fiftyYen: 0,
    hundredYen: 0,
    fiveHundredYen: 0,
    thousandYen: 0,
    fiveThousandYen: 0,
    tenThousandYen: 0
};

let bestChange = {
    oneYen: 0,
    fiveYen: 0,
    tenYen: 0,
    fiftyYen: 0,
    hundredYen: 0,
    fiveHundredYen: 0,
    thousandYen: 0,
    fiveThousandYen: 0,
    tenThousandYen: 0
};

// 最小のお釣り枚数を取得
let minChange = Infinity;

// お釣りの組み合わせのメモ化用オブジェクト
const memo = {};

// 制限
const maxPayment = payment + 10000;
const maxOneYen = Math.min(oneYen, Math.ceil(payment / 1));
const maxFiveYen = Math.min(fiveYen, Math.ceil(payment / 5));
const maxTenYen = Math.min(tenYen, Math.ceil(payment / 10));
const maxfiftyYen = Math.min(fiftyYen, Math.ceil(payment / 50));
const maxhundredYen = Math.min(hundredYen, Math.ceil(payment / 100));
const maxfiveHundredYen = Math.min(fiveHundredYen, Math.ceil(payment / 500));
const maxthousandYen = Math.min(thousandYen, Math.ceil(payment / 1000));
const maxfiveThousandYen = Math.min(fiveThousandYen, Math.ceil(payment / 5000));
const maxtenThousandYen = Math.min(tenThousandYen, Math.ceil(payment / 10000));

// 各硬貨の組み合わせを試す
for (let q = maxtenThousandYen; q >= 0 && minChange > 0; q--) {
    if (q * 10000 > maxPayment) continue;
for (let p = maxfiveThousandYen; p >= 0 && minChange > 0; p--) {
for (let o = maxthousandYen; o >= 0 && minChange > 0; o--) {
for (let n = maxfiveHundredYen; n >= 0 && minChange > 0; n--) {
for (let m = maxhundredYen; m >= 0 && minChange > 0; m--) {
for (let l = maxfiftyYen; l >= 0 && minChange > 0; l--) {
for (let k = maxTenYen; k >= 0 && minChange > 0; k--) {
for (let j = maxFiveYen; j >= 0 && minChange > 0; j--) {
for (let i = maxOneYen; i >= 0 && minChange > 0; i--) {

// 現在の支払い金額を計算
const currentPayment = i + (5 * j) + (10 * k) + (50 * l) + (100 * m) + (500 * n)  + (1000 * o) + (5000 * p) + (10000 * q);

// 支払額が要求額以上の場合
if (currentPayment >= payment && currentPayment <= maxPayment) {

// お釣りを計算
const change = currentPayment - payment;

// すでに計算されたお釣りの組み合わせがあれば、それを再利用
if (!memo.hasOwnProperty(change)) {

// 早期終了：お釣りが0の場合、これ以上計算する必要はない
if (change === 0) {
minChange = 0;
bestPayment = {
oneYen: i,
fiveYen: j,
tenYen: k,
fiftyYen: l,
hundredYen: m,
fiveHundredYen: n,
thousandYen: o,
fiveThousandYen: p,
tenThousandYen: q
};
bestChange = {
oneYen: 0,
fiveYen: 0,
tenYen: 0,
fiftyYen: 0,
hundredYen: 0,
fiveHundredYen: 0,
thousandYen: 0,
fiveThousandYen: 0,
tenThousandYen: 0
}; break;
}

// お釣りの各硬貨の枚数を計算
let changeOneYen = change % 5;
let changeFiveYen = (change % 10 - changeOneYen) / 5;
let changeTenYen = (change % 50 - changeFiveYen * 5 - changeOneYen) / 10;
let changeFiftyYen = (change % 100 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 50;
let changeHundredYen = (change % 500 - changeFiftyYen * 50 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 100;
let changeFiveHundredYen = (change % 1000 - changeHundredYen * 100 - changeFiftyYen * 50 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 500;
let changeThousandYen = (change % 5000 - changeFiveHundredYen * 500 - changeHundredYen * 100 - changeFiftyYen * 50 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 1000;
let changeFiveThousandYen = (change % 10000 - changeThousandYen * 1000 - changeFiveHundredYen * 500 - changeHundredYen * 100 - changeFiftyYen * 50 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 5000;
let changeTenThousandYen = (change - changeFiveThousandYen * 5000 - changeThousandYen * 1000 - changeFiveHundredYen * 500 - changeHundredYen * 100 - changeFiftyYen * 50 - changeTenYen * 10 - changeFiveYen * 5 - changeOneYen) / 10000;
                        
// お釣りの枚数の合計を計算
const totalChange = dp[change];

// メモ化オブジェクトにお釣りの組み合わせを保存
memo[change] = {
oneYen: changeOneYen,
fiveYen: changeFiveYen,
tenYen: changeTenYen,
fiftyYen: changeFiftyYen,
hundredYen: changeHundredYen,
fiveHundredYen: changeFiveHundredYen,
thousandYen: changeThousandYen,
fiveThousandYen: changeFiveThousandYen,
tenThousandYen: changeTenThousandYen,
totalChange: totalChange
};
}

// 最小のお釣り枚数を更新
if (memo[change].totalChange < minChange) {
minChange = memo[change].totalChange;

bestPayment = {
    oneYen: i,
    fiveYen: j,
    tenYen: k,
    fiftyYen: l,
    hundredYen: m,
    fiveHundredYen: n,
    thousandYen: o,
    fiveThousandYen: p,
    tenThousandYen: q
    };
    
bestChange = {
    oneYen: memo[change].oneYen,
    fiveYen: memo[change].fiveYen,
    tenYen: memo[change].tenYen,
    fiftyYen: memo[change].fiftyYen,
    hundredYen: memo[change].hundredYen,
    fiveYen: memo[change].fiveYen,
    fiveHundredYen: memo[change].fiveHundredYen,
    thousandYen: memo[change].thousandYen,
    fiveThousandYen: memo[change].fiveThousandYen,
    tenThousandYen: memo[change].tenThousandYen
    };
    if (minChange === 0) {
    break;
    }
    
}
}
}
}
}
}
}
}
}
}
}

self.postMessage({
    bestPayment: bestPayment,
    bestChange: bestChange,
    payment: payment,

    usedTotalAmount: bestPayment.oneYen + 5 * bestPayment.fiveYen + 10 * bestPayment.tenYen
    + 50 * bestPayment.fiftyYen + 100 * bestPayment.hundredYen + 500 * bestPayment.fiveHundredYen
    + 1000 * bestPayment.thousandYen + 5000 * bestPayment.fiveThousandYen + 10000 * bestPayment.tenThousandYen,

    changeTotalAmount: bestChange.oneYen + 5 * bestChange.fiveYen + 10 * bestChange.tenYen 
    + 50 * bestChange.fiftyYen + 100 * bestChange.hundredYen + 500 * bestChange.fiveHundredYen
    + 1000 * bestChange.thousandYen + 5000 * bestChange.fiveThousandYen + 10000 * bestChange.tenThousandYen,
    
    
    changeTotalCount: bestChange.oneYen + bestChange.fiveYen + bestChange.tenYen 
    + bestChange.fiftyYen + bestChange.hundredYen + bestChange.fiveHundredYen
    + bestChange.thousandYen + bestChange.fiveThousandYen + bestChange.tenThousandYen,
});
});


