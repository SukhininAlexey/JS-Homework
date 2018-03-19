window.onload = function (){
    var mySlider = new Slider('slider-1', 500, 300, '1s linear');
    mySlider.render();
    console.log(mySlider.getSliderObj());
    var FWD = document.getElementById('fwd');
    FWD.addEventListener('click',function(){
         mySlider.nextSlide.call(mySlider);
    });
    var BWD = document.getElementById('bwd');
    BWD.addEventListener('click',function(){
        mySlider.prevSlide.call(mySlider);
    });
    
}

function Slider(newSliderId, newSliderWidth, newSliderHeight, widthTransitionCSS){
    
    // Поля класса
    var currentPosition = 1;
    var sliderObj = document.getElementById(newSliderId);
    var slidesArray = [];
    var sliderWidth = newSliderWidth;
    var sliderHeight = newSliderHeight;
    var transition ='width ' + widthTransitionCSS;
    this.sliderObjy = sliderObj;
    this.slidesArrayy = slidesArray;
    
    // Геттеры
    this.getSliderObj = function(){
        return sliderObj;
    }
    this.getSlidesArray = function(){
        return slidesArray;
    }
    this.getSliderHeight = function(){
        return sliderHeight;
    }    
    this.getSliderWidth = function(){
        return sliderWidth;
    }
    this.getTransition = function(){
        return transition;
    }
    this.getCurrentPosition = function(){
        return currentPosition;
    }
    
    // Смысловые методы
    this.stepFwrd = function(){
        if(currentPosition + 1 >= slidesArray.length){
            return currentPosition = 0;
        }else{
            return ++currentPosition;
        }
    }
    this.stepBwrd = function(){
        if(currentPosition - 1 < 0){
            return currentPosition = slidesArray.length - 1;
        }else{
            return --currentPosition;
        }
    }
}

Slider.prototype.render = function(){
    var sliderObj = this.getSliderObj();
    sliderObj.style.display = 'none';
    console.log(sliderObj);
    var arrayOfSlides = this.getSlidesArray();
    
    while(sliderObj.hasChildNodes()){
        if(sliderObj.firstChild.tagName === 'DIV'){
            arrayOfSlides.push(sliderObj.firstChild);
        }
        sliderObj.removeChild(sliderObj.firstChild);
    }
    console.log(arrayOfSlides);
    
    var slidesWrapper = document.createElement('div');
    slidesWrapper.style.width = (this.getSliderWidth() * 3) + 'px';
    slidesWrapper.style.height = (this.getSliderHeight()) + 'px';
    slidesWrapper.style.margin = '0px -' + this.getSliderWidth() + 'px';
    slidesWrapper.style.display = 'flex';
    
    for(var i = 0; i < 3; ++i){
        slidesWrapper.appendChild(arrayOfSlides[i]);
    }
    
    sliderObj.appendChild(slidesWrapper);
    
    sliderObj.style.display = 'block';
}

    

Slider.prototype.nextSlide = function(){
    var slidesWrapper = this.getSliderObj().firstChild;
    var arrayOfSlides = this.getSlidesArray();
    
    var currentPosition = this.getCurrentPosition();
    var previousPosition = (function(){
        if(currentPosition - 1 < 0){
            return arrayOfSlides.length - 1;
        }else{
            return currentPosition - 1;
        }
    })();
    
    arrayOfSlides[previousPosition].style.transition = this.getTransition();
    arrayOfSlides[previousPosition].offsetHeight;
    arrayOfSlides[previousPosition].style.width = '0px';
    
    // Становимся в новую позицию
    currentPosition = this.stepFwrd();
    
    // Не следующая по счету позиция, а следующая загружаемая позиция
    var nextPosition = (function(){
        if(currentPosition + 1 >= arrayOfSlides.length){
            return 0;
        }else{
            return currentPosition + 1;
        }
    })();
    
console.log(this.getCurrentPosition());
    arrayOfSlides[previousPosition].addEventListener('transitionend', function(){
        slidesWrapper.removeChild(arrayOfSlides[previousPosition]);
        arrayOfSlides[previousPosition].removeAttribute('style');
        slidesWrapper.appendChild(arrayOfSlides[nextPosition]);
    }); 
}

Slider.prototype.prevSlide = function(){
    var slidesWrapper = this.getSliderObj().firstChild;
    var arrayOfSlides = this.getSlidesArray();
    
    var currentPosition = this.getCurrentPosition();;
    var nextPosition = (function(){
        if(currentPosition + 1 >= arrayOfSlides.length){
            return 0;
        }else{
            return currentPosition + 1;
        }
    })();
    
    slidesWrapper.removeChild(arrayOfSlides[nextPosition]);
    
    var currentPosition = this.stepBwrd();
    
    var previousPosition = (function(){
        if(currentPosition - 1 < 0){
            return arrayOfSlides.length - 1;
        }else{
            return currentPosition - 1;
        }
    })();
    
    console.log(this.getSliderWidth());
    
    arrayOfSlides[previousPosition].style.width = '0px';
    arrayOfSlides[previousPosition].style.transition = this.getTransition();
    slidesWrapper.insertBefore(arrayOfSlides[previousPosition],slidesWrapper.firstChild);
    
    // Если поставить комментарий ниже, то алгоритм заработает. Но пропадет анимация при движении слайдов влево
    arrayOfSlides[previousPosition].offsetHeight;
    arrayOfSlides[previousPosition].style.width = this.getSliderWidth() + 'px';

    
    arrayOfSlides[previousPosition].addEventListener('transitionend', function(){
        arrayOfSlides[previousPosition].removeAttribute('style');
    });
}








