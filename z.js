let arr = [{
    name :"aman",
    value : 10
},
{
    name: "korvi",
    value : 20
},
{
    name : "shiivam",
    value : 30
},
{
    name : "vishal",
    value : 40
}]

let f ;
arr.forEach(x=>{
   delete x.value
})

console.log(f)
console.log(arr)