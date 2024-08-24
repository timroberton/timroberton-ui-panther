export function renderRawImage(ctx, inputs, rpd) {
    const imageW = inputs.image.width;
    const imageH = inputs.image.height;
    const imageWtoH = imageW / imageH;
    const placeWtoH = rpd.w() / rpd.h();
    if (placeWtoH > imageWtoH) {
        const finalImageW = rpd.h() * imageWtoH;
        ctx.drawImage(inputs.image, rpd.x() + (rpd.w() - finalImageW) / 2, rpd.y(), finalImageW, rpd.h());
    }
    else {
        const finalImageH = rpd.w() / imageWtoH;
        ctx.drawImage(inputs.image, rpd.x(), rpd.y() + (rpd.h() - finalImageH) / 2, rpd.w(), finalImageH);
    }
}
