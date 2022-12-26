


const koi =(n)=>{
  if(n<100 || n>999){return "Please enter valid number"}
  let sum1= 0;
  let check1 = false;
  for(let i=2; i<n; i++){
    if(n%i==0){
        sum+=1
    }
  }
  if(sum==0){
    check = true
  }
  let m = String(n).split("").reverse().join("")
  for(let i=2; i<n; i++){
    if(n%i==0){
        sum+=1
    }
  }
  if(sum==0){
    check = true
  }
}
console.log(koi(165))