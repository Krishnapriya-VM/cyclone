const addProductForm = document.getElementById('addProductForm')

const productname = document.getElementById('productname')
const procategory = document.getElementById('procategory')
const brandname = document.getElementById('brandname')
const stock = document.getElementById('stock')
const price = document.getElementById('price')
const description = document.getElementById('description')
const imgs = document.getElementById('imgs');
const main = document.getElementById('mainimage');


const productNameError = document.getElementById('productNameError')
const brandError = document.getElementById('brandError')
const descError = document.getElementById('descError')
const error6 = document.getElementById('error6')
const error7 = document.getElementById('error7')
const priceError = document.getElementById('priceError')
const catError = document.getElementById('catError')
const stockerr = document.getElementById('stockerr')

function pname(name)
{   
    if(name.trim()==="")
    {
        productNameError.innerHTML = "Please enter product name."
        productNameError.style.display = "block"
    }
    else{
        productNameError.innerHTML = ""
        productNameError.style.display = "none"
    }
}

function catval(name)
{   
    if(name.trim()==="")
    {
        catError.innerHTML = "Please select category."
        catError.style.display = "block"
    }
    else{
        catError.innerHTML = ""
        catError.style.display = "none"
    }
}

function brandVal(name){
    if(name.trim() === ""){
        brandError.innerHTML = "Please select brand!";
        brandError.style.display = "block";
    }else{
        brandError.innerHTML = ""
        brandError.style.display = "none"
    }
}

function stockVal(name)
{   
    if(name.trim()==="")
    {
        stockerr.innerHTML = "Please enter the stock."
        stockerr.style.display = "block"
    }
    else if(name <= 0)
    {
        stockerr.innerHTML = "Stock should not be zero or negative"
        stockerr.style.display = "block"
    }
    else{
        stockerr.innerHTML = ""
        stockerr.style.display = "none"
    }
}

function priceVal(name)
{   
    if(name.trim()==="")
    {
        priceError.innerHTML = "Please enter the price."
        priceError.style.display = "block"
    }
    else if(name <= 0)
    {
        priceError.innerHTML = "Stock should not be zero or negative"
        priceError.style.display = "block"
    }
    else{
        priceError.innerHTML = ""
        priceError.style.display = "none"
    }
}

function descVal(name)
{   
    if(name.trim()==="")
    {
        descError.innerHTML = "Please enter the description."
        descError.style.display = "block"
    }
    else{
        descError.innerHTML = ""
        descError.style.display = "none"
    }
}

function mainval(data,mmtype)
{
    if(data === 0)
    {
        error6.innerHTML = "Please select an Image."
        error6.style.display = "block"
    }
    else if(!mmtype.startsWith('image/'))
    {
        error6.innerHTML = "Please select Image Files Only."
        error6.style.display = "block"
    }
    else{
        error6.innerHTML = ""
        error6.style.display = "none"
    }
}


function imgsval(data,files)
{   
    let imgdat = []
    if(data == 0)
    {   
        error7.innerHTML = "Please select images."
        error7.style.display = "block"
    }
    else{
        for(let element of files){
            if(!element.type.startsWith('image/'))
            {
                imgdat.push(element) 
            }
        }
        console.log(imgdat)
        if(data !== 4)
        {
            error7.innerHTML = "Please select 4 images."
            error7.style.display = "block"
        }
        else if(imgdat.length > 0)
        {   
            error7.innerHTML = "Please select images Only."
            error7.style.display = "block"
        }
        else{
            error7.innerHTML = ""
            error7.style.display = "none"
        }
    }
    
}

productname.addEventListener('keyup',()=>{
    const fdata = productname.value
    pname(fdata)
})
productname.addEventListener('blur',()=>{
    const fdata = productname.value
    pname(fdata)
})


procategory.addEventListener('keyup',()=>{
    const fdata = procategory.value
    catval(fdata)
})
procategory.addEventListener('blur',()=>{
    const fdata = procategory.value
    catval(fdata)
})

brandname.addEventListener('keyup', () => {
    const fdata = brandname.value;
    brandVal(fdata);
})

brandname.addEventListener('blur', () => {
    const fdata = brandname.value;
    brandVal(fdata);
})

stock.addEventListener('keyup',()=>{
    const fdata = stock.value
    stockVal(fdata)
})
stock.addEventListener('blur',()=>{
    const fdata = stock.value
    stockVal(fdata)
})

