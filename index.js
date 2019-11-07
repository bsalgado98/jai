import JaiBlob from './Objects/JaiBlob.js'
import getRandomFloat from './Utilities/getRandomFloat.js'
import orbit from './Utilities/orbit.js'
import colorSizeChange from './Utilities/colorSizeChange.js'

let scene, ambLight, light1, light2, light3, camera, renderer, composer, bloomPass;
let orbitSpeed = 30000;
const WIDTH = parseInt(getComputedStyle(document.getElementById("jai"))["width"])-50;
const COLORS = {
  YELLOW: 0xffff99,
  BLUE: 0x99ffff,
  PINK: 0xff0066,
  BLACK: 0x000000,
  WHITE: 0xffffff,
  PURPLE: 0x3B3B53
}

var blobs = [];
let blobGroup;
const blobFlags = [false, false, false];
let colorSizeSync = false;
let blobGroupSpin = true;

function setup() {
  //WORLD
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 5;
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setClearColor(COLORS.PURPLE, 0.2);
  renderer.setSize(WIDTH, WIDTH);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.domElement.style.marginLeft = `calc(50% - ${WIDTH/2}px)`;
  renderer.domElement.style.marginTop = `calc(50% - ${WIDTH/2}px)`;
  console.log(document.getElementById("confidence").value)
  renderer.domElement.style.filter = `blur(${document.getElementById("confidence").value}px)`;

  document.getElementById("jai").appendChild(renderer.domElement);

  ambLight = new THREE.AmbientLight(0x798296, 0.8);
  scene.add(ambLight);

  // let lightTop = new THREE.DirectionalLight(0xFFFFFF, .7);
  // lightTop.position.set(0, 500, 200);
  // lightTop.castShadow = true;
  // scene.add(lightTop);

  // let lightBottom = new THREE.DirectionalLight(0xFFFFFF, .25);
  // lightBottom.position.set(0, -500, 400);
  // lightBottom.castShadow = true;
  // scene.add(lightBottom);

  let lightFront = new THREE.DirectionalLight(0xffffff, 0.5);
  lightFront.position.set(0, 0, 200);
  lightFront.castShadow = true;
  scene.add(lightFront);

  // let renderPass = new RenderPass(scene, camera);

  // bloomPass = new UnrealBloomPass( new THREE.Vector2( width, width ), 0.0, 0.0, 0.0 );
  // bloomPass.threshold = 0;
  // bloomPass.strength = 0.9;
  // bloomPass.radius = -1.5;

  // composer = new EffectComposer(renderer);
  // composer.addPass(renderPass);
  // composer.addPass(bloomPass);

  //OBJECTS
  let yBlob = new JaiBlob(COLORS.YELLOW);
  yBlob.mesh.position.x -= 0.5;
  blobs.push(yBlob);

  let bBlob = new JaiBlob(COLORS.BLUE);
  bBlob.mesh.position.x += 0.5;
  blobs.push(bBlob);

  let rBlob = new JaiBlob(COLORS.PINK);
  rBlob.mesh.position.y += 1.0;
  blobs.push(rBlob);

  blobGroup = new THREE.Group();
  for(let b of blobs) {
    blobGroup.add(b.mesh);
  }
  scene.add(blobGroup);

  // backgroundSphere = new EnclosingSphere();
  // backgroundSphere.mesh.position.z = -10;
  // scene.add(backgroundSphere.mesh);
}

