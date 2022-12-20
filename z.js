// let obj = {"shipping": {'street': "132", 'city':'Jaipur', 'pincode': 303805},'billing': {'street': "132", 'city':'Jaipur', 'pincode': 303805}}

// let data = JSON.stringify(obj)

// let data1 = JSON.parse(data)

// console.log(typeof(data1))
// console.log(data1)



// function validPassword(password) {
//     let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
//     return regex.test(password);
// }
// console.log(validPassword("Aman@82780"))

const obj = {
    name : "                             MAN                    ",
    age:50
}


obj.name  = obj.name.trim()

console.log(obj.name)