price.addEventListener('keyup',()=>{
    const fdata = price.value
    priceVal(fdata)
})
price.addEventListener('blur',()=>{
    const fdata = price.value
    priceVal(fdata)
})

description.addEventListener('keyup',()=>{
    const fdata = description.value
    descVal(fdata)
})
description.addEventListener('blur',()=>{
    const fdata = description.value
    descVal(fdata)
})

imgs.addEventListener('change',()=>{
    const i1data = imgs.files.length
    const fileval = imgs.files
    console.log(fileval)
    imgsval(i1data,fileval)
})

main.addEventListener('change',()=>{
    const mdata = main.files.length
    let mmtype
    if(mdata){
         mmtype = main.files[0].type
    }
    mainval(mdata,mmtype)
})  


addProductForm.addEventListener('submit',(e)=>{
    const pdata = productname.value
    const ddata = description.value
    const catdata = procategory.value
    const bdata = brandname.value;
    const prdata = price.value
    const sdata = stock.value
    const mdata = main.files.length
    const i1data = imgs.files.length
    const fileval = imgs.files
    const mtype = main.files.length > 0 ? main.files[0].type : null

    imgsval(i1data,fileval)
    mainval(mdata,mtype)
    stockVal(sdata)
    priceVal(prdata)
    descVal(ddata)
    pname(pdata)
    catval(catdata)
    descVal(ddata)
    brandVal(bdata)

    if(productNameError.innerHTML !== "" || brandError.innerHTML !== "" || descError.innerHTML !=="" || error6.innerHTML !=="" || error7.innerHTML !==""|| priceError.innerHTML !==""|| catError.innerHTML !==""|| stockerr.innerHTML !=="" )
    {
        e.preventDefault()
    }
})


document.getElementById('mainimage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const imagePreviewContainer = document.getElementById('imagePreview');

    imagePreviewContainer.innerHTML = '';

    if (file) {
        const reader = new FileReader();
        const imagePreviewCont = document.createElement('div');
            const imagePreview = document.createElement('img');
            const removeButton = document.createElement('button');

            imagePreviewCont.className = 'preview-image-container';
            imagePreview.className = 'preview-image';
            imagePreview.style.display = 'none';
            imagePreview.src = '';
            imagePreview.alt = 'Preview';
            imagePreview.style.maxWidth = '100px';
            imagePreview.style.maxHeight = '100px';

        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);

        removeButton.textContent = 'X';
        removeButton.className = 'remove-image-btn';
        removeButton.style.right = '1rem';
        removeButton.addEventListener('click', function() {
            imagePreviewCont.removeChild(imagePreview);
            imagePreviewCont.removeChild(removeButton);
            document.getElementById('mainimage').value = '';
        });

        imagePreviewCont.appendChild(imagePreview);
        imagePreviewCont.appendChild(removeButton);
        imagePreviewContainer.appendChild(imagePreviewCont);
    }
});



document.getElementById('imgs').addEventListener('change', function(event) {
    const files = event.target.files;
    const imagePreviewsContainer = document.getElementById('imagePreviews');
    const fileInputs = [];

    imagePreviewsContainer.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file) {
            const reader = new FileReader();
            const imagePreviewContainer = document.createElement('div');
            const imagePreview = document.createElement('img');
            const removeButton = document.createElement('button');

            imagePreviewContainer.className = 'preview-image-container';
            imagePreview.className = 'preview-image';
            imagePreview.style.display = 'none';
            imagePreview.src = '';
            imagePreview.alt = 'Preview';
            imagePreview.style.maxWidth = '100px';
            imagePreview.style.maxHeight = '100px';

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };

            reader.readAsDataURL(file);

            removeButton.textContent = 'X';
            removeButton.className = 'remove-image-btn';
            removeButton.addEventListener('click', function() {
                imagePreviewsContainer.removeChild(imagePreviewContainer);
                fileInputs.forEach(function(input) {
                    input.value = '';
                });
            });

            imagePreviewContainer.appendChild(imagePreview);
            imagePreviewContainer.appendChild(removeButton);
            imagePreviewsContainer.appendChild(imagePreviewContainer);

            fileInputs.push(document.getElementById('imgs'));
        }
    }
});