let simplex = new SimplexNoise();
const speed = 5.0;
const processing = 2.0;
const spikes = 0.3 * processing;
let randMult = 0.5;
let rand;
function animate() {
  if(blobGroupSpin) {
    blobGroup.rotation.y += 0.005;
    blobGroup.rotation.z += 0.005;
  }
  
  let orb = orbit(0.7, orbitSpeed);
  blobs[0].mesh.position.x = orb.x;
  blobs[0].mesh.position.y = orb.y;
  blobs[0].mesh.position.z = orb.z;

  blobs[1].mesh.position.x = orb.x;
  blobs[1].mesh.position.y = -orb.y;
  blobs[1].mesh.position.z = -orb.z;

  blobs[2].mesh.position.x = -orb.x;
  blobs[2].mesh.position.y = orb.y;
  blobs[2].mesh.position.z = orb.z;

  let time = performance.now() * 0.00001 * speed * Math.pow(processing, 3);
  for(let b of blobs) {
    rand = getRandomFloat(-randMult, randMult);
    for(let i = 0; i < b.geo.vertices.length; i++) {
      b.geo.vertices[i].normalize().multiplyScalar(1 + 0.3 * simplex.noise3D(b.geo.vertices[i].x * spikes, b.geo.vertices[i].y * spikes, b.geo.vertices[i].z * spikes + time+b.rand ));
    }
    b.geo.computeVertexNormals();
    b.geo.normalsNeedUpdate = true;
    b.geo.verticesNeedUpdate = true;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  for(let i = 0; i < 3; i++) {
    if(blobFlags[i]) {
      if(blobs[i].mat.opacity > 0.0) {
        blobs[i].mat.opacity -= 0.05;
      }
      else {
        blobs[i].mesh.visible = false;
        blobFlags[i] = false;
      }
    }
  }
  // composer.render();
}
function setupListeners() {
  // document.getElementById("jai-input").addEventListener("keyup", (e) => {
  //   if(e.keyCode == 13) {
  //     let node = document.createElement('h6');
  //     node.className = "response";
  //     node.innerHTML = e.target.value;
  //     node.style.opacity = 0;
  //     document.getElementById("responses-container").appendChild(node);
  //     node.style.transitionDuration = 1;
  //     node.style.opacity = 1;
  //     e.target.value = "";
  //   }
  // });

  document.getElementById("confidence").oninput = function() {
    renderer.domElement.style.filter = `blur(${this.value}px)`;
    document.getElementById("confidence-indicator").innerHTML = this.value
  };

  document.getElementById("orbit-speed").oninput = function() {
    orbitSpeed = this.value;
    document.getElementById("orbit-speed-indicator").innerHTML = this.value;
  }
  document.getElementById("group-spin").addEventListener("change", (e) => {
    blobGroupSpin = !blobGroupSpin;
  })

  for(let i = 0; i < 3; i++) {
    let currentCheckbox = document.getElementById(`color${i}-iso`);
    currentCheckbox.addEventListener('change', () => {
      if(currentCheckbox.checked) {
        blobFlags[i] = false;
        blobs[i].mat.transparent = false;
        blobs[i].mat.opacity = 1.0;
        blobs[i].mesh.visible = true;
      }
      else {
        blobs[i].mat.transparent = true;
        blobFlags[i] = true;
      }
    });
  }

  document.getElementById('color0-size').addEventListener("input", (e) => {
    if(colorSizeSync) {
      document.getElementById('color1-size').value = e.target.value;
      document.getElementById('color2-size').value = e.target.value;
      colorSizeChange(1, e.target.value, blobs);
      colorSizeChange(2, e.target.value, blobs);
    }
    colorSizeChange(0, e.target.value, blobs);
  });
  document.getElementById('color1-size').addEventListener("input", (e) => {
    if(colorSizeSync) {
      document.getElementById('color0-size').value = e.target.value;
      document.getElementById('color2-size').value = e.target.value;
      colorSizeChange(0, e.target.value, blobs);
      colorSizeChange(2, e.target.value, blobs);
    }
    colorSizeChange(1, e.target.value, blobs);
  });
  document.getElementById('color2-size').addEventListener("input", (e) => {
    if(colorSizeSync) {
      document.getElementById('color0-size').value = e.target.value;
      document.getElementById('color1-size').value = e.target.value;
      colorSizeChange(0, e.target.value, blobs);
      colorSizeChange(1, e.target.value, blobs);
    }
    colorSizeChange(2, e.target.value, blobs);
  });
  document.getElementById('color-size-sync').addEventListener("change", (e) => {
    colorSizeSync = !colorSizeSync;
    if(e.target.checked) {
      document.getElementById('color1-size').value = document.getElementById('color0-size').value;
      document.getElementById('color2-size').value = document.getElementById('color0-size').value;
      colorSizeChange(1, document.getElementById('color0-size').value, blobs);
      colorSizeChange(2, document.getElementById('color0-size').value, blobs);
    }
  });

  // document.getElementById('glow-amount').addEventListener("input", (e) => {
  //   bloomPass.strength = e.target.value;
  //   document.getElementById('glow-amount-indicator').innerHTML = e.target.value;
  // });

  let controlMenuFlag = false;
  document.getElementById("control-menu-opener").onclick = () => {
    controlMenuFlag = !controlMenuFlag;
    if(controlMenuFlag) {
      document.getElementById("control-menu").style.bottom = 0;
    }
    else {
      document.getElementById("control-menu").style.bottom = "-30%";
    }
  }
}
setup();
setupListeners();
animate();