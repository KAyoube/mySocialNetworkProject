const changeF = document.getElementById('changeFirstname')
const changeL = document.getElementById('changeLastname')
const changeB = document.getElementById('changeBio')

const inputF = document.getElementById('editFirstname')
const inputL = document.getElementById('editLastname')
const inputB = document.getElementById('editBio')


changeF.addEventListener('click',()=>{
    inputF.style.display="block"
})


changeL.addEventListener('click',()=>{
    inputL.style.display="block"
})

changeB.addEventListener('click',()=>{
    inputB.style.display="block"
})

