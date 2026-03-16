let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0,2,6);

let light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);

let groundGeo = new THREE.PlaneGeometry(50,50);
let groundMat = new THREE.MeshStandardMaterial({color:0x228833});
let ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

function createTree(x,z){

let trunk = new THREE.Mesh(
new THREE.CylinderGeometry(.2,.2,2),
new THREE.MeshStandardMaterial({color:0x8b5a2b})
);

let leaves = new THREE.Mesh(
new THREE.SphereGeometry(1),
new THREE.MeshStandardMaterial({color:0x228822})
);

trunk.position.set(x,1,z);
leaves.position.set(x,2.5,z);

scene.add(trunk);
scene.add(leaves);

}

for(let i=0;i<8;i++){
createTree(Math.random()*20-10,Math.random()*20-10);
}

let orb = new THREE.Mesh(
new THREE.SphereGeometry(.6),
new THREE.MeshStandardMaterial({color:0x44aaff,emissive:0x2266ff})
);
orb.position.set(0,1,0);
scene.add(orb);

let book = new THREE.Mesh(
new THREE.BoxGeometry(1,.3,1.5),
new THREE.MeshStandardMaterial({color:0x883322})
);
book.position.set(-4,1,0);
scene.add(book);

let portal = new THREE.Mesh(
new THREE.TorusGeometry(1.5,.2,16,100),
new THREE.MeshStandardMaterial({color:0xaa55ff,emissive:0x5522aa})
);
portal.position.set(4,2,0);
scene.add(portal);

let keys={};

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

function updateMovement(){

if(keys["w"])camera.position.z-=0.1;
if(keys["s"])camera.position.z+=0.1;
if(keys["a"])camera.position.x-=0.1;
if(keys["d"])camera.position.x+=0.1;

}

function checkInteraction(){

let distOrb = camera.position.distanceTo(orb.position);
let distBook = camera.position.distanceTo(book.position);
let distPortal = camera.position.distanceTo(portal.position);

let menu=document.getElementById("menu");

if(distOrb<2){
menu.style.display="block";
menu.innerHTML="<h3>Assets</h3><p>View Unity Assets</p>";
}

else if(distBook<2){
menu.style.display="block";
menu.innerHTML="<h3>About</h3><p>About SilverBloom Studios</p>";
}

else if(distPortal<2){
menu.style.display="block";
menu.innerHTML="<h3>Unity Asset Store</h3><button onclick='window.open(\"https://assetstore.unity.com\")'>Open Store</button>";
}

else{
menu.style.display="none";
}

}

function animate(){

requestAnimationFrame(animate);

updateMovement();

checkInteraction();

renderer.render(scene,camera);

}

animate();
