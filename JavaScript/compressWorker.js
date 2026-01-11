self.onmessage = (event) => {
	const file = event.data;

	createImageBitmap(file).then((bitmap) => {
		const canvas = new OffscreenCanvas(800, bitmap.height * (800 / bitmap.width));
		const ctx = canvas.getContext("2d");
		ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

		canvas.convertToBlob({ type: file.type, quality: 0.7 }).then((blob) => {
			self.postMessage(blob);
		});
	});
};
