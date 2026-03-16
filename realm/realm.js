let scene = new THREE.Scene();

/* SKY COLOR */
scene.background = new THREE.Color(0x0a0a18);

/* CAMERA */

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

/* RENDERER */

let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CAMERA START POSITION */

camera.position.set(0,2,6);

/* LIGHTING */

let light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,5);
scene.add(light);

let ambient = new THREE.AmbientLight(0x8888ff,0.5);
scene.add(ambient);

/* GROUND */

let groundGeo = new THREE.PlaneGeometry(50,50);

let groundMat = new THREE.MeshStandardMaterial({
color:0x228833
});

let ground = new THREE.Mesh(groundGeo,groundMat);

ground.rotation.x = -Math.PI/2;

scene.add(ground);

/* TREE FUNCTION */

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

/* CREATE RANDOM TREES */

for(let i=0;i<10;i++){
createTree(Math.random()*20-10,Math.random()*20-10);
}

/* MAGIC ORB */

let orb = new THREE.Mesh(

new THREE.SphereGeometry(.6),

new THREE.MeshStandardMaterial({
color:0x44aaff,
emissive:0x2266ff,
emissiveIntensity:2
})

);

orb.position.set(0,1,0);

scene.add(orb);

/* BOOK OBJECT */

let book = new THREE.Mesh(

new THREE.BoxGeometry(1,.3,1.5),

new THREE.MeshStandardMaterial({color:0x883322})

);

book.position.set(-4,1,0);

scene.add(book);

/* PORTAL */

let portal = new THREE.Mesh(

new THREE.TorusGeometry(1.5,.2,16,100),

new THREE.MeshStandardMaterial({
color:0xaa55ff,
emissive:0x5522aa,
emissiveIntensity:2
})

);

portal.position.set(4,2,0);

scene.add(portal);

/* FLOATING LABEL FUNCTION */

function createLabel(text,x,y,z){

let canvas = document.createElement("canvas");

let ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 256;

ctx.fillStyle="white";
ctx.font="bold 70px Arial";
ctx.textAlign="center";

ctx.shadowColor="cyan";
ctx.shadowBlur=25;

ctx.fillText(text,256,140);

let texture = new THREE.CanvasTexture(canvas);

let material = new THREE.SpriteMaterial({
map:texture,
transparent:true
});

let sprite = new THREE.Sprite(material);

sprite.position.set(x,y,z);

sprite.scale.set(4,2,1);

scene.add(sprite);

}

/* LABELS */

createLabel("ASSETS",0,3,0);

createLabel("ABOUT",-4,3,0);

createLabel("PORTAL",4,4,0);

/* MAGIC PARTICLES AROUND ORB */

let particles = [];

for(let i=0;i<40;i++){

let p = new THREE.Mesh(

new THREE.SphereGeometry(.05),

new THREE.MeshBasicMaterial({color:0x66ccff})

);

p.position.set(
Math.random()*2-1,
Math.random()*2+1,
Math.random()*2-1
);

scene.add(p);

particles.push(p);

}

/* MOVEMENT INPUT */

let keys={};

document.addEventListener("keydown",e=>keys[e.key]=true);

document.addEventListener("keyup",e=>keys[e.key]=false);

/* PLAYER MOVEMENT */

function updateMovement(){

if(keys["w"]) camera.position.z -= 0.1;
if(keys["s"]) camera.position.z += 0.1;
if(keys["a"]) camera.position.x -= 0.1;
if(keys["d"]) camera.position.x += 0.1;

}

/* FIRST PERSON MOUSE LOOK */

let yaw = 0;
let pitch = 0;

document.addEventListener("mousemove",(e)=>{

if(document.pointerLockElement === renderer.domElement){

yaw -= e.movementX * 0.002;
pitch -= e.movementY * 0.002;

pitch = Math.max(-1.5,Math.min(1.5,pitch));

camera.rotation.order="YXZ";
camera.rotation.y = yaw;
camera.rotation.x = pitch;

}

});

renderer.domElement.addEventListener("click",()=>{
renderer.domElement.requestPointerLock();
});

/* INTERACTION SYSTEM */

function checkInteraction(){

let distOrb = camera.position.distanceTo(orb.position);
let distBook = camera.position.distanceTo(book.position);
let distPortal = camera.position.distanceTo(portal.position);

let menu = document.getElementById("menu");

if(distOrb<2){

menu.style.display="block";

menu.innerHTML=
"<h3>Assets</h3><p>View SilverBloom Unity Assets</p>";

}

else if(distBook<2){

menu.style.display="block";

menu.innerHTML=
"<h3>About</h3><p>About SilverBloom Studios</p>";

}

else if(distPortal<2){

menu.style.display="block";

menu.innerHTML=
"<h3>Unity Asset Store</h3><button onclick='window.open(\"https://assetstore.unity.com/publishers\")'>Open Store</button>";

}

else{

menu.style.display="none";

}

}

/* ANIMATION LOOP */

function animate(){

requestAnimationFrame(animate);

/* movement */
updateMovement();

/* interaction */
checkInteraction();

/* orb animation */
orb.rotation.y += 0.01;

/* portal spin */
portal.rotation.z += 0.01;

/* particle animation */

particles.forEach(p=>{
p.position.y += Math.sin(Date.now()*0.002+p.position.x)*0.002;
});

/* render */

renderer.render(scene,camera);

}

animate();

/* HANDLE RESIZE */

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});
