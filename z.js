function solution(a) {
    let b = String(a).split("").reverse().join("")
    let sum1 = 0
    let check1 = false
    for (let i = 2; i < a; i++) {
        if (a % i == 0) { sum1 += 1 }
    }
    console.log(sum1)
    if (sum1 == 0) { check1 = true }

    let sum2 = 0;
    let check2 = false
    for (let i = 2; i < b; i++) {
        if (b % i == 0) { sum2 += 1 }
        if (sum2 == 0) { check2 = true }
        console.log(check1, check2)
        return (check1 && check2) ? 1 : 0

    }
}
console.log(solution(563))