const EnclosingSphere = () => {
    this.geo = new THREE.SphereBufferGeometry(8, 32, 32);
    // let uni = THREE.UniformsUtils.clone(FresnelShader.uniforms);
    // uni["color"].value = new THREE.Color(COLORS.WHITE);
    // this.mat = new THREE.ShaderMaterial({
    //   uniforms: uni,
    //   vertexShader: FresnelShader.vertexShader,
    //   fragmentShader: FresnelShader.fragmentShader,
    //   transparent: true
    // })
    this.mat = new THREE.MeshPhysicalMaterial({
      color: COLORS.PURPLE
    })
    this.mesh = new THREE.Mesh(this.geo, this.mat);
  }
  export default EnclosingSphere