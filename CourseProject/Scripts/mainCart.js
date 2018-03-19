var MainCart = function(URL, cartId) {
    this.server = URL;
    this.cartId = cartId;
    this.data = [];
    this.cartList = '';
}

MainCart.prototype.generateContent = function(callback){
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
                cart.render();
            }
        }
    }
}

MainCart.prototype.render = function(){
    var cartTable = document.getElementById('cart-table').childNodes[1];
    var rowClone;
    var rowsQtty = cartTable.childNodes.length;
    for(var i = 1; i < rowsQtty; ++i){
        if(cartTable.lastChild.tagName == 'TR'){
            rowClone = cartTable.lastChild.cloneNode(true);
        }
        cartTable.removeChild(cartTable.lastChild);
    }
    var itemsQtty = this.data.length;
    var total = 0;
    for(var i = 0; i < itemsQtty; ++i){
        var newRow = rowClone.cloneNode(true);
        var dataItem = this.data[i];
        newRow.setAttribute('prodId',dataItem.prodId);
        newRow.childNodes[1].childNodes[1].src = 'pics/Layer%20' + (dataItem.prodId * 2) + '.jpg';
        newRow.childNodes[1].childNodes[3].childNodes[1].textContent =  dataItem.prodName; newRow.childNodes[1].childNodes[3].childNodes[3].childNodes[1].textContent = dataItem.prodColor;
        newRow.childNodes[1].childNodes[3].childNodes[5].childNodes[1].textContent = dataItem.prodSize;
        newRow.childNodes[3].textContent = '$' + dataItem.prodPrice;
        newRow.childNodes[5].childNodes[1].value = dataItem.prodQtty;
        newRow.childNodes[9].textContent = '$' + dataItem.prodPrice * dataItem.prodQtty;
        var MainCartI = this; // чтобы передать в функцию сразу 2 this
        newRow.childNodes[11].childNodes[1].addEventListener('click',function(){MainCartI.removeProdHandler(newRow.childNodes[11].childNodes[1])});
        console.log(newRow.childNodes[11].childNodes[1]);
        total += dataItem.prodPrice * dataItem.prodQtty;
        console.log(newRow.childNodes[9].textContent);
        cartTable.appendChild(newRow);
    }
    document.getElementById('cart-grand-total').textContent = '$'+total;
    document.getElementById('cart-sub-total').textContent = '$'+total;
}


MainCart.prototype.removeProdHandler = function(){
    var requestResult;
    var removedProd = event.target.parentNode.parentNode.parentNode;
    var removedId = removedProd.getAttribute('prodId');
    var removeRequest = {
        removeProd: true,
        prodId: removedId
    }    
    var xhr = new XMLHttpRequest();
    var cart = this;
    xhr.open('POST', this.server, true);
    xhr.timeout = 2000;
    xhr.ontimeout = function() {
        console.log('Server request timeout');
    }
    xhr.send(removeRequest);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                requestResult = JSON.parse(xhr.responseText);
                if(requestResult.result){
                    removedProd.parentNode.removeChild(removedProd);
                }
            }
        } 
    }
}



