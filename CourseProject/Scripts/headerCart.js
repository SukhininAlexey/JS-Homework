window.onload = function (){
    
    // Корзина в хедере для каждой страницы
    var cartList = new HeaderCart('http://localhost:3000/cart');
    cartList.generateContent();
    
    // Коризина в виде таблицы на странице корзины
    try{
        var cartTable = new MainCart('http://localhost:3000/cart');
        cartTable.generateContent();
    }catch(e){
        console.error(e);
    }
    
    // Добавление элементов в корзину
    var addButtons = document.getElementsByClassName('addto-cart-button');
    if(addButtons.length > 0){
        for(var i = 0; i < addButtons.length; ++i){
            addButtons[i].addEventListener('click', function(){cartList.addProdHandler(addButtons[i])});
        }
    }
}

var HeaderCart = function(URL, cartId) {
    this.server = URL;
    this.cartId = cartId;
    this.data = [];
    this.cartList = '';
}

HeaderCart.prototype.generateContent = function(){
    var xhr = new XMLHttpRequest();
    var cart = this;
    xhr.open('GET', this.server, true);
    xhr.timeout = 3000;
    xhr.ontimeout = function() {
        console.log('Server request timeout');
    }
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                cart.data = JSON.parse(xhr.responseText);
                return cart.render();
            }
        }
    }
}

HeaderCart.prototype.render = function(){
    var cart = this;
    var cartList = document.getElementById('header-cart');
    var cartListLength = cartList.childNodes.length;
    var cartListItemClone;
    for (var i = 0; i < cartListLength; i++){
        if(cartList.firstChild.tagName == 'DIV'){
            cartListItemClone = cartList.firstChild.cloneNode(true);
        }
        cartList.removeChild(cartList.firstChild);
    }
    
    var itemsQtty = this.data.length;
    var total = 0;
    for(var i = 0; i < itemsQtty; ++i){

        var newItem = cartListItemClone.cloneNode(true);
        var dataItem = this.data[i];
        newItem.childNodes[1].src = 'pics/Layer%20' + (dataItem.prodId * 2) + '.jpg';
        newItem.childNodes[3].childNodes[1].textContent = dataItem.prodName;
        for(var j = 0; j < 5; ++j){
            if(j < dataItem.prodRating){
                newItem.childNodes[3].childNodes[3].childNodes[1+j*2].classList = 'fa fa-star';
            }else{
                newItem.childNodes[3].childNodes[3].childNodes[1+j*2].classList = 'fa fa-star-o';
            }
        }
        newItem.childNodes[3].childNodes[5].textContent = dataItem.prodQtty + 'X$' + dataItem.prodPrice; 
        total += dataItem.prodPrice * dataItem.prodQtty;
        cartList.appendChild(newItem);
    }
    document.getElementById('cart-total').textContent = '$' + total;
}

HeaderCart.prototype.addProdHandler = function(){
    var requestResult;
    var addedId = event.target.getAttribute('prodid');
    var addRequest = {
        addProd: true,
        prodId: addedId
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.server, true);
    xhr.timeout = 2000;
    xhr.ontimeout = function() {
        console.log('Server request timeout');
    }
    xhr.send(addRequest);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                requestResult = JSON.parse(xhr.responseText);
            }
        } 
    }
}
