import getRandomFloat from '../Utilities/getRandomFloat.js'

const JaiBlob = function(color) {
    this.geo = new THREE.SphereGeometry(0.8, 32, 32);
    this.mat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: 0x3a3a3a,
      shininess: 0
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.rand = getRandomFloat(-2.5, 2.5);
  }
export default JaiBlob