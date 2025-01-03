const express = require('express')
const app = express()


//1. Request Handler /test
app.use('/test',(req,res)=>{
console.log('This is Test Data Section');
res.send('Welcome in tes')
})

//2. Request Handler /hello
app.use('/hello',(req,res)=>{
    res.send('helloo hello hello - /hello ')
})
    


app.use((req,res)=>{
    res.send('Welcome to the application')
})

app.listen('3000',()=>{
console.log('Web Application Started');
})