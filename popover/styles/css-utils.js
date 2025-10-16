export function getPopoverElementCSS({ position, shouldUseAbsolutePosition, width = 400 }) {
    return `
    position: ${shouldUseAbsolutePosition ? 'fixed' : 'absolute'};
    left: ${position.x}px;
    top: ${position.y}px;
    width: ${width}px;
`;
}
