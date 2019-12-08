function isOutOfBounds(
    left: number,
    top: number,
    right: number,
    bottom: number,
    windowWidth: number,
    windowHeight: number
): boolean {
    return (left < 0 || right > windowWidth || top < 0 || bottom > windowHeight);
}