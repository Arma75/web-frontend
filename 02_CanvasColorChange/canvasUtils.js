function changeCanvasColor(context, originalImageData, srcColor, destColor) {
    if (!originalImageData) {
        return;
    }
    const newImageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );

    const data = newImageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r === srcColor.r && g === srcColor.g &&  b === srcColor.b) {
            data[i] = destColor.r;
            data[i + 1] = destColor.g;
            data[i + 2] = destColor.b;
        }
    }

    context.putImageData(newImageData, 0, 0);

    return newImageData;
}