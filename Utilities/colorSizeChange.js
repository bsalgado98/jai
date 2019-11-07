const colorSizeChange = (blobIndex, value, blobs) => {
    blobs[blobIndex].mesh.scale.x = value;
    blobs[blobIndex].mesh.scale.y = value;
    blobs[blobIndex].mesh.scale.z = value;
  }
export default colorSizeChange