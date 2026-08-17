function checkInternet() {

    if (!navigator.onLine) {

        alert(
            "Internet connection nahi hai.\n\n" +
            "Please internet connect karke dobara try karein."
        );

        return false;
    }

    return true;
}


// Network status
window.addEventListener("offline", () => {

    alert(
        "Internet connection chala gaya hai.\n\n" +
        "Abhi aap offline hain."
    );

});


window.addEventListener("online", () => {

    console.log("Internet connection restored.");

});
