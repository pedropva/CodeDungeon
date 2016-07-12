/**
 * Created by LAWS on 08/07/2016.
 */

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        //xmlLoader(xhttp);
        nSala(xhttp);
        descriptionRoom(xhttp);
    }
};

xhttp.open("GET", "https://dl.dropboxusercontent.com/u/85412057/room1.xml", true);
xhttp.send();

function xmlLoader(xml){
    var xmlDoc = xml.responseXML;
    document.getElementById("descriptionRoom").innerHTML =
        xmlDoc.getElementsByTagName("NumberRoom")[0].childNodes[0].nodeValue;
}
function nSala(xml){
    var xmlDoc = xml.responseXML;
    document.getElementById("roomNumber").innerHTML = "Sala: " +
        xmlDoc.getElementsByTagName("room")[0].attributes.getNamedItem("id").nodeValue;
}
function descriptionRoom(xml){
    var xmlDoc = xml.responseXML;
    document.getElementById("descriptionRoom").innerHTML =
        xmlDoc.getElementsByTagName("descriptionRoom")[0].childNodes[0].nodeValue;
}

function act(){
    var texto;
    texto = document.getElementById("texto").value;
    document.getElementById("resposta").innerHTML = "Ola "+texto+"!";
}