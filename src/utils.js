export const createNeonMaterial = (name, color, scene) => {
    const material = new BABYLON.StandardMaterial(name, scene);
    material.emissiveColor = color;
    material.disableLighting = true;
    return material;
};