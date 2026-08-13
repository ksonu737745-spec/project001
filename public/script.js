// ===========================
// PART 5 : script.js
// ===========================


// Sidebar

const sidebar = document.getElementById("sidebar");

const openBtn = document.getElementById("open");


// Open Sidebar

openBtn.addEventListener("click", function(e){

    e.stopPropagation();

    sidebar.classList.add("active");

});



// Close Sidebar Outside Click

document.addEventListener("click", function(e){


    if(
        !sidebar.contains(e.target) &&
        !openBtn.contains(e.target)
    ){

        sidebar.classList.remove("active");

    }


});





// Sidebar Active Menu


const menuItems = document.querySelectorAll(".sidebar a");


menuItems.forEach(function(item){


    item.addEventListener("click",function(){


        menuItems.forEach(function(link){

            link.style.background="";

            link.style.color="";

        });



        this.style.background="#2563eb";

        this.style.color="#fff";



        sidebar.classList.remove("active");


    });


});







// Hero Button Animation


const buttons = document.querySelectorAll(".btn1,.btn2");



buttons.forEach(function(btn){


    btn.addEventListener("mousedown",function(){

        btn.style.transform="scale(.95)";

    });



    btn.addEventListener("mouseup",function(){

        btn.style.transform="scale(1)";

    });



    btn.addEventListener("mouseleave",function(){

        btn.style.transform="scale(1)";

    });


});







// Service Card Animation


const cards = document.querySelectorAll(".card");



cards.forEach(function(card){



    card.addEventListener("mouseenter",function(){


        card.style.transform="translateY(-8px)";


    });



    card.addEventListener("mouseleave",function(){


        card.style.transform="translateY(0px)";


    });



});







// Contact Card Effect



const contactCards = document.querySelectorAll(".contact-box div");



contactCards.forEach(function(box){


    box.addEventListener("click",function(){


        box.style.background="#2563eb";

        box.style.color="#fff";



        setTimeout(function(){


            box.style.background="#fff";

            box.style.color="#1f2937";


        },300);



    });



});